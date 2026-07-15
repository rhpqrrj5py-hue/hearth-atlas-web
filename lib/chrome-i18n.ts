// Chrome strings for the public share page — this site's OWN interface text
// (section headings, meta pills, the download CTA, the not-found page), keyed by
// the recipe's content language (`payload.lang`).
//
// Recipe CONTENT — title, steps, ingredient/equipment names, cuisine, course —
// arrives already localized in the payload and is never translated here. Only the
// chrome around it lives in this table.
//
// The language set mirrors the app's content locales (ContentLang): 'en' plus the
// 15 languages a share can be frozen in. A language absent from TABLE falls back
// to English, so a share in a not-yet-translated language still renders correctly
// — its content in its own language, the chrome in English.
//
// Brand names are deliberately NOT in this table: "Hearth Atlas", "App Store",
// "Google Play" and the English tagline stay hardcoded at their use sites, and
// brand suffixes (e.g. "… · Hearth Atlas") are composed in code.

/** The content languages a share payload can carry (mirrors the app's ContentLang). */
export const CONTENT_LANGS = [
  "en",
  "fr",
  "de",
  "es",
  "it",
  "pt",
  "zh",
  "ar",
  "hi",
  "ja",
  "ru",
  "ko",
  "nl",
  "tr",
  "id",
  "pl",
] as const;

export type ContentLang = (typeof CONTENT_LANGS)[number];

export interface Chrome {
  ingredients: string;
  equipment: string;
  preparation: string;
  pairings: string;
  menu: string;
  alcoholic: string;
  nonAlcoholic: string;
  minutesSuffix: string;
  servesShort: string;
  /** Interpolates {n}. Reworded per language to avoid plural inflection. */
  servesLine: string;
  ctaHeading: string;
  ctaBody: string;
  badgeAppStoreTop: string;
  badgePlayTop: string;
  qrCaption: string;
  sharedVia: string;
  notFoundTitle: string;
  notFoundBody: string;
  discoverCta: string;
  recipeFallback: string;
  /** Interpolates {context} (e.g. "Germany · Main course"). */
  ogDescription: string;
  ogDescriptionNoContext: string;
}

const en: Chrome = {
  ingredients: "Ingredients",
  equipment: "Equipment",
  preparation: "Preparation",
  pairings: "Pairings",
  menu: "Menu",
  alcoholic: "Alcoholic",
  nonAlcoholic: "Non-alcoholic",
  minutesSuffix: "min",
  servesShort: "servings",
  servesLine: "Serves {n}",
  ctaHeading: "Cook the world with Hearth Atlas",
  ctaBody: "Recipes from around the world, a cooking guide in your pocket.",
  badgeAppStoreTop: "Download on the",
  badgePlayTop: "Get it on",
  qrCaption: "Scan to install Hearth Atlas",
  sharedVia: "Shared via Hearth Atlas",
  notFoundTitle: "Recipe not found",
  notFoundBody: "This share link doesn’t exist or has expired.",
  discoverCta: "Discover Hearth Atlas",
  recipeFallback: "Recipe",
  ogDescription: "{context} — a recipe to cook on Hearth Atlas",
  ogDescriptionNoContext: "A recipe to cook on Hearth Atlas",
};

const fr: Chrome = {
  ingredients: "Ingrédients",
  equipment: "Matériel",
  preparation: "Préparation",
  pairings: "Accords",
  menu: "Menu",
  alcoholic: "Alcoolisé",
  nonAlcoholic: "Sans alcool",
  minutesSuffix: "min",
  servesShort: "pers.",
  servesLine: "Pour {n} pers.",
  ctaHeading: "Cuisinez le monde avec Hearth Atlas",
  ctaBody: "Des recettes du monde entier, un guide de cuisine dans votre poche.",
  badgeAppStoreTop: "Télécharger sur l’",
  badgePlayTop: "Disponible sur",
  qrCaption: "Scannez pour installer Hearth Atlas",
  sharedVia: "Partagé via Hearth Atlas",
  notFoundTitle: "Recette introuvable",
  notFoundBody: "Ce lien de partage n’existe pas ou a expiré.",
  discoverCta: "Découvrir Hearth Atlas",
  recipeFallback: "Recette",
  ogDescription: "{context} — une recette à cuisiner sur Hearth Atlas",
  ogDescriptionNoContext: "Une recette à cuisiner sur Hearth Atlas",
};

