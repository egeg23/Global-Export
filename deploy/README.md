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

Если занят, выберите свободный и подставьте его в двух местах: `Environment=PORT`
в `deploy/globalex-demo.service` и `proxy_pass` в `deploy/globalex.nginx.conf`
(там два вхождения).

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

## Если что-то не работает

| Симптом | Куда смотреть |
|---|---|
| 502 от nginx | `systemctl status globalex-demo`, `journalctl -u globalex-demo -n 60` |
| `EADDRINUSE` в логе, служба в цикле перезапусков | Порт занят другим приложением. Сменить его в юните и в конфиге nginx, затем `systemctl reset-failed globalex-demo` |
| Страницы отдают 404, хотя маршруты есть | Скорее всего отвечает чужое приложение на том же порту — проверьте `ss -ltnp \| grep <порт>` |
| Сборка падает | Node ниже 20; либо `npm ci` был запущен с `--omit=dev` — tailwind и typescript нужны на сборке |
| `EACCES` при сборке или пустые картинки | Каталог или `.next` принадлежат root: `chown -R globalex:globalex /srv/globalex` |
| Пустой сайт, но страницы открываются | Не заполнена база: `node scripts/seed.mjs` |
| Админка не пускает | Проверить, что пользователь есть в таблице `admins` |
| Фотографии из админки не грузятся | `NEXT_PUBLIC_SUPABASE_URL` должен совпадать с тем, что в `next.config.ts` попадает в `remotePatterns` — он читается из этой же переменной на сборке |

## Что показать заказчику

Одна ссылка: **https://globalex.maximov-tech.ru** — она открывает витрину со
всеми разделами. Доступ в админку передавать отдельно, не на самой странице.
