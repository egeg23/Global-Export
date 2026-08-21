#!/usr/bin/env bash
# Разворачивает прототип на сервере. Запускать на самом сервере.
#
#   sudo bash /srv/globalex/deploy/deploy.sh
#
# Сборка идёт до перезапуска, так что площадка лежит ровно столько, сколько
# занимает рестарт службы.
set -euo pipefail

APP_DIR="${APP_DIR:-/srv/globalex}"
APP_USER="${APP_USER:-globalex}"
BRANCH="${BRANCH:-claude/global-export-website-u6yg03}"
SERVICE="${SERVICE:-globalex-demo}"
PORT="${PORT:-3100}"

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

echo "→ Перезапуск ${SERVICE}"
systemctl restart "$SERVICE"

echo "→ Проверка"
for attempt in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/present"; then
    echo "✓ Площадка отвечает на порту ${PORT}"
    exit 0
  fi
  sleep 2
done

echo "✗ Приложение не поднялось. Смотрите: journalctl -u ${SERVICE} -n 60 --no-pager"
exit 1