const de: Chrome = {
  ingredients: "Zutaten",
  equipment: "Ausstattung",
  preparation: "Zubereitung",
  pairings: "Begleitung",
  menu: "Menü",
  alcoholic: "Alkoholisch",
  nonAlcoholic: "Alkoholfrei",
  minutesSuffix: "Min.",
  servesShort: "Pers.",
  servesLine: "Für {n} Pers.",
  ctaHeading: "Koche die Welt mit Hearth Atlas",
  ctaBody: "Rezepte aus aller Welt, ein Kochbuch für die Hosentasche.",
  badgeAppStoreTop: "Laden im",
  badgePlayTop: "Jetzt bei",
  qrCaption: "Zum Installieren von Hearth Atlas scannen",
  sharedVia: "Geteilt über Hearth Atlas",
  notFoundTitle: "Rezept nicht gefunden",
  notFoundBody: "Dieser Freigabelink existiert nicht oder ist abgelaufen.",
  discoverCta: "Hearth Atlas entdecken",
  recipeFallback: "Rezept",
  ogDescription: "{context} — ein Rezept zum Nachkochen auf Hearth Atlas",
  ogDescriptionNoContext: "Ein Rezept zum Nachkochen auf Hearth Atlas",
};

const es: Chrome = {
  ingredients: "Ingredientes",
  equipment: "Utensilios",
  preparation: "Preparación",
  pairings: "Maridajes",
  menu: "Menú",
  alcoholic: "Con alcohol",
  nonAlcoholic: "Sin alcohol",
  minutesSuffix: "min",
  servesShort: "pers.",
  servesLine: "Para {n} pers.",
  ctaHeading: "Cocina el mundo con Hearth Atlas",
  ctaBody: "Recetas de todo el mundo, una guía de cocina en tu bolsillo.",
  badgeAppStoreTop: "Descárgalo en el",
  badgePlayTop: "Disponible en",
  qrCaption: "Escanea para instalar Hearth Atlas",
  sharedVia: "Compartido con Hearth Atlas",
  notFoundTitle: "Receta no encontrada",
  notFoundBody: "Este enlace para compartir no existe o ha caducado.",
  discoverCta: "Descubre Hearth Atlas",
  recipeFallback: "Receta",
  ogDescription: "{context} — una receta para cocinar en Hearth Atlas",
  ogDescriptionNoContext: "Una receta para cocinar en Hearth Atlas",
};

const it: Chrome = {
  ingredients: "Ingredienti",
  equipment: "Attrezzatura",
  preparation: "Preparazione",
  pairings: "Abbinamenti",
  menu: "Menù",
  alcoholic: "Alcolico",
  nonAlcoholic: "Analcolico",
  minutesSuffix: "min",
  servesShort: "pers.",
  servesLine: "Per {n} pers.",
  ctaHeading: "Cucina il mondo con Hearth Atlas",
  ctaBody: "Ricette da tutto il mondo, una guida di cucina in tasca.",
  badgeAppStoreTop: "Scarica su",
  badgePlayTop: "Disponibile su",
  qrCaption: "Scansiona per installare Hearth Atlas",
  sharedVia: "Condiviso tramite Hearth Atlas",
  notFoundTitle: "Ricetta non trovata",
  notFoundBody: "Questo link di condivisione non esiste o è scaduto.",
  discoverCta: "Scopri Hearth Atlas",
  recipeFallback: "Ricetta",
  ogDescription: "{context} — una ricetta da cucinare su Hearth Atlas",
  ogDescriptionNoContext: "Una ricetta da cucinare su Hearth Atlas",
};

const pt: Chrome = {
  ingredients: "Ingredientes",
  equipment: "Equipamento",
  preparation: "Preparação",
  pairings: "Harmonizações",
  menu: "Menu",
  alcoholic: "Com álcool",
  nonAlcoholic: "Sem álcool",
  minutesSuffix: "min",
  servesShort: "pess.",
  servesLine: "Serve {n}",
  ctaHeading: "Cozinhe o mundo com Hearth Atlas",
  ctaBody: "Receitas de todo o mundo, um guia de cozinha no seu bolso.",
  badgeAppStoreTop: "Descarregar na",
  badgePlayTop: "Disponível no",
  qrCaption: "Digitalize para instalar o Hearth Atlas",
  sharedVia: "Partilhado através do Hearth Atlas",
  notFoundTitle: "Receita não encontrada",
  notFoundBody: "Esta ligação de partilha não existe ou expirou.",
  discoverCta: "Descobrir o Hearth Atlas",
  recipeFallback: "Receita",
  ogDescription: "{context} — uma receita para cozinhar no Hearth Atlas",
  ogDescriptionNoContext: "Uma receita para cozinhar no Hearth Atlas",
};

