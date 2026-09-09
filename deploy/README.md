# Демонстрационная площадка

Разворачивание прототипа на поддомене `globalex.maximov-tech.ru`, где заказчик
может всё потыкать: сайт на трёх языках, две концепции оформления, страницу с
анимацией и панель управления.

Площадка работает как обычное Node-приложение за nginx — так же, как боевой
сайт потом. Статическая выгрузка не подошла бы: без сервера не работают ни
админка, ни форма заявки, ни определение языка по браузеру.

---

## 1. DNS

У регистратора домена `maximov-tech.ru` добавить запись:

| Тип | Имя | Значение |
|---|---|---|
| A | `globalex` | IP вашего сервера |

Проверить, что разошлось: `dig +short globalex.maximov-tech.ru`

## 2. Свободный порт

Приложение слушает петлевой интерфейс, наружу его отдаёт nginx. По умолчанию
взят 3210, но на сервере с другими Node-проектами это надо проверить: заняты
чаще всего 3000 и 3100, а Next.js при занятом порте не перескакивает на
соседний — он падает с `EADDRINUSE` и уходит в цикл перезапусков.

```bash
ss -ltn | grep -q ':3210 ' && echo "занят — возьмите другой" || echo "3210 свободен"
```

Если занят, выберите свободный. Задаётся он в `.env.local` строкой `PORT=`:
юнит подключает этот файл после собственного `Environment=PORT`, поэтому
значение оттуда побеждает, и `deploy.sh` читает его же для проверки. Второе
место — `proxy_pass` в `deploy/globalex.nginx.conf` (там два вхождения).

## 3. Код на сервер

Репозиторий публичный, рабочая ветка стоит основной — токен и `git checkout`
не нужны.

Приложение получает собственного системного пользователя без оболочки. На
сервере, где рядом работают другие проекты, публично доступное приложение не
должно иметь доступа ни к чему за пределами своего каталога.

```bash
adduser --system --group --home /srv/globalex --shell /usr/sbin/nologin globalex
sudo -u globalex git clone https://github.com/egeg23/Global-Export.git /srv/globalex
cd /srv/globalex
```

Нужен Node 20 или новее — Next.js 16 на более старом не соберётся:

```bash
node -v || (curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs)
```

## 4. Переменные окружения

Заполнить `/srv/globalex/.env.local` (файл читают и сборка, и служба):

```ini
NEXT_PUBLIC_SITE_URL=https://globalex.maximov-tech.ru
NEXT_PUBLIC_SUPABASE_URL=https://<проект>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<публичный ключ>

# На демонстрации корень открывает витрину, а не сам сайт.
SHOWCASE_ROOT=true

# Форма заявки без канала доставки в продакшене отдаёт ошибку, чтобы заявки
# не терялись молча. На площадке это мешает показу, поэтому разрешаем.
LEAD_ALLOW_UNCONFIGURED=true
```

Права — только владельцу:

```bash
chown globalex:globalex /srv/globalex/.env.local && chmod 600 /srv/globalex/.env.local
```

**Файл должен существовать до сборки.** Переменные `NEXT_PUBLIC_*` вшиваются в
бандл на этапе сборки, а не читаются при запуске.

## 5. Служба

Всё, что ниже, делает один скрипт — он же чинит уже установленную площадку:

```bash
sudo bash /srv/globalex/deploy/setup.sh
```

Скрипт идемпотентный: подтягивает ветку, подбирает свободный порт, собирает,
приводит юнит и конфиг nginx в соответствие, перезапускает службу и проверяет,
что отвечает именно это приложение, а не соседнее на том же порту. Если certbot
уже правил конфиг nginx, скрипт меняет в нём только порт и не трогает блок с
сертификатом.

Дальше — то же самое руками, если нужен контроль над каждым шагом.

Сборка идёт от того же пользователя, что и служба, — иначе `.next` достанется
root, и приложение не сможет писать туда кеш изображений.

```bash
cd /srv/globalex
sudo -u globalex npm ci
sudo -u globalex npm run build
```

```bash
cp deploy/globalex-demo.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now globalex-demo
systemctl status globalex-demo --no-pager
```

Приложение слушает `127.0.0.1:3210` — наружу оно не смотрит, только через nginx.
Если порт занят, поменять его в двух местах: `PORT` в юните и `proxy_pass` в
конфиге nginx.

## 6. nginx

