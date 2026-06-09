# FEEL Create&Dev

Портфолио на `React` + `Vite` с акцентом на motion, fullscreen-секции и проектные модалки.

## Запуск

1. Установить зависимости:
   `npm install`
2. Создать `.env.local` на основе `.env.example`
3. Запустить dev-сервер:
   `npm run dev`
4. Собрать production-версию:
   `npm run build`

## Структура

- `src/main.tsx` — entry point Vite/React.
- `src/App.tsx` — загрузчик, intro-переход и корневые состояния.
- `src/components/` — визуальные компоненты и анимационные секции.
- `src/admin/` — CMS-админка проектов.
- `src/components/shared/` — переиспользуемые анимированные примитивы.
- `src/content/portfolio.ts` — централизованные данные проектов и услуг.
- `src/content/use-portfolio-content-store.ts` — загрузка и сохранение проектов через Supabase.
- `src/lib/` — UI-хелперы и подключение к Supabase.
- `src/types/portfolio.ts` — типы домена портфолио.
- `src/styles/global.css` — глобальные стили.

## Важно

Глобальные стили, шрифты и Tailwind CDN сейчас намеренно остаются в `index.html`, чтобы сохранить текущее визуальное поведение без дополнительной миграции.

## Supabase CMS

Админка доступна по пути `/admin`.

Что хранится в Supabase:
- заголовок проекта
- описание
- порядок проектов
- `cover image`
- `href`
- `stack`
- массив `galleryImages`

Что по-прежнему хранится вне проекта:
- сами изображения и видео, если они лежат на внешних CDN/сервисах

Как настроить:
1. В панели Supabase открыть SQL Editor.
2. Выполнить [supabase/projects-schema.sql](/Users/feel/Documents/3%20Code/Portfolio/supabase/projects-schema.sql:1).
3. В `Authentication -> Users` создать своего пользователя.
4. В `.env.local` прописать `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`.
5. Зайти в `/admin` и авторизоваться через email/password этого пользователя.

Поведение:
- публичный сайт читает проекты из Supabase
- если таблица пуста или Supabase не настроен, сайт показывает локальный fallback-контент
- админка редактирует draft локально в форме и сохраняет в Supabase только по кнопке `Сохранить`