const zh: Chrome = {
  ingredients: "食材",
  equipment: "厨具",
  preparation: "做法",
  pairings: "搭配",
  menu: "菜单",
  alcoholic: "含酒精",
  nonAlcoholic: "无酒精",
  minutesSuffix: "分钟",
  servesShort: "人份",
  servesLine: "{n} 人份",
  ctaHeading: "用 Hearth Atlas 烹饪世界",
  ctaBody: "来自世界各地的食谱，口袋里的烹饪指南。",
  badgeAppStoreTop: "下载于",
  badgePlayTop: "获取于",
  qrCaption: "扫码安装 Hearth Atlas",
  sharedVia: "通过 Hearth Atlas 分享",
  notFoundTitle: "找不到食谱",
  notFoundBody: "此分享链接不存在或已过期。",
  discoverCta: "发现 Hearth Atlas",
  recipeFallback: "食谱",
  ogDescription: "{context} — 一道可在 Hearth Atlas 上烹饪的食谱",
  ogDescriptionNoContext: "一道可在 Hearth Atlas 上烹饪的食谱",
};

const ar: Chrome = {
  ingredients: "المكونات",
  equipment: "الأدوات",
  preparation: "طريقة التحضير",
  pairings: "التوافقات",
  menu: "القائمة",
  alcoholic: "كحولي",
  nonAlcoholic: "غير كحولي",
  minutesSuffix: "دقيقة",
  servesShort: "أشخاص",
  servesLine: "يكفي {n}",
  ctaHeading: "اطبخ العالم مع Hearth Atlas",
  ctaBody: "وصفات من جميع أنحاء العالم، دليل طهي في جيبك.",
  badgeAppStoreTop: "حمّله من",
  badgePlayTop: "احصل عليه من",
  qrCaption: "امسح الرمز لتثبيت Hearth Atlas",
  sharedVia: "تمّت المشاركة عبر Hearth Atlas",
  notFoundTitle: "لم يتم العثور على الوصفة",
  notFoundBody: "رابط المشاركة هذا غير موجود أو انتهت صلاحيته.",
  discoverCta: "اكتشف Hearth Atlas",
  recipeFallback: "وصفة",
  ogDescription: "{context} — وصفة لطهيها على Hearth Atlas",
  ogDescriptionNoContext: "وصفة لطهيها على Hearth Atlas",
};

const hi: Chrome = {
  ingredients: "सामग्री",
  equipment: "उपकरण",
  preparation: "बनाने की विधि",
  pairings: "संगत",
  menu: "मेन्यू",
  alcoholic: "अल्कोहलयुक्त",
  nonAlcoholic: "अल्कोहल रहित",
  minutesSuffix: "मिनट",
  servesShort: "लोग",
  servesLine: "{n} लोगों के लिए",
  ctaHeading: "Hearth Atlas के साथ दुनिया पकाएं",
  ctaBody: "दुनिया भर की रेसिपी, आपकी जेब में एक रसोई गाइड।",
  badgeAppStoreTop: "डाउनलोड करें",
  badgePlayTop: "पाएं",
  qrCaption: "Hearth Atlas इंस्टॉल करने के लिए स्कैन करें",
  sharedVia: "Hearth Atlas के माध्यम से साझा किया गया",
  notFoundTitle: "रेसिपी नहीं मिली",
  notFoundBody: "यह शेयर लिंक मौजूद नहीं है या समाप्त हो गया है।",
  discoverCta: "Hearth Atlas खोजें",
  recipeFallback: "रेसिपी",
  ogDescription: "{context} — Hearth Atlas पर पकाने के लिए एक रेसिपी",
  ogDescriptionNoContext: "Hearth Atlas पर पकाने के लिए एक रेसिपी",
};

const ja: Chrome = {
  ingredients: "材料",
  equipment: "調理器具",
  preparation: "作り方",
  pairings: "ペアリング",
  menu: "メニュー",
  alcoholic: "アルコールあり",
  nonAlcoholic: "ノンアルコール",
  minutesSuffix: "分",
  servesShort: "人分",
  servesLine: "{n} 人分",
  ctaHeading: "Hearth Atlas で世界を料理しよう",
  ctaBody: "世界中のレシピ、ポケットに料理ガイドを。",
  badgeAppStoreTop: "ダウンロード",
  badgePlayTop: "入手",
  qrCaption: "スキャンして Hearth Atlas をインストール",
  sharedVia: "Hearth Atlas で共有",
  notFoundTitle: "レシピが見つかりません",
  notFoundBody: "この共有リンクは存在しないか、有効期限が切れています。",
  discoverCta: "Hearth Atlas を見る",
  recipeFallback: "レシピ",
  ogDescription: "{context} — Hearth Atlas で作れるレシピ",
  ogDescriptionNoContext: "Hearth Atlas で作れるレシピ",
};