```bash
sudo cp deploy/globalex.nginx.conf /etc/nginx/sites-available/globalex-demo
sudo ln -s /etc/nginx/sites-available/globalex-demo /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 7. Сертификат

Только после того, как DNS разошёлся — certbot проверяет домен через него:

```bash
sudo certbot --nginx -d globalex.maximov-tech.ru
```

certbot сам допишет ssl-блок и редирект с 80 порта в тот же файл.

## 8. Наполнение базы

Один раз, чтобы в админке было что редактировать:

```bash
cd /srv/globalex
sudo -u globalex env \
  SUPABASE_URL=https://<проект>.supabase.co \
  SUPABASE_KEY=<публичный ключ> \
  SEED_EMAIL=<почта админа> \
  SEED_PASSWORD=<пароль> \
  node scripts/seed.mjs
```

---

## Обновление

```bash
sudo bash /srv/globalex/deploy/deploy.sh
```

Скрипт забирает ветку, ставит зависимости, собирает, перезапускает службу и
проверяет, что площадка отвечает. Если нет — печатает, куда смотреть.

### Автоматическая выкатка

Push в ветку площадки — и она обновляется сама: GitHub Actions заходит по ssh
и запускает тот же `deploy.sh`. Лог видно во вкладке **Actions**, там же кнопка
повторить, если сеть моргнула.

Настраивается один раз. Всё, что ниже, — на сервере от root.

**1. Пользователь для выкатки.** Отдельный, не root: у него будет право
запустить ровно один скрипт и ничего больше.

```bash
adduser --disabled-password --gecos "" deploy
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
```

**2. Ключ.** Создаётся на сервере, чтобы закрытая половина никуда не ездила,
кроме секретов GitHub.

```bash
sudo -u deploy ssh-keygen -t ed25519 -N "" -C "github-actions" -f /home/deploy/.ssh/github-actions
```

```bash
sudo -u deploy bash -c "cat /home/deploy/.ssh/github-actions.pub >> /home/deploy/.ssh/authorized_keys && chmod 600 /home/deploy/.ssh/authorized_keys"
```

**3. Обёртка и право её запускать.** Sudoers разрешает не `bash`, а один файл
с проверкой аргумента внутри.

```bash
install -m 755 /srv/globalex/deploy/globalex-deploy /usr/local/sbin/globalex-deploy
```

```bash
echo "deploy ALL=(root) NOPASSWD: /usr/local/sbin/globalex-deploy" > /etc/sudoers.d/globalex-deploy
chmod 440 /etc/sudoers.d/globalex-deploy
visudo -c
```

**4. Отпечаток сервера.** Строку целиком — в секрет `DEPLOY_HOST_KEY`. Имя в
начале строки должно совпадать с тем, что положите в `DEPLOY_HOST`.

```bash
echo "globalex.maximov-tech.ru $(cut -d' ' -f1,2 /etc/ssh/ssh_host_ed25519_key.pub)"
```

**5. Закрытый ключ.** Вывод целиком, вместе со строками `BEGIN`/`END`, — в
секрет `DEPLOY_KEY`.

```bash
cat /home/deploy/.ssh/github-actions
```

**6. В GitHub**, Settings → Secrets and variables → Actions:

| Что | Где | Значение |
|---|---|---|
| `DEPLOY_HOST` | Secrets | `globalex.maximov-tech.ru` |
| `DEPLOY_USER` | Secrets | `deploy` |
| `DEPLOY_KEY` | Secrets | закрытый ключ из шага 5 |
| `DEPLOY_HOST_KEY` | Secrets | строка из шага 4 |
| `DEPLOY_BRANCH` | **Variables** | ветка, которую показывает площадка |

`DEPLOY_BRANCH` — единственное место, где написано, что сейчас на площадке.
Не задана — берётся основная ветка репозитория. Push в любую другую ветку
задачу не запускает: она пропускается сразу, не тратя время сборщика.

Право у пользователя `deploy` ровно одно — выкатить ветку этого репозитория.
Это то же самое, что и право писать в репозиторий: кто может запушить ветку,
тот и так определяет, какой код там окажется.

### Другая ветка

Ветка задаётся переменной `BRANCH`. Так на площадку выкатывается работа,
которой ещё нет в основной ветке, — например концепции второго проекта:

```bash
sudo BRANCH=claude/adar-uz-design-concepts-c6fbwj bash /srv/globalex/deploy/deploy.sh
```

Сервер остаётся на той ветке, которую выкатили последней. Следующий запуск
без `BRANCH` вернёт основную — и всё, чего в ней нет, с площадки исчезнет.
Чтобы этого не случилось, ветку лучше влить в основную и выкатывать её.

## Если что-то не работает

| Симптом | Куда смотреть |
|---|---|
| 502 от nginx | `systemctl status globalex-demo`, `journalctl -u globalex-demo -n 60` |
| `EADDRINUSE` в логе, служба в цикле перезапусков | Порт занят другим приложением. Сменить `PORT=` в `.env.local` и `proxy_pass` в конфиге nginx, затем `systemctl reset-failed globalex-demo` |
| `deploy.sh` пишет «не поднялось», а площадка при этом открывается | Служба слушает не тот порт, который проверяет скрипт. Сверьте `PORT=` в `.env.local` с выводом `journalctl -u globalex-demo -n 20` |
| Страницы отдают 404, хотя маршруты есть | Скорее всего отвечает чужое приложение на том же порту — проверьте `ss -ltnp \| grep <порт>` |
| Actions падает на `Permission denied (publickey)` | Открытый ключ не попал в `/home/deploy/.ssh/authorized_keys`, либо `DEPLOY_USER` не тот |
| Actions падает на `Host key verification failed` | Имя в `DEPLOY_HOST_KEY` не совпадает с `DEPLOY_HOST`, либо на сервере переставлен ssh |
| Push прошёл, а задача не запустилась | Ветка не совпала с переменной `DEPLOY_BRANCH` |
| Сборка падает | Node ниже 20; либо `npm ci` был запущен с `--omit=dev` — tailwind и typescript нужны на сборке |
| `EACCES` при сборке или пустые картинки | Каталог или `.next` принадлежат root: `chown -R globalex:globalex /srv/globalex` |
| Пустой сайт, но страницы открываются | Не заполнена база: `node scripts/seed.mjs` |
| Админка не пускает | Проверить, что пользователь есть в таблице `admins` |
| Фотографии из админки не грузятся | `NEXT_PUBLIC_SUPABASE_URL` должен совпадать с тем, что в `next.config.ts` попадает в `remotePatterns` — он читается из этой же переменной на сборке |

## Что показать заказчику

Одна ссылка: **https://globalex.maximov-tech.ru** — она открывает витрину со
всеми разделами. Вверху витрины стоит переключатель проектов, так что со
второго заказчика площадка открывается той же ссылкой.

| Ссылка | Кому | Что там |
|---|---|---|
| `/` | Global Export | Витрина: сайт на трёх языках, две концепции, анимация, панель |
| `/adar` | ADAR | Три варианта главной со сметой по каждому и построчным сравнением |
| `/adar/base`, `/adar/plus`, `/adar/premium` | ADAR | Сами варианты, каждый со сметой внизу страницы |

### Доступ в панель на площадке

Пароля нет: ссылка `/admin` открывает панель сразу, а `/admin/login` ведёт
туда же. Так работает **только при `SHOWCASE_ROOT=true`** — на сайте компании
вход остаётся обычным, и ни одна из этих поблажек в тот сборочный вариант не
попадает.

Под капотом запрос всё-таки подписывается учётной записью: писать в базу
может только пользователь из списка администраторов, и это правило стоит в
самой базе. Вход выполняет сервер в `lib/supabase/session.ts` — учётка задаётся
парой переменных, по умолчанию `demo@globalex.uz` / `demo`:

```ini
# Необязательно: значения по умолчанию совпадают с учёткой, заведённой при
# развёртывании площадки.
SHOWCASE_DEMO_EMAIL=demo@globalex.uz
SHOWCASE_DEMO_PASSWORD=demo
```

Если учётки в базе нет или база спит (бесплатный тариф Supabase усыпляет
проект после недели простоя), панель всё равно откроется — но пустой, и скажет
об этом в боковой колонке. Разбудить проект: Supabase → проект → **Restore**.

Учётная запись полноценная, с правом изменять содержимое: заказчику интереснее
попробовать, чем посмотреть на заблокированные кнопки. Поэтому площадка не
должна содержать ничего, что жалко потерять, — а содержимое восстанавливается
одной командой:

```bash
cd /srv/globalex
sudo -u globalex env \
  SUPABASE_URL=https://<проект>.supabase.co \
  SUPABASE_KEY=<публичный ключ> \
  SEED_EMAIL=demo@globalex.uz SEED_PASSWORD=demo \
  node scripts/seed.mjs
```

Скрипт перезаписывает записи по их адресам, поэтому исправленные тексты
вернутся к исходным. Загруженные через панель фотографии он не трогает.

Перед передачей сайта компании демо-доступ нужно убрать. Сначала снять
`SHOWCASE_ROOT` (без него панель снова требует вход), затем удалить учётку:

```sql
delete from public.admins
 where user_id = (select id from auth.users where email = 'demo@globalex.uz');
delete from auth.users where email = 'demo@globalex.uz';
```
