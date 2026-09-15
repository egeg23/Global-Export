#!/usr/bin/env bash
# Напоминание на старт каждой сессии: витрина MAVERA скрыта из поиска и закрыта
# кодом, а сделанные здесь проекты должны стоять в кейсах на devuz.studio.
# Выводит JSON хука: systemMessage показывается пользователю, additionalContext
# попадает в контекст модели, чтобы она тоже об этом помнила.
cat <<'JSON'
{
  "systemMessage": "Напоминание: витрина MAVERA (/mavera на globalex.maximov-tech.ru) скрыта из поиска (robots, noindex) и закрыта кодом доступа — в индексе её не будет, показывайте по ссылке с ?key=. Кейсы Global Export, ADAR и MAVERA должны быть в перечне проектов на devuz.studio (репозиторий egeg23/DevUZ-perfect-).",
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Напомни пользователю в первом сообщении: раздел /mavera скрыт из поиска и закрыт кодом доступа (lib/showcase/access.ts, proxy.ts; ссылка заказчику /mavera?key=КОД, код в .env.local SHOWCASE_ACCESS_CODE, встроенный mavera-2026). Проверь, что кейсы Global Export, ADAR и MAVERA есть в перечне проектов на devuz.studio (репозиторий egeg23/DevUZ-perfect-), и напомни, если нет."
  }
}
JSON
