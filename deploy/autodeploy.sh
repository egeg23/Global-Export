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

# Последний коммит, выкаченный до конца, и последняя неудачная попытка.
#
# Раньше сверялись с HEAD рабочего каталога. Но deploy.sh переводит каталог
# на новый коммит до сборки, и если сборка или перезапуск падали, HEAD уже
# совпадал с GitHub — автовыкатка считала, что делать нечего, и площадка
# оставалась на старой сборке до следующего слияния (07.10.2026 так застрял
# PR #36). Теперь «выкачено» — только то, что прошло deploy.sh целиком, а
# неудачную выкатку повторяем, но не чаще раза в RETRY_SEC.
STAMP="${STAMP:-${APP_DIR}/.deployed-commit}"
FAILED="${FAILED:-${APP_DIR}/.deploy-failed}"
RETRY_SEC="${RETRY_SEC:-600}"

as_app git fetch --quiet origin "$branch"

here="$(as_app git rev-parse HEAD)"
there="$(as_app git rev-parse "origin/${branch}")"
done_commit="$(tr -d '[:space:]' < "$STAMP" 2>/dev/null || true)"

# Обычный исход: ничего не изменилось. Молчим, чтобы журнал не забивался
# шестьюдесятью строками в час.
[ "$here" = "$there" ] && [ "$done_commit" = "$there" ] && exit 0

# Этот же коммит недавно не выкатился — ждём, а не пересобираем каждую минуту.
read -r failed_commit failed_at < "$FAILED" 2>/dev/null || true
if [ "${failed_commit:-}" = "$there" ] && [ $(( $(date +%s) - ${failed_at:-0} )) -lt "$RETRY_SEC" ]; then
  exit 0
fi

echo "→ ${branch}: ${done_commit:0:7}${done_commit:+ }${here:0:7} → ${there:0:7}"
if BRANCH="$branch" bash "${APP_DIR}/deploy/deploy.sh"; then
  echo "$there" > "$STAMP"
  rm -f "$FAILED"
else
  echo "$there $(date +%s)" > "$FAILED"
  echo "✗ Выкатка ${there:0:7} не прошла — повторим через $(( RETRY_SEC / 60 )) мин. Журнал: journalctl -u globalex-autodeploy -n 200 --no-pager"
  exit 1
fi
