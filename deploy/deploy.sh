#!/usr/bin/env bash
# Разворачивает прототип на сервере. Запускать на самом сервере.
#
#   sudo bash /srv/globalex/deploy/deploy.sh
#
# Ветка берётся из BRANCH — по умолчанию основная. Чтобы выкатить другую
# (например, с концепциями для второго заказчика):
#
#   sudo BRANCH=claude/adar-uz-design-concepts-c6fbwj bash /srv/globalex/deploy/deploy.sh
#
# Сервер остаётся на той ветке, которую выкатили последней: следующий запуск
# без BRANCH вернёт основную и уберёт всё, чего в ней нет.
#
# Сборка идёт до перезапуска, так что площадка лежит ровно столько, сколько
# занимает рестарт службы.
set -euo pipefail

# Тело обёрнуто в функцию не для красоты: ниже `git reset --hard` перезаписывает
# этот самый файл, а bash читает скрипт по мере выполнения и продолжил бы читать
# уже новую версию с середины. Определение функции разбирается целиком до
# первого запуска, поэтому меняться под собой файлу больше нечем.
main() {

  APP_DIR="${APP_DIR:-/srv/globalex}"
  APP_USER="${APP_USER:-globalex}"
  BRANCH="${BRANCH:-claude/global-export-website-u6yg03}"
  SERVICE="${SERVICE:-globalex-demo}"
  # Пусто — возьмём порт из .env.local, потому что служба берёт его оттуда же.
  PORT="${PORT:-}"

  if [ "$(id -u)" -ne 0 ]; then
    echo "✗ Запускать от root: перезапуск службы требует прав, а сборка — наоборот, их сброса."
    exit 1
  fi

  cd "$APP_DIR"

  # Сборка идёт от владельца каталога, а не от root: иначе .next достанется root,
  # и служба под globalex не сможет писать туда кеш изображений.
  as_app() { runuser -u "$APP_USER" -- "$@"; }

  # Одна выкатка за раз: автовыкатка по таймеру и ручной запуск, сойдясь,
  # собирают в один .next и ломают друг другу сборку (07.10.2026 так и
  # было: «Another next build process is already running», а следом —
  # испорченный .next/build). Вторая ждёт, пока первая закончит.
  exec 9>/run/globalex-deploy.lock
  if ! flock -w 1800 9; then
    echo "✗ Другая выкатка идёт больше 30 минут — эту пропускаем"
    exit 1
  fi

  need=20
  have="$(node -v 2>/dev/null | sed 's/^v//; s/\..*//')" || have=0
  if [ "${have:-0}" -lt "$need" ]; then
    echo "✗ Нужен Node ${need}+ (сейчас: $(node -v 2>/dev/null || echo 'не установлен'))."
    echo "  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs"
    exit 1
  fi

  if [ ! -f .env.local ]; then
    echo "✗ Нет .env.local — без него не будет ни базы, ни админки."
    echo "  Скопируйте .env.example и заполните."
    exit 1
  fi

  # Порт службы живёт в .env.local: в юните EnvironmentFile подключается после
  # Environment=PORT, поэтому значение из файла побеждает. Проверка обязана идти
  # в тот же порт — иначе удачный деплой выглядит как падение, а на площадке
  # при этом всё работает.
  if [ -z "$PORT" ]; then
    PORT="$(sed -n 's/^[[:space:]]*PORT[[:space:]]*=[[:space:]]*\([0-9]\{1,5\}\).*/\1/p' .env.local | tail -n 1)"
    PORT="${PORT:-3210}"
  fi

  # Порт службы и порт в конфиге nginx — два разных файла, и разъезжаются они
  # молча: локально всё отвечает, а снаружи 502. Сверяем до перезапуска.
  nginx_conf="/etc/nginx/sites-enabled/${SERVICE}"
  if [ -r "$nginx_conf" ]; then
    nginx_port="$(sed -n 's|.*proxy_pass[[:space:]]*http://127\.0\.0\.1:\([0-9]\{1,5\}\).*|\1|p' "$nginx_conf" | head -n 1)"
    if [ -n "$nginx_port" ] && [ "$nginx_port" != "$PORT" ]; then
      echo "✗ Порты разошлись: служба на ${PORT}, nginx ждёт на ${nginx_port}."
      echo "  Снаружи это 502, хотя локально всё отвечает. Привести к одному:"
      echo "    sed -i '/^PORT=/d' ${APP_DIR}/.env.local"
      echo "    echo PORT=${nginx_port} >> ${APP_DIR}/.env.local"
      echo "  и запустить деплой заново."
      exit 1
    fi
  fi


  # Рабочее дерево на сервере иногда правят руками. `reset --hard` ниже стирал
  # такие правки молча, и заметно это стало только когда `checkout` на другую
  # ветку отказался их перезаписывать. Поэтому сначала откладываем: патч в
  # /var/backups и запись в stash, откуда всё возвращается одной командой.
  if ! as_app git diff --quiet HEAD; then
    stamp="$(date +%Y%m%d-%H%M%S)"
    backup="/var/backups/globalex-local-${stamp}.patch"
    mkdir -p /var/backups
    as_app git diff HEAD > "$backup"
    as_app git stash push -m "deploy ${stamp}"
    echo "· Локальные правки отложены, деплой продолжается."
    echo "  Копия: ${backup}"
    echo "  Вернуть: sudo -u ${APP_USER} git -C ${APP_DIR} stash pop"
  fi

  echo "→ Забираем ${BRANCH}"
  # Путь к GitHub у сервера в России иногда рвётся — тогда тот же
  # репозиторий по HTTPS (он публичный). Тайм-ауты — чтобы выкатка не висела.
  if ! timeout 120 runuser -u "$APP_USER" -- env GIT_TERMINAL_PROMPT=0 GIT_SSH_COMMAND="ssh -o BatchMode=yes -o ConnectTimeout=10" git fetch origin "$BRANCH"; then
    echo "· origin не ответил — забираем ${BRANCH} по HTTPS"
    timeout 180 runuser -u "$APP_USER" -- env GIT_TERMINAL_PROMPT=0 git fetch "${FALLBACK_URL:-https://github.com/egeg23/Global-Export.git}" "+refs/heads/${BRANCH}:refs/remotes/origin/${BRANCH}"
  fi
  as_app git checkout "$BRANCH"
  as_app git reset --hard "origin/${BRANCH}"

  # Полная установка, а не --omit=dev: tailwind, postcss и typescript лежат в
  # devDependencies и нужны именно на сборке. Без них `npm run build` падает.
  echo "→ Зависимости"
  as_app npm ci

  echo "→ Сборка"
  # .next/build — служебные куски самого сборщика (postcss и т. п.), площадке
  # они не нужны. Оборванная сборка оставляет их битыми, и следующая падает
  # на «Cannot find module '@vercel/turbopack/postcss'» — поэтому каждый раз
  # с чистого листа. Не прошла сборка — ещё раз, без кеша сборщика.
  rm -rf .next/build
  if ! as_app npm run build; then
    echo "· сборка не прошла — повторяем без кеша сборщика"
    rm -rf .next/build .next/cache
    as_app npm run build
  fi

  echo "→ Перезапуск ${SERVICE} (порт ${PORT})"
  systemctl restart "$SERVICE"

  echo "→ Проверка"
  for attempt in 1 2 3 4 5 6 7 8 9 10; do
    if curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/present"; then
      echo "✓ Площадка отвечает на порту ${PORT}"
      break
    fi
    if [ "$attempt" = 10 ]; then
      echo "✗ Приложение не поднялось. Смотрите: journalctl -u ${SERVICE} -n 60 --no-pager"
      exit 1
    fi
    sleep 2
  done

  # Витрина открыта поиску (решение владельца от 29.09.2026, lib/showcase/seo).
  # Заголовок noindex на уровне nginx ставился при первой установке
  # (setup.sh), и из репозитория его уже не достать: живой конфиг дописал
  # certbot, поэтому целиком файл не переписываем — убираем ровно эту строку,
  # проверяем nginx и только тогда перезагружаем. Не прошла проверка —
  # возвращаем файл как был, выкатка приложения от этого не страдает.
  #
  # Конфиг ищем не по имени, а по тому, что он проксирует наш порт: на
  # живом сервере файл назывался иначе, чем служба, и прежняя проверка
  # (29.09.2026) его не нашла. Строку тоже узнаём по смыслу — любая
  # `add_header X-Robots-Tag … noindex …`, в каких бы кавычках и с какими
  # пробелами её ни записали.
  robots_re='^[[:space:]]*add_header[[:space:]]+X-Robots-Tag[^;]*noindex[^;]*;'
  for link in /etc/nginx/sites-enabled/*; do
    vhost="$(readlink -f "$link" 2>/dev/null || true)"
    [ -n "$vhost" ] && [ -f "$vhost" ] || continue
    grep -q "127.0.0.1:${PORT}" "$vhost" || continue
    grep -Eq "$robots_re" "$vhost" || continue
    mkdir -p /var/backups
    saved="/var/backups/$(basename "$vhost").$(date +%Y%m%d-%H%M%S)"
    cp "$vhost" "$saved"
    sed -Ei "/${robots_re}/d" "$vhost"
    if nginx -t >/dev/null 2>&1 && systemctl reload nginx; then
      echo "✓ nginx: заголовок noindex снят в ${vhost}, витрина открыта поиску (копия: ${saved})"
    else
      cp "$saved" "$vhost"
      echo "✗ nginx не принял правку — ${vhost} возвращён как был: ${saved}"
    fi
  done

  # Второй проект живёт на своём корне и в витрину Global Export не входит.
  # Если ветка его не содержит, это не ошибка — просто нечего показывать.
  if curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/adar"; then
    echo "✓ Концепции ADAR отвечают: /adar"
  else
    echo "· Концепций ADAR в этой ветке нет — пропускаем"
  fi

  echo "✓ Готово. Ветка на сервере: ${BRANCH}"
}

main "$@"