const ru: Chrome = {
  ingredients: "Ингредиенты",
  equipment: "Инвентарь",
  preparation: "Приготовление",
  pairings: "Сочетания",
  menu: "Меню",
  alcoholic: "Алкогольный",
  nonAlcoholic: "Безалкогольный",
  minutesSuffix: "мин",
  servesShort: "чел.",
  servesLine: "На {n} чел.",
  ctaHeading: "Готовьте мир с Hearth Atlas",
  ctaBody: "Рецепты со всего мира — кулинарный гид в вашем кармане.",
  badgeAppStoreTop: "Загрузите в",
  badgePlayTop: "Доступно в",
  qrCaption: "Отсканируйте, чтобы установить Hearth Atlas",
  sharedVia: "Отправлено через Hearth Atlas",
  notFoundTitle: "Рецепт не найден",
  notFoundBody: "Эта ссылка не существует или срок её действия истёк.",
  discoverCta: "Открыть Hearth Atlas",
  recipeFallback: "Рецепт",
  ogDescription: "{context} — рецепт для приготовления в Hearth Atlas",
  ogDescriptionNoContext: "Рецепт для приготовления в Hearth Atlas",
};

const ko: Chrome = {
  ingredients: "재료",
  equipment: "조리 도구",
  preparation: "만드는 법",
  pairings: "페어링",
  menu: "메뉴",
  alcoholic: "알코올",
  nonAlcoholic: "무알코올",
  minutesSuffix: "분",
  servesShort: "인분",
  servesLine: "{n}인분",
  ctaHeading: "Hearth Atlas와 함께 세계를 요리하세요",
  ctaBody: "전 세계의 레시피, 주머니 속 요리 가이드.",
  badgeAppStoreTop: "다운로드",
  badgePlayTop: "받기",
  qrCaption: "스캔하여 Hearth Atlas 설치",
  sharedVia: "Hearth Atlas을 통해 공유됨",
  notFoundTitle: "레시피를 찾을 수 없습니다",
  notFoundBody: "이 공유 링크가 존재하지 않거나 만료되었습니다.",
  discoverCta: "Hearth Atlas 둘러보기",
  recipeFallback: "레시피",
  ogDescription: "{context} — Hearth Atlas에서 요리할 수 있는 레시피",
  ogDescriptionNoContext: "Hearth Atlas에서 요리할 수 있는 레시피",
};

const nl: Chrome = {
  ingredients: "Ingrediënten",
  equipment: "Benodigdheden",
  preparation: "Bereiding",
  pairings: "Combinaties",
  menu: "Menu",
  alcoholic: "Alcoholisch",
  nonAlcoholic: "Alcoholvrij",
  minutesSuffix: "min",
  servesShort: "pers.",
  servesLine: "Voor {n} pers.",
  ctaHeading: "Kook de wereld met Hearth Atlas",
  ctaBody: "Recepten van over de hele wereld, een kookgids in je zak.",
  badgeAppStoreTop: "Download in de",
  badgePlayTop: "Ontdek het op",
  qrCaption: "Scan om Hearth Atlas te installeren",
  sharedVia: "Gedeeld via Hearth Atlas",
  notFoundTitle: "Recept niet gevonden",
  notFoundBody: "Deze deellink bestaat niet of is verlopen.",
  discoverCta: "Ontdek Hearth Atlas",
  recipeFallback: "Recept",
  ogDescription: "{context} — een recept om te koken op Hearth Atlas",
  ogDescriptionNoContext: "Een recept om te koken op Hearth Atlas",
};

const tr: Chrome = {
  ingredients: "Malzemeler",
  equipment: "Ekipman",
  preparation: "Hazırlanışı",
  pairings: "Eşleştirmeler",
  menu: "Menü",
  alcoholic: "Alkollü",
  nonAlcoholic: "Alkolsüz",
  minutesSuffix: "dk",
  servesShort: "kişilik",
  servesLine: "{n} kişilik",
  ctaHeading: "Hearth Atlas ile dünyayı pişirin",
  ctaBody: "Dünyanın dört bir yanından tarifler, cebinizde bir yemek rehberi.",
  badgeAppStoreTop: "İndir",
  badgePlayTop: "Edinin",
  qrCaption: "Hearth Atlas'ı yüklemek için tarayın",
  sharedVia: "Hearth Atlas ile paylaşıldı",
  notFoundTitle: "Tarif bulunamadı",
  notFoundBody: "Bu paylaşım bağlantısı mevcut değil veya süresi dolmuş.",
  discoverCta: "Hearth Atlas'ı keşfedin",
  recipeFallback: "Tarif",
  ogDescription: "{context} — Hearth Atlas'ta pişirilecek bir tarif",
  ogDescriptionNoContext: "Hearth Atlas'ta pişirilecek bir tarif",
};

