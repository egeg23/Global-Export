#!/usr/bin/env bash
# Ставит и чинит демонстрационную площадку одной командой:
#
#   sudo bash /srv/globalex/deploy/setup.sh
#
# Скрипт идемпотентный — его можно запускать сколько угодно раз. Он сам
# подбирает свободный порт, приводит юнит и конфиг nginx в соответствие,
# пересобирает приложение и проверяет, что отвечает именно оно.
set -euo pipefail

APP_DIR="${APP_DIR:-/srv/globalex}"
APP_USER="${APP_USER:-globalex}"
SERVICE="${SERVICE:-globalex-demo}"
DOMAIN="${DOMAIN:-globalex.maximov-tech.ru}"
BRANCH="${BRANCH:-claude/global-export-website-u6yg03}"

say()  { printf '\n\033[1m→ %s\033[0m\n' "$*"; }
ok()   { printf '\033[32m✓ %s\033[0m\n' "$*"; }
die()  { printf '\n\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Запускать от root: sudo bash $0"
[ -d "$APP_DIR" ]    || die "Нет каталога $APP_DIR — сначала клонируйте репозиторий."

as_app() { runuser -u "$APP_USER" -- "$@"; }

# Сначала подтянуть свежий код, затем перезапустить себя уже из него: bash
# читает скрипт по мере выполнения, и правка файла на лету ломает разбор.
if [ -z "${SETUP_REEXEC:-}" ]; then
  say "Забираем ${BRANCH}"
  cd "$APP_DIR"
  as_app git fetch --quiet origin "$BRANCH"
  as_app git checkout --quiet "$BRANCH"
  as_app git reset --quiet --hard "origin/${BRANCH}"
  ok "$(as_app git log --oneline -1)"
  SETUP_REEXEC=1 exec bash "$0" "$@"
fi

cd "$APP_DIR"

# --- порт ------------------------------------------------------------------
port_taken() {
  ss -ltn 2>/dev/null | tail -n +2 | awk '{print $4}' | sed 's/.*://' | grep -qx "$1"
}

say "Подбираем свободный порт"
PORT=""
for candidate in 3210 3211 3212 3220 3310 3410 4310 4311; do
  if port_taken "$candidate"; then
    echo "   $candidate занят"
  else
    PORT="$candidate"; break
  fi
done
[ -n "$PORT" ] || die "Не нашлось свободного порта из списка. Освободите один или задайте вручную."
ok "порт $PORT"

# --- окружение -------------------------------------------------------------
[ -f "$APP_DIR/.env.local" ] || die "Нет $APP_DIR/.env.local — без него не будет ни базы, ни админки."

need=20
have="$(node -v 2>/dev/null | sed 's/^v//; s/\..*//')" || have=0
[ "${have:-0}" -ge "$need" ] || die "Нужен Node ${need}+, сейчас $(node -v 2>/dev/null || echo 'не установлен')."

# --- сборка ----------------------------------------------------------------
say "Зависимости и сборка"
as_app npm ci --no-audit --no-fund
as_app npm run build
ok "собрано"

# --- служба ----------------------------------------------------------------
say "Служба ${SERVICE}"
systemctl stop "$SERVICE" 2>/dev/null || true
systemctl reset-failed "$SERVICE" 2>/dev/null || true

sed "s|^Environment=PORT=.*|Environment=PORT=${PORT}|" \
  "$APP_DIR/deploy/globalex-demo.service" > "/etc/systemd/system/${SERVICE}.service"

systemctl daemon-reload
systemctl enable --quiet "$SERVICE"
systemctl start "$SERVICE"

# --- проверка --------------------------------------------------------------
say "Проверяем ответ"
for _ in $(seq 1 15); do
  title="$(curl -fsS "http://127.0.0.1:${PORT}/present" 2>/dev/null | grep -o '<title>[^<]*' | head -1 || true)"
  case "$title" in
    *"Global Export"*)
      ok "отвечает наше приложение: ${title#<title>}"
      answered=1
      break
      ;;
  esac
  sleep 2
done

if [ -z "${answered:-}" ]; then
  echo
  journalctl -u "$SERVICE" -n 25 --no-pager || true
  die "Приложение не поднялось. Лог выше."
fi

# --- nginx -----------------------------------------------------------------
say "nginx"
VHOST="/etc/nginx/sites-available/${SERVICE}"

if [ -f "$VHOST" ] && grep -q "ssl_certificate" "$VHOST"; then
  # certbot уже правил этот файл — трогаем только порт, чтобы не потерять
  # блок с сертификатом.
  sed -i -E "s|proxy_pass http://127\.0\.0\.1:[0-9]+;|proxy_pass http://127.0.0.1:${PORT};|g" "$VHOST"
  ok "порт обновлён, конфиг с сертификатом сохранён"
else
  sed -e "s|127\.0\.0\.1:3210|127.0.0.1:${PORT}|g" \
      -e "s|globalex\.maximov-tech\.ru|${DOMAIN}|g" \
      "$APP_DIR/deploy/globalex.nginx.conf" > "$VHOST"
  ok "конфиг записан"
fi

ln -sf "$VHOST" "/etc/nginx/sites-enabled/${SERVICE}"
nginx -t && systemctl reload nginx
ok "nginx перезагружен"

printf '\n\033[32m━━━ Готово ━━━\033[0m\n'
echo "Приложение:  http://127.0.0.1:${PORT}"
echo "Домен:       http://${DOMAIN}"
echo
echo "Дальше — сертификат, когда DNS-запись разойдётся:"
echo "  certbot --nginx -d ${DOMAIN}"
