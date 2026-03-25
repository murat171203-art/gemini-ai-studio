

# ManasDoc — Обновленный план реализации

## Изменения от предыдущего плана
- **Формат скачивания**: Word (DOCX) или PDF — на выбор студента
- **Оплата**: MBank (вместо Stripe, т.к. Stripe недоступен в КР)

## Этапы реализации

### Этап 1: Фундамент — i18n + Landing + Навигация
- Система мультиязычности (React Context + JSON словари): кыргызский (default), турецкий, русский, английский
- Технологичный Landing page: hero с glassmorphism, анимированные частицы, шаги работы, FAQ
- Хедер с переключателем языков (🇰🇬/🇹🇷/🇷🇺/🇬🇧) и навигацией
- Страницы: главная, загрузка, результат, оплата, скачивание
- Framer Motion для анимаций
- Темная тема с неоновыми cyan/blue акцентами

### Этап 2: Supabase Backend
- Включить Supabase Cloud
- Таблицы: `orders` (user_id, file_path, status, payment_status, download_format, analysis_result), `methodology_templates`
- Storage buckets: `uploads`, `processed`, `templates`
- Auth (email + password)
- RLS политики

### Этап 3: Загрузка и AI-анализ
- Drag-and-drop загрузка DOCX
- Edge function `analyze-document` — отправка в Gemini для анализа структуры по методичке
- Отображение ошибок и рекомендаций
- Превью с водяными знаками (PDF preview в браузере)

### Этап 4: Оплата через MBank + Скачивание
- Интеграция с MBank API (QR-код или redirect на оплату)
- Edge function для проверки статуса оплаты
- Выбор формата: DOCX или PDF
- Скачивание исправленного файла после подтверждения оплаты

## Технические детали

### MBank интеграция
MBank API потребует API-ключ от мерчант-аккаунта. Реализуем через Edge Function, которая создает платежную сессию и проверяет callback. Пользователю нужно будет предоставить MBank merchant credentials.

### Формат скачивания
- DOCX: исправленный файл напрямую из storage
- PDF: конвертация DOCX → PDF через Edge Function (LibreOffice headless или аналог)

### Структура файлов
```text
src/
├── contexts/
│   └── LanguageContext.tsx        # i18n
├── i18n/
│   ├── ky.json                   # кыргызский
│   ├── tr.json                   # турецкий
│   ├── ru.json                   # русский
│   └── en.json                   # английский
├── pages/
│   ├── Index.tsx                 # Landing
│   ├── Upload.tsx                # Загрузка файла
│   ├── Analysis.tsx              # Результат анализа + превью
│   ├── Payment.tsx               # Оплата (MBank)
│   ├── Download.tsx              # Скачивание
│   ├── Auth.tsx                  # Вход/Регистрация
│   └── NotFound.tsx
├── components/
│   ├── Header.tsx
│   ├── LanguageSwitcher.tsx
│   ├── FileUploader.tsx
│   ├── AnalysisResult.tsx
│   ├── WatermarkPreview.tsx
│   ├── PaymentForm.tsx
│   ├── FormatSelector.tsx        # Выбор DOCX/PDF
│   └── ParticleBackground.tsx
supabase/
├── functions/
│   ├── analyze-document/
│   ├── process-payment/
│   └── generate-download/
└── migrations/
    └── 001_initial.sql
```

Начну с Этапа 1: полный UI с мультиязычностью и технологичным дизайном.

