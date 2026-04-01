export type Language = "ky" | "tr" | "ru" | "en";

export const languageNames: Record<Language, string> = {
  ky: "Кыргызча",
  tr: "Türkçe",
  ru: "Русский",
  en: "English",
};

export const languageFlags: Record<Language, string> = {
  ky: "🇰🇬",
  tr: "🇹🇷",
  ru: "🇷🇺",
  en: "🇬🇧",
};

type Branch = {
  name: string;
  address: string;
  hours: string;
  phone: string;
  mapLink: string;
};

type TranslationKeys = {
  nav: {
    home: string;
    upload: string;
    login: string;
    register: string;
    logout: string;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
  };
  steps: {
    title: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  features: {
    title: string;
    ai: string;
    aiDesc: string;
    fast: string;
    fastDesc: string;
    secure: string;
    secureDesc: string;
    formats: string;
    formatsDesc: string;
  };
  faq: {
    title: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
    q4: string;
    a4: string;
  };
  upload: {
    title: string;
    dragDrop: string;
    or: string;
    browse: string;
    formats: string;
    maxSize: string;
    uploading: string;
    analyzing: string;
    stage1: string;
    stage2: string;
    stage3: string;
    reportTitle: string;
    reportTables: string;
    reportSpacing: string;
    reportReady: string;
    fileRetention: string;
  };
  analysis: {
    title: string;
    errors: string;
    warnings: string;
    fixed: string;
    preview: string;
    watermark: string;
    payToContinue: string;
  };
  payment: {
    title: string;
    amount: string;
    payWithMbank: string;
    scanQr: string;
    processing: string;
    success: string;
    iPaid: string;
  };
  download: {
    title: string;
    selectFormat: string;
    word: string;
    pdf: string;
    downloadBtn: string;
    thankYou: string;
  };
  auth: {
    loginTitle: string;
    registerTitle: string;
    email: string;
    password: string;
    confirmPassword: string;
    loginBtn: string;
    registerBtn: string;
    noAccount: string;
    hasAccount: string;
    fullName: string;
  };
  footer: {
    rights: string;
    branches: string;
    openMap: string;
    branchList: Branch[];
  };
};

export const translations: Record<Language, TranslationKeys> = {
  ky: {
    nav: {
      home: "Башкы бет",
      upload: "Жүктөө",
      login: "Кирүү",
      register: "Катталуу",
      logout: "Чыгуу",
    },
    hero: {
      badge: "КТУ «Манас» студенттери үчүн",
      title: "Дипломдук ишиңизди ",
      titleHighlight: "AI менен оңдоңуз",
      subtitle: "Дипломдук ишиңизди жүктөңүз — жасалма интеллект методикалык колдонмого ылайык структурасын текшерип, оңдоп берет.",
      cta: "Ишимди жүктөө",
      ctaSecondary: "Кантип иштейт?",
    },
    steps: {
      title: "Кантип иштейт?",
      step1Title: "Файлды жүктөө",
      step1Desc: "DOCX форматындагы дипломдук ишиңизди жүктөңүз",
      step2Title: "AI анализ",
      step2Desc: "Жасалма интеллект методичкага ылайык структураны текшерет",
      step3Title: "Төлөм",
      step3Desc: "MBank аркылуу онлайн төлөм жасаңыз",
      step4Title: "Жүктөп алуу",
      step4Desc: "Оңдолгон ишти Word же PDF форматында жүктөп алыңыз",
    },
    features: {
      title: "Артыкчылыктар",
      ai: "AI технологиясы",
      aiDesc: "Gemini AI модели аркылуу так жана тез анализ",
      fast: "Тез иштетүү",
      fastDesc: "Бир нече мүнөттө натыйжа алыңыз",
      secure: "Коопсуздук",
      secureDesc: "Файлдарыңыз шифрленген серверде сакталат",
      formats: "Ар кандай формат",
      formatsDesc: "Word (DOCX) же PDF форматында жүктөп алыңыз",
    },
    faq: {
      title: "Көп берилүүчү суроолор",
      q1: "Кайсы форматтагы файлдарды жүктөсө болот?",
      a1: "Учурда DOCX (Microsoft Word) форматындагы файлдар гана кабыл алынат.",
      q2: "Төлөм кантип жүргүзүлөт?",
      a2: "Төлөм MBank мобилдик тиркемеси аркылуу QR код же которуу менен жүргүзүлөт.",
      q3: "Канча убакыт талап кылынат?",
      a3: "AI анализ 2-5 мүнөт ичинде аяктайт. Төлөмдөн кийин файлды дароо жүктөп алсаңыз болот.",
      q4: "Файлдарым коопсузбу?",
      a4: "Бардык файлдар шифрленген серверлерде сакталат жана 30 күндөн кийин автоматтык түрдө жок кылынат.",
    },
    upload: {
      title: "Дипломдук ишти жүктөө",
      dragDrop: "Файлды бул жерге сүйрөп таштаңыз",
      or: "же",
      browse: "Файлды тандаңыз",
      formats: "DOCX форматы гана",
      maxSize: "Максималдуу өлчөмү: 20MB",
      uploading: "Жүктөлүүдө...",
      analyzing: "AI анализдөөдө...",
      stage1: "Талааларды текшерүү (3см сол, 1.5см оң)...",
      stage2: "Структураны анализдөө (Титулдук бет, Мазмуну)...",
      stage3: "Нумерацияны жөндөө (Рим цифралары → Киришүү, Араб цифралары → негизги бөлүм)...",
      reportTitle: "Анализ аяктады",
      reportTables: "12 таблица табылды, форматтоо оңдолду",
      reportSpacing: "1.5 интервалга ылайык чегинүүлөр оңдолду",
      reportReady: "Документ төлөмдөн кийин жүктөп алууга даяр",
      fileRetention: "Файлдар 14 күн сакталып, андан кийин жок кылынат",
    },
    analysis: {
      title: "Анализдин натыйжасы",
      errors: "Каталар",
      warnings: "Эскертүүлөр",
      fixed: "Оңдолду",
      preview: "Алдын ала көрүү",
      watermark: "МANASDOC — ТӨЛӨМДӨН КИЙИН ЖЕТКИЛИКТҮҮ",
      payToContinue: "Оңдолгон файлды жүктөп алуу үчүн төлөм кылыңыз",
    },
    payment: {
      title: "Төлөм",
      amount: "Сумма",
      payWithMbank: "MBank менен төлөө",
      scanQr: "QR кодду MBank тиркемесинен сканерлеңиз",
      processing: "Төлөм текшерилүүдө...",
      success: "Төлөм ийгиликтүү!",
      iPaid: "Мен төлөдүм ✓",
    },
    download: {
      title: "Жүктөп алуу",
      selectFormat: "Форматты тандаңыз",
      word: "Word (DOCX)",
      pdf: "PDF",
      downloadBtn: "Жүктөп алуу",
      thankYou: "ManasDoc тандаганыңыз үчүн рахмат!",
    },
    auth: {
      loginTitle: "Аккаунтка кирүү",
      registerTitle: "Жаңы аккаунт түзүү",
      email: "Электрондук почта",
      password: "Сыр сөз",
      confirmPassword: "Сыр сөздү ырастаңыз",
      loginBtn: "Кирүү",
      registerBtn: "Катталуу",
      noAccount: "Аккаунтуңуз жокпу?",
      hasAccount: "Аккаунтуңуз барбы?",
      fullName: "Толук аты-жөнү",
    },
    footer: {
      rights: "Бардык укуктар корголгон",
      branches: "Биздин филиалдар",
      openMap: "Картадан көрүү",
      branchList: [
        { name: "Джал", address: "Джал 30-43а, Бишкек", hours: "7:00 — 20:00", phone: "+996 555 566 667", mapLink: "https://go.2gis.com/6TVm2" },
        { name: "Филармония", address: "Чүй проспектиси, 251, Бишкек", hours: "9:30 — 18:00", phone: "+996 706 614 013", mapLink: "https://go.2gis.com/vYXqB" },
        
      ],
    },
  },
  tr: {
    nav: {
      home: "Ana Sayfa",
      upload: "Yükle",
      login: "Giriş",
      register: "Kayıt Ol",
      logout: "Çıkış",
    },
    hero: {
      badge: "KTMÜ «Manas» öğrencileri için",
      title: "Tezinizi ",
      titleHighlight: "AI ile düzeltin",
      subtitle: "Tezinizi yükleyin — yapay zeka metodoloji kılavuzuna göre yapısını kontrol edip düzeltir.",
      cta: "Tezimi Yükle",
      ctaSecondary: "Nasıl çalışır?",
    },
    steps: {
      title: "Nasıl Çalışır?",
      step1Title: "Dosya Yükleme",
      step1Desc: "DOCX formatındaki tezinizi yükleyin",
      step2Title: "AI Analizi",
      step2Desc: "Yapay zeka metodoloji kılavuzuna göre yapıyı kontrol eder",
      step3Title: "Ödeme",
      step3Desc: "MBank ile online ödeme yapın",
      step4Title: "İndirme",
      step4Desc: "Düzeltilmiş tezi Word veya PDF formatında indirin",
    },
    features: {
      title: "Avantajlar",
      ai: "AI Teknolojisi",
      aiDesc: "Gemini AI modeli ile doğru ve hızlı analiz",
      fast: "Hızlı İşleme",
      fastDesc: "Birkaç dakika içinde sonuç alın",
      secure: "Güvenlik",
      secureDesc: "Dosyalarınız şifreli sunucularda saklanır",
      formats: "Çoklu Format",
      formatsDesc: "Word (DOCX) veya PDF formatında indirin",
    },
    faq: {
      title: "Sıkça Sorulan Sorular",
      q1: "Hangi formattaki dosyalar yüklenebilir?",
      a1: "Şu anda yalnızca DOCX (Microsoft Word) formatındaki dosyalar kabul edilmektedir.",
      q2: "Ödeme nasıl yapılır?",
      a2: "Ödeme MBank mobil uygulaması üzerinden QR kod veya transfer ile yapılır.",
      q3: "Ne kadar sürer?",
      a3: "AI analizi 2-5 dakika içinde tamamlanır. Ödeme sonrasında dosyayı hemen indirebilirsiniz.",
      q4: "Dosyalarım güvende mi?",
      a4: "Tüm dosyalar şifreli sunucularda saklanır ve 30 gün sonra otomatik olarak silinir.",
    },
    upload: {
      title: "Tez Yükleme",
      dragDrop: "Dosyayı buraya sürükleyin",
      or: "veya",
      browse: "Dosya seçin",
      formats: "Yalnızca DOCX formatı",
      maxSize: "Maksimum boyut: 20MB",
      uploading: "Yükleniyor...",
      analyzing: "AI analiz ediyor...",
      stage1: "Kenar boşlukları kontrol ediliyor (3cm sol, 1.5cm sağ)...",
      stage2: "Yapı analiz ediliyor (Kapak sayfası, İçindekiler)...",
      stage3: "Numaralandırma ayarlanıyor (Romen rakamları → Giriş, Arap rakamları → ana bölüm)...",
      reportTitle: "Analiz tamamlandı",
      reportTables: "12 tablo bulundu, biçimlendirme düzeltildi",
      reportSpacing: "1.5 satır aralığına göre girintiler düzeltildi",
      reportReady: "Belge ödeme sonrası indirmeye hazır",
      fileRetention: "Dosyalar 14 gün saklanır, ardından silinir",
    },
    analysis: {
      title: "Analiz Sonucu",
      errors: "Hatalar",
      warnings: "Uyarılar",
      fixed: "Düzeltildi",
      preview: "Önizleme",
      watermark: "MANASDOC — ÖDEME SONRASI ERİŞİLEBİLİR",
      payToContinue: "Düzeltilmiş dosyayı indirmek için ödeme yapın",
    },
    payment: {
      title: "Ödeme",
      amount: "Tutar",
      payWithMbank: "MBank ile Öde",
      scanQr: "QR kodu MBank uygulamasından tarayın",
      processing: "Ödeme kontrol ediliyor...",
      success: "Ödeme başarılı!",
      iPaid: "Ödedim ✓",
    },
    download: {
      title: "İndirme",
      selectFormat: "Format seçin",
      word: "Word (DOCX)",
      pdf: "PDF",
      downloadBtn: "İndir",
      thankYou: "ManasDoc'u tercih ettiğiniz için teşekkürler!",
    },
    auth: {
      loginTitle: "Hesaba Giriş",
      registerTitle: "Yeni Hesap Oluştur",
      email: "E-posta",
      password: "Şifre",
      confirmPassword: "Şifreyi onaylayın",
      loginBtn: "Giriş Yap",
      registerBtn: "Kayıt Ol",
      noAccount: "Hesabınız yok mu?",
      hasAccount: "Hesabınız var mı?",
      fullName: "Ad Soyad",
    },
    footer: {
      rights: "Tüm hakları saklıdır",
      branches: "Şubelerimiz",
      openMap: "Haritada gör",
      branchList: [
        { name: "Jal", address: "Jal 30-43a, Bişkek", hours: "7:00 — 20:00", phone: "+996 555 566 667", mapLink: "https://go.2gis.com/6TVm2" },
        { name: "Filarmoni", address: "Çüy Cad., 251, Bişkek", hours: "9:30 — 18:00", phone: "+996 706 614 013", mapLink: "https://go.2gis.com/vYXqB" },
        
      ],
    },
  },
  ru: {
    nav: {
      home: "Главная",
      upload: "Загрузить",
      login: "Войти",
      register: "Регистрация",
      logout: "Выйти",
    },
    hero: {
      badge: "Для студентов КТУ «Манас»",
      title: "Исправьте дипломную работу ",
      titleHighlight: "с помощью AI",
      subtitle: "Загрузите дипломную работу — искусственный интеллект проверит и исправит структуру по методическому пособию.",
      cta: "Загрузить работу",
      ctaSecondary: "Как это работает?",
    },
    steps: {
      title: "Как это работает?",
      step1Title: "Загрузка файла",
      step1Desc: "Загрузите дипломную работу в формате DOCX",
      step2Title: "AI анализ",
      step2Desc: "Искусственный интеллект проверяет структуру по методичке",
      step3Title: "Оплата",
      step3Desc: "Онлайн-оплата через MBank",
      step4Title: "Скачивание",
      step4Desc: "Скачайте исправленную работу в формате Word или PDF",
    },
    features: {
      title: "Преимущества",
      ai: "Технология AI",
      aiDesc: "Точный и быстрый анализ с помощью модели Gemini AI",
      fast: "Быстрая обработка",
      fastDesc: "Получите результат за несколько минут",
      secure: "Безопасность",
      secureDesc: "Ваши файлы хранятся на зашифрованных серверах",
      formats: "Разные форматы",
      formatsDesc: "Скачивайте в формате Word (DOCX) или PDF",
    },
    faq: {
      title: "Часто задаваемые вопросы",
      q1: "Какие форматы файлов поддерживаются?",
      a1: "В настоящее время принимаются только файлы в формате DOCX (Microsoft Word).",
      q2: "Как производится оплата?",
      a2: "Оплата производится через мобильное приложение MBank с помощью QR-кода или перевода.",
      q3: "Сколько времени это занимает?",
      a3: "AI-анализ занимает 2-5 минут. После оплаты файл можно скачать сразу.",
      q4: "Мои файлы в безопасности?",
      a4: "Все файлы хранятся на зашифрованных серверах и автоматически удаляются через 30 дней.",
    },
    upload: {
      title: "Загрузка дипломной работы",
      dragDrop: "Перетащите файл сюда",
      or: "или",
      browse: "Выберите файл",
      formats: "Только формат DOCX",
      maxSize: "Максимальный размер: 20МБ",
      uploading: "Загрузка...",
      analyzing: "AI анализирует...",
      stage1: "Проверка полей (3см слева, 1.5см справа)...",
      stage2: "Анализ структуры (Титульный лист, Содержание)...",
      stage3: "Настройка нумерации (Римские цифры → Введение, Арабские → основная часть)...",
      reportTitle: "Анализ завершён",
      reportTables: "Найдено 12 таблиц, форматирование исправлено",
      reportSpacing: "Отступы исправлены под 1.5 интервала",
      reportReady: "Документ готов к скачиванию после оплаты",
      fileRetention: "Файлы хранятся 14 дней, затем удаляются",
    },
    analysis: {
      title: "Результат анализа",
      errors: "Ошибки",
      warnings: "Предупреждения",
      fixed: "Исправлено",
      preview: "Предпросмотр",
      watermark: "MANASDOC — ДОСТУПНО ПОСЛЕ ОПЛАТЫ",
      payToContinue: "Оплатите для скачивания исправленного файла",
    },
    payment: {
      title: "Оплата",
      amount: "Сумма",
      payWithMbank: "Оплатить через MBank",
      scanQr: "Отсканируйте QR-код в приложении MBank",
      processing: "Проверка оплаты...",
      success: "Оплата успешна!",
      iPaid: "Я оплатил ✓",
    },
    download: {
      title: "Скачивание",
      selectFormat: "Выберите формат",
      word: "Word (DOCX)",
      pdf: "PDF",
      downloadBtn: "Скачать",
      thankYou: "Спасибо, что выбрали ManasDoc!",
    },
    auth: {
      loginTitle: "Вход в аккаунт",
      registerTitle: "Создание аккаунта",
      email: "Электронная почта",
      password: "Пароль",
      confirmPassword: "Подтвердите пароль",
      loginBtn: "Войти",
      registerBtn: "Зарегистрироваться",
      noAccount: "Нет аккаунта?",
      hasAccount: "Уже есть аккаунт?",
      fullName: "Полное имя",
    },
    footer: {
      rights: "Все права защищены",
      branches: "Наши филиалы",
      openMap: "Открыть карту",
      branchList: [
        { name: "Джал", address: "Джал 30-43а, Бишкек", hours: "7:00 — 20:00", phone: "+996 555 566 667", mapLink: "https://go.2gis.com/6TVm2" },
        { name: "Филармония", address: "пр. Чуй, 251, Бишкек", hours: "9:30 — 18:00", phone: "+996 706 614 013", mapLink: "https://go.2gis.com/vYXqB" },
        
      ],
    },
  },
  en: {
    nav: {
      home: "Home",
      upload: "Upload",
      login: "Login",
      register: "Register",
      logout: "Logout",
    },
    hero: {
      badge: "For KTMU «Manas» students",
      title: "Fix your thesis ",
      titleHighlight: "with AI",
      subtitle: "Upload your thesis — artificial intelligence will check and fix the structure according to the university methodology guide.",
      cta: "Upload My Thesis",
      ctaSecondary: "How does it work?",
    },
    steps: {
      title: "How Does It Work?",
      step1Title: "Upload File",
      step1Desc: "Upload your thesis in DOCX format",
      step2Title: "AI Analysis",
      step2Desc: "AI checks the structure against the methodology guide",
      step3Title: "Payment",
      step3Desc: "Pay online via MBank",
      step4Title: "Download",
      step4Desc: "Download the corrected thesis in Word or PDF format",
    },
    features: {
      title: "Advantages",
      ai: "AI Technology",
      aiDesc: "Accurate and fast analysis using Gemini AI model",
      fast: "Fast Processing",
      fastDesc: "Get results in just a few minutes",
      secure: "Security",
      secureDesc: "Your files are stored on encrypted servers",
      formats: "Multiple Formats",
      formatsDesc: "Download in Word (DOCX) or PDF format",
    },
    faq: {
      title: "Frequently Asked Questions",
      q1: "What file formats are supported?",
      a1: "Currently only DOCX (Microsoft Word) format files are accepted.",
      q2: "How is payment made?",
      a2: "Payment is made through the MBank mobile app using QR code or transfer.",
      q3: "How long does it take?",
      a3: "AI analysis takes 2-5 minutes. After payment, you can download the file immediately.",
      q4: "Are my files safe?",
      a4: "All files are stored on encrypted servers and automatically deleted after 30 days.",
    },
    upload: {
      title: "Upload Thesis",
      dragDrop: "Drag and drop your file here",
      or: "or",
      browse: "Browse files",
      formats: "DOCX format only",
      maxSize: "Maximum size: 20MB",
      uploading: "Uploading...",
      analyzing: "AI analyzing...",
      stage1: "Checking margins (3cm left, 1.5cm right)...",
      stage2: "Analyzing structure (Title page, Table of contents)...",
      stage3: "Setting up numbering (Roman numerals → Introduction, Arabic → main sections)...",
      reportTitle: "Analysis complete",
      reportTables: "Found 12 tables, formatting corrected",
      reportSpacing: "Indents corrected for 1.5 line spacing",
      reportReady: "Document ready for download after payment",
      fileRetention: "Files are stored for 14 days, then deleted",
    },
    analysis: {
      title: "Analysis Result",
      errors: "Errors",
      warnings: "Warnings",
      fixed: "Fixed",
      preview: "Preview",
      watermark: "MANASDOC — AVAILABLE AFTER PAYMENT",
      payToContinue: "Pay to download the corrected file",
    },
    payment: {
      title: "Payment",
      amount: "Amount",
      payWithMbank: "Pay with MBank",
      scanQr: "Scan the QR code in MBank app",
      processing: "Verifying payment...",
      success: "Payment successful!",
      iPaid: "I have paid ✓",
    },
    download: {
      title: "Download",
      selectFormat: "Select format",
      word: "Word (DOCX)",
      pdf: "PDF",
      downloadBtn: "Download",
      thankYou: "Thank you for choosing ManasDoc!",
    },
    auth: {
      loginTitle: "Login to Account",
      registerTitle: "Create Account",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm password",
      loginBtn: "Login",
      registerBtn: "Register",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      fullName: "Full Name",
    },
    footer: {
      rights: "All rights reserved",
      branches: "Our Branches",
      openMap: "View on map",
      branchList: [
        { name: "Jal", address: "Jal 30-43a, Bishkek", hours: "7:00 — 20:00", phone: "+996 555 566 667", mapLink: "https://go.2gis.com/6TVm2" },
        { name: "Philharmonic", address: "Chuy Ave, 251, Bishkek", hours: "9:30 — 18:00", phone: "+996 706 614 013", mapLink: "https://go.2gis.com/vYXqB" },
        { name: "Komok", address: "Jamanbaev St, 35a/1, Bishkek", hours: "8:00 — 21:00", phone: "+996 706 229 979", mapLink: "https://go.2gis.com/VVzIv" },
      ],
    },
  },
};
