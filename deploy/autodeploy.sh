#!/usr/bin/env bash
# Автоматическая выкатка: раз в минуту сверяет ветку с GitHub и запускает
# deploy.sh, если она уехала вперёд. Запускается таймером systemd, руками
# трогать не нужно.
#
# Забирает код сам, а не ждёт, пока к нему постучатся: ни секретов на стороне
# GitHub, ни открытого наружу порта, ни ключа, который надо где-то хранить.
#
# Какую ветку показывает площадка — написано в /etc/globalex-branch.
# Файла нет — берётся та, на которой сейчас стоит рабочий каталог.
set -euo pipefail

APP_DIR="${APP_DIR:-/srv/globalex}"
APP_USER="${APP_USER:-globalex}"
BRANCH_FILE="${BRANCH_FILE:-/etc/globalex-branch}"

cd "$APP_DIR"
as_app() { runuser -u "$APP_USER" -- "$@"; }

branch="$(tr -d '[:space:]' < "$BRANCH_FILE" 2>/dev/null || true)"
if [ -z "$branch" ]; then
  branch="$(as_app git symbolic-ref --short HEAD)"
fi

as_app git fetch --quiet origin "$branch"

here="$(as_app git rev-parse HEAD)"
there="$(as_app git rev-parse "origin/${branch}")"

# Обычный исход: ничего не изменилось. Молчим, чтобы журнал не забивался
# шестьюдесятью строками в час.
[ "$here" = "$there" ] && exit 0

echo "→ ${branch}: ${here:0:7} → ${there:0:7}"
BRANCH="$branch" bash "${APP_DIR}/deploy/deploy.sh"
