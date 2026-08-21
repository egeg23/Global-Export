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

## 2. Код на сервер

Репозиторий публичный, рабочая ветка стоит основной — токен и `git checkout`
не нужны.

```bash
sudo mkdir -p /srv/globalex
sudo chown -R "$USER":"$USER" /srv/globalex
git clone https://github.com/egeg23/Global-Export.git /srv/globalex
cd /srv/globalex
```

Нужен Node 20 или новее — Next.js 16 на более старом не соберётся:

```bash
node -v || (curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs)
```

## 3. Переменные окружения

```bash
cp .env.example .env.local
```

Заполнить в `/srv/globalex/.env.local`:

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

Файл читает systemd, поэтому доступ к нему стоит закрыть:

```bash
sudo chown root:www-data .env.local && sudo chmod 640 .env.local
```

## 4. Служба

Сначала собрать — служба стартует уже готовое приложение:

```bash
npm ci && npm run build
```

Пользователя в юните подставляем на лету: приложение должно работать от
владельца каталога, иначе сборка и служба будут драться за права на `.next`.

```bash
sudo sed "s|^User=.*|User=$USER|" deploy/globalex-demo.service \
  | sudo tee /etc/systemd/system/globalex-demo.service >/dev/null
sudo systemctl daemon-reload
sudo systemctl enable --now globalex-demo
systemctl status globalex-demo
```

Приложение слушает `127.0.0.1:3100` — наружу оно не смотрит, только через nginx.
Если порт занят, поменять его в двух местах: `PORT` в юните и `proxy_pass` в
конфиге nginx.

## 5. nginx

```bash
sudo cp deploy/globalex.nginx.conf /etc/nginx/sites-available/globalex-demo
sudo ln -s /etc/nginx/sites-available/globalex-demo /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 6. Сертификат

Только после того, как DNS разошёлся — certbot проверяет домен через него:

```bash
sudo certbot --nginx -d globalex.maximov-tech.ru
```

certbot сам допишет ssl-блок и редирект с 80 порта в тот же файл.

## 7. Наполнение базы

Один раз, чтобы в админке было что редактировать:

```bash
cd /srv/globalex
SUPABASE_URL=https://<проект>.supabase.co \
SUPABASE_KEY=<публичный ключ> \
SEED_EMAIL=<почта админа> \
SEED_PASSWORD=<пароль> \
  node scripts/seed.mjs
```

---

## Обновление

```bash
cd /srv/globalex && bash deploy/deploy.sh
```

Скрипт забирает ветку, ставит зависимости, собирает, перезапускает службу и
проверяет, что площадка отвечает. Если нет — печатает, куда смотреть.

## Если что-то не работает

| Симптом | Куда смотреть |
|---|---|
| 502 от nginx | `systemctl status globalex-demo`, `journalctl -u globalex-demo -n 60` |
| Сборка падает | Node ниже 20; либо `npm ci` был запущен с `--omit=dev` — tailwind и typescript нужны на сборке |
| Пустой сайт, но страницы открываются | Не заполнена база: `node scripts/seed.mjs` |
| Админка не пускает | Проверить, что пользователь есть в таблице `admins` |
| Фотографии из админки не грузятся | `NEXT_PUBLIC_SUPABASE_URL` должен совпадать с тем, что в `next.config.ts` попадает в `remotePatterns` — он читается из этой же переменной на сборке |

## Что показать заказчику

Одна ссылка: **https://globalex.maximov-tech.ru** — она открывает витрину со
всеми разделами. Доступ в админку передавать отдельно, не на самой странице.