const id: Chrome = {
  ingredients: "Bahan",
  equipment: "Peralatan",
  preparation: "Cara membuat",
  pairings: "Padanan",
  menu: "Menu",
  alcoholic: "Beralkohol",
  nonAlcoholic: "Non-alkohol",
  minutesSuffix: "mnt",
  servesShort: "porsi",
  servesLine: "Untuk {n} porsi",
  ctaHeading: "Masak dunia bersama Hearth Atlas",
  ctaBody: "Resep dari seluruh dunia, panduan memasak di saku Anda.",
  badgeAppStoreTop: "Unduh di",
  badgePlayTop: "Dapatkan di",
  qrCaption: "Pindai untuk memasang Hearth Atlas",
  sharedVia: "Dibagikan melalui Hearth Atlas",
  notFoundTitle: "Resep tidak ditemukan",
  notFoundBody: "Tautan berbagi ini tidak ada atau telah kedaluwarsa.",
  discoverCta: "Jelajahi Hearth Atlas",
  recipeFallback: "Resep",
  ogDescription: "{context} — resep untuk dimasak di Hearth Atlas",
  ogDescriptionNoContext: "Resep untuk dimasak di Hearth Atlas",
};

const pl: Chrome = {
  ingredients: "Składniki",
  equipment: "Sprzęt",
  preparation: "Przygotowanie",
  pairings: "Połączenia",
  menu: "Menu",
  alcoholic: "Alkoholowy",
  nonAlcoholic: "Bezalkoholowy",
  minutesSuffix: "min",
  servesShort: "os.",
  servesLine: "Dla {n} os.",
  ctaHeading: "Gotuj świat z Hearth Atlas",
  ctaBody: "Przepisy z całego świata, przewodnik kulinarny w Twojej kieszeni.",
  badgeAppStoreTop: "Pobierz z",
  badgePlayTop: "Dostępne w",
  qrCaption: "Zeskanuj, aby zainstalować Hearth Atlas",
  sharedVia: "Udostępniono przez Hearth Atlas",
  notFoundTitle: "Nie znaleziono przepisu",
  notFoundBody: "Ten link do udostępniania nie istnieje lub wygasł.",
  discoverCta: "Odkryj Hearth Atlas",
  recipeFallback: "Przepis",
  ogDescription: "{context} — przepis do ugotowania w Hearth Atlas",
  ogDescriptionNoContext: "Przepis do ugotowania w Hearth Atlas",
};

// All 16 content languages are covered — every code in CONTENT_LANGS has an entry
// here. getChrome still falls back to English for anything unexpected.
const TABLE: Partial<Record<ContentLang, Chrome>> = { en, fr, de, es, it, pt, zh, ar, hi, ja, ru, ko, nl, tr, id, pl };

/**
 * Normalize a payload language to a known content language. Strips any region
 * ('fr-CA' → 'fr'), lowercases, and falls back to 'en' when absent or unknown.
 * Returns the CONTENT language, which is what the page's `lang` attribute needs —
 * not whether the chrome for it has been translated yet.
 */
export function resolveLang(lang: string | undefined | null): ContentLang {
  const base = (lang || "en").slice(0, 2).toLowerCase();
  return (CONTENT_LANGS as readonly string[]).includes(base)
    ? (base as ContentLang)
    : "en";
}

/** Chrome strings for a language, falling back to English when not yet translated. */
export function getChrome(lang: string): Chrome {
  const base = (lang || "en").slice(0, 2).toLowerCase();
  return TABLE[base as ContentLang] ?? en;
}

/** Arabic is the only right-to-left language in the content set today. */
export function isRTL(lang: string): boolean {
  return resolveLang(lang) === "ar";
}

/**
 * Replace {name} placeholders with values. Plain string substitution — no i18n
 * library. An unknown placeholder is left untouched rather than blanked, so a
 * typo shows up as literal "{n}" instead of silently disappearing.
 */
export function fill(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}
