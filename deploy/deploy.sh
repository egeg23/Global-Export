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
as_app git fetch origin "$BRANCH"
as_app git checkout "$BRANCH"
as_app git reset --hard "origin/${BRANCH}"

# Полная установка, а не --omit=dev: tailwind, postcss и typescript лежат в
# devDependencies и нужны именно на сборке. Без них `npm run build` падает.
echo "→ Зависимости"
as_app npm ci

echo "→ Сборка"
as_app npm run build

# Порт службы живёт в .env.local: в юните EnvironmentFile подключается после
# Environment=PORT, поэтому значение из файла побеждает. Проверка обязана идти
# в тот же порт — иначе удачный деплой выглядит как падение, а на площадке
# при этом всё работает.
if [ -z "$PORT" ]; then
  PORT="$(sed -n 's/^[[:space:]]*PORT[[:space:]]*=[[:space:]]*\([0-9]\{1,5\}\).*/\1/p' .env.local | tail -n 1)"
  PORT="${PORT:-3210}"
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

# Второй проект живёт на своём корне и в витрину Global Export не входит.
# Если ветка его не содержит, это не ошибка — просто нечего показывать.
if curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/adar"; then
  echo "✓ Концепции ADAR отвечают: /adar"
else
  echo "· Концепций ADAR в этой ветке нет — пропускаем"
fi

echo "✓ Готово. Ветка на сервере: ${BRANCH}"
