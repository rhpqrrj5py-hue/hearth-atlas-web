import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Inter } from "next/font/google";
import QRCode from "qrcode";

import { fill, getChrome, isRTL, resolveLang, type Chrome } from "@/lib/chrome-i18n";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/stores";
import { supabase } from "@/lib/supabase";
import type {
  Ingredient,
  Pairing,
  Recipe,
  SharedRecipePayload,
  SharedRecipeRow,
  SharedStepItems,
} from "@/lib/sharedRecipe";

// Public shared-recipe page. Server Component: fetches the row on the server and
// renders a v2 payload that is already fully localized (payload.lang) — title, steps,
// ingredient/equipment names, cuisine, course, and per-step stepItems. This page only
// presents those strings; no glossary, no slug resolution. The page's OWN chrome
// (headings, meta pills, CTA, not-found) is localized from payload.lang via
// lib/chrome-i18n, falling back to English for languages not yet in that table.

// --- Brand ------------------------------------------------------------------
const HOME_URL = "https://hearthatlas.lodestar-studio.com";
// APP_STORE_URL / PLAY_STORE_URL viennent desormais de lib/stores.ts, partages
// avec la page d accueil. Ils pointaient ici sur la page d accueil, faute de
// liens stores au moment de l ecriture : un visiteur sur ordinateur qui cliquait
// « App Store » atterrissait sur la landing au lieu de la boutique.
// cream #FFF8F1 · orange #F28705 · blue #5171FF · purple #2F0168 · teal #0EA5A4

// Warm serif for headings, clean sans for body.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// --- Small presentational helpers -------------------------------------------

/** The quantity + unit part of an ingredient (accent-colored), or "" when to-taste. */
function ingredientAmount(ing: Ingredient): string {
  const qty = ing.quantity != null ? String(ing.quantity) : null;
  const unit = ing.unit?.trim() ?? "";
  return [qty, unit].filter(Boolean).join(" ").trim();
}

function Pill({
  children,
  tint,
}: {
  children: React.ReactNode;
  tint: "orange" | "blue" | "purple" | "teal";
}) {
  const tints: Record<string, string> = {
    orange: "bg-[#F28705]/12 text-[#C26A00]",
    blue: "bg-[#5171FF]/12 text-[#3A50C9]",
    purple: "bg-[#2F0168]/10 text-[#2F0168]",
    teal: "bg-[#0EA5A4]/12 text-[#0B7E7D]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${tints[tint]}`}
    >
      {children}
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className={`${fraunces.className} flex items-center gap-2.5 text-xl font-semibold text-[#2F0168]`}
    >
      <span className="h-5 w-1 rounded-full bg-[#F28705]" aria-hidden />
      {children}
    </h3>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-[#F28705]/10 bg-white p-6 shadow-[0_2px_14px_rgba(47,1,104,0.05)] ${className}`}
    >
      {children}
    </section>
  );
}

function IngredientRows({ ingredients }: { ingredients: Ingredient[] }) {
  return (
    <ul className="divide-y divide-[#2F0168]/5">
      {ingredients.map((ing, i) => {
        const amount = ingredientAmount(ing);
        return (
          <li key={i} className="flex items-baseline gap-3 py-2.5">
            <span className="min-w-[68px] shrink-0 text-sm font-semibold text-[#C26A00]">
              {amount || "—"}
            </span>
            <span className="text-[15px] leading-relaxed text-[#2A2320]">
              {ing.name}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function StepItems({ items }: { items: SharedStepItems | undefined }) {
  if (!items) return null;
  const names = [...(items.ingredients ?? []), ...(items.utensils ?? [])];
  if (names.length === 0) return null;
  return (
    <p className="mt-2 text-[13px] italic leading-relaxed text-[#8A7F76]">
      {names.join(" · ")}
    </p>
  );
}

function Steps({
  steps,
  stepItems,
}: {
  steps: string[];
  stepItems?: SharedStepItems[];
}) {
  return (
    <ol className="space-y-6">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-4">
          <span
            className={`${fraunces.className} flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F28705] text-sm font-semibold text-white shadow-sm`}
            aria-hidden
          >
            {i + 1}
          </span>
          <div className="pt-0.5">
            <p className="text-[16px] leading-[1.7] text-[#2A2320]">{step}</p>
            <StepItems items={stepItems?.[i]} />
          </div>
        </li>
      ))}
    </ol>
  );
}

function PairingCard({ pairing, chrome }: { pairing: Pairing; chrome: Chrome }) {
  const support = [pairing.style, pairing.origin]
    .filter((x) => x && x !== "—")
    .join(" · ");
  return (
    <div className="rounded-xl bg-[#0EA5A4]/[0.06] p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h4
          className={`${fraunces.className} text-lg font-semibold text-[#0B6E6D]`}
        >
          {pairing.name}
        </h4>
        <span className="shrink-0 rounded-full bg-[#0EA5A4]/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#0B7E7D]">
          {pairing.alcoholic ? chrome.alcoholic : chrome.nonAlcoholic}
        </span>
      </div>
      {support && <p className="mt-1 text-sm text-[#5C544E]">{support}</p>}
      {pairing.why && (
        <p className="mt-1.5 text-[15px] leading-relaxed text-[#2A2320]">
          {pairing.why}
        </p>
      )}
    </div>
  );
}

// --- Recipe block -----------------------------------------------------------

function RecipeBlock({
  recipe,
  pairings,
  stepItems,
  isMenu,
  chrome,
}: {
  recipe: Recipe;
  pairings?: Pairing[];
  stepItems?: SharedStepItems[];
  isMenu: boolean;
  chrome: Chrome;
}) {
  return (
    <article className="space-y-8">
      {/* Hero: image, title, meta pills */}
      <div className="space-y-5">
        {recipe.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.image}
            alt={recipe.title}
            className="aspect-[16/10] max-h-[420px] w-full rounded-2xl object-cover shadow-[0_6px_24px_rgba(47,1,104,0.12)]"
          />
        )}
        <div className="space-y-3">
          {isMenu && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F28705]">
              {recipe.course}
            </p>
          )}
          <h2
            className={`${fraunces.className} text-3xl font-semibold leading-tight text-[#2F0168]`}
          >
            {recipe.title}
          </h2>
          <div className="flex flex-wrap gap-2">
            {recipe.cuisine && <Pill tint="orange">{recipe.cuisine}</Pill>}
            {!isMenu && recipe.course && (
              <Pill tint="blue">{recipe.course}</Pill>
            )}
            {recipe.totalTimeMinutes > 0 && (
              <Pill tint="purple">
                {recipe.totalTimeMinutes} {chrome.minutesSuffix}
              </Pill>
            )}
            {recipe.baseServings > 0 && (
              <Pill tint="teal">
                {recipe.baseServings} {chrome.servesShort}
              </Pill>
            )}
          </div>
        </div>
      </div>

      {/* Ingredients */}
      {recipe.ingredients?.length > 0 && (
        <Card className="space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <SectionHeading>{chrome.ingredients}</SectionHeading>
            <span className="shrink-0 text-sm text-[#8A7F76]">
              {fill(chrome.servesLine, { n: recipe.baseServings })}
            </span>
          </div>
          <IngredientRows ingredients={recipe.ingredients} />
        </Card>
      )}

      {/* Equipment */}
      {recipe.equipment?.length > 0 && (
        <div className="space-y-3">
          <SectionHeading>{chrome.equipment}</SectionHeading>
          <div className="flex flex-wrap gap-2">
            {recipe.equipment.map((e, i) => (
              <span
                key={i}
                className="rounded-lg bg-[#2F0168]/[0.05] px-3 py-1.5 text-sm text-[#4A4038]"
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Preparation */}
      {recipe.steps?.length > 0 && (
        <Card className="space-y-5">
          <SectionHeading>{chrome.preparation}</SectionHeading>
          <Steps steps={recipe.steps} stepItems={stepItems} />
        </Card>
      )}

      {/* Sommelier */}
      {pairings && pairings.length > 0 && (
        <Card className="space-y-4 border-[#0EA5A4]/20">
          <SectionHeading>{chrome.pairings}</SectionHeading>
          <div className="space-y-3">
            {pairings.map((p, i) => (
              <PairingCard key={i} pairing={p} chrome={chrome} />
            ))}
          </div>
          {/* ACC-3 — health message, word for word as in the app (always under the pairings). */}
          <p className="text-[13px] italic leading-relaxed text-[#5C544E]">
            {chrome.alcoholWarning}
          </p>
        </Card>
      )}
    </article>
  );
}

// --- Chrome -----------------------------------------------------------------

function LogoHeader() {
  return (
    <header className="flex justify-center py-9">
      <a
        href={HOME_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 sm:gap-4"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/globe.png"
          alt=""
          aria-hidden
          className="h-12 w-12 shrink-0 sm:h-14 sm:w-14"
        />
        <span className="flex flex-col">
          <span
            className={`${fraunces.className} text-2xl font-semibold leading-none text-[#2F0168] sm:text-3xl`}
          >
            Hearth Atlas
          </span>
          <span className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#C26A00] sm:text-xs">
            Crave it. Cook it. Learn the world.
          </span>
        </span>
      </a>
    </header>
  );
}

/** A QR code as an inline SVG string (server-side, no client JS). Purple modules on
 *  a transparent background so it sits cleanly on the white card. */
async function qrSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#2F0168", light: "#00000000" },
  });
}

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.51 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
    <path d="M3 2.5v19a1 1 0 0 0 1.5.87l16.5-9.5a1 1 0 0 0 0-1.74L4.5 1.63A1 1 0 0 0 3 2.5z" />
  </svg>
);

function StoreBadge({
  href,
  icon,
  top,
  main,
}: {
  href: string;
  icon: React.ReactNode;
  top: string;
  main: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 rounded-xl bg-[#2F0168] px-5 py-2.5 text-white shadow-sm transition-opacity hover:opacity-90"
    >
      {icon}
      <span className="flex flex-col text-left leading-tight">
        <span className="text-[10px] uppercase tracking-wide text-white/70">
          {top}
        </span>
        <span className={`${fraunces.className} text-base font-semibold`}>
          {main}
        </span>
      </span>
    </a>
  );
}

function QrCode({ svg, caption }: { svg: string; caption: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="h-[120px] w-[120px] rounded-lg bg-white p-2 shadow-sm [&_svg]:h-full [&_svg]:w-full"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <span className="text-xs font-medium text-[#5C544E]">{caption}</span>
    </div>
  );
}

async function FooterCTA({ chrome }: { chrome: Chrome }) {
  const [appStoreQr, playStoreQr] = await Promise.all([
    qrSvg(APP_STORE_URL),
    qrSvg(PLAY_STORE_URL),
  ]);

  return (
    <footer className="space-y-6 pb-12 pt-4 text-center">
      <div className="rounded-2xl bg-gradient-to-b from-[#F28705]/[0.08] to-[#F28705]/[0.03] px-6 py-9">
        <h3
          className={`${fraunces.className} text-2xl font-semibold text-[#2F0168]`}
        >
          {chrome.ctaHeading}
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-[#5C544E]">
          {chrome.ctaBody}
        </p>

        {/* Store badges — stack on narrow screens, side by side on wider ones. */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <StoreBadge
            href={APP_STORE_URL}
            icon={<AppleIcon />}
            top={chrome.badgeAppStoreTop}
            main="App Store"
          />
          <StoreBadge
            href={PLAY_STORE_URL}
            icon={<PlayIcon />}
            top={chrome.badgePlayTop}
            main="Google Play"
          />
        </div>

        {/* QR codes to scan-and-install. */}
        <p className="mt-8 text-sm font-medium text-[#5C544E]">
          {chrome.qrCaption}
        </p>
        <div className="mt-4 flex flex-wrap items-start justify-center gap-6">
          <QrCode svg={appStoreQr} caption="App Store" />
          <QrCode svg={playStoreQr} caption="Google Play" />
        </div>
      </div>
      <p className="text-xs text-[#B3A99F]">{chrome.sharedVia}</p>
    </footer>
  );
}

function NotFound({ lang = "en" }: { lang?: string }) {
  const chrome = getChrome(lang);
  return (
    <div
      className={`${inter.className} flex min-h-screen flex-col bg-[#FFF8F1]`}
    >
      <LogoHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 text-center">
        <h1
          className={`${fraunces.className} text-3xl font-semibold text-[#2F0168]`}
        >
          {chrome.notFoundTitle}
        </h1>
        <p className="mt-3 text-[#5C544E]">
          {chrome.notFoundBody}
        </p>
        <a
          href={HOME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#F28705] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          {chrome.discoverCta}
        </a>
      </main>
    </div>
  );
}

// --- Social preview metadata ------------------------------------------------
// Runs on the server before render; a second fetch of the same row is fine (Next
// de-dupes it with the page's fetch when possible). Builds the rich OG/Twitter card
// (dish photo + title + a description in the payload's language, English fallback)
// shown when the link is pasted into WhatsApp, Messages, X, etc. The image_url
// column is already an absolute public URL.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const { data, error } = await supabase
    .rpc("get_shared_recipe", { p_id: id })
    .single();

  // No row at all — there is no payload, so no language to follow: English.
  if (error || !data) {
    return { title: `${getChrome("en").notFoundTitle} · Hearth Atlas` };
  }

  const row = data as SharedRecipeRow;
  const payload = row.payload;
  const first = payload?.recipes?.[0];

  const lang = resolveLang(payload?.lang);
  const chrome = getChrome(lang);

  const recipeTitle = (
    payload?.title ||
    row.title ||
    first?.title ||
    chrome.recipeFallback
  ).trim();
  const fullTitle = `${recipeTitle} · Hearth Atlas`;

  const context = [first?.cuisine?.trim(), first?.course?.trim()]
    .filter(Boolean)
    .join(" · ");
  const description = context
    ? fill(chrome.ogDescription, { context })
    : chrome.ogDescriptionNoContext;

  const image = row.image_url || first?.image || undefined;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      type: "article",
      siteName: "Hearth Atlas",
      ...(payload?.lang ? { locale: lang } : {}),
      ...(image ? { images: [{ url: image, alt: recipeTitle }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

// --- Page -------------------------------------------------------------------

export default async function SharedRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabase
    .rpc("get_shared_recipe", { p_id: id })
    .single();

  if (error || !data) return <NotFound />;

  const row = data as SharedRecipeRow;
  const payload: SharedRecipePayload | undefined = row.payload;
  const recipes = payload?.recipes ?? [];
  const lang = resolveLang(payload?.lang);
  if (recipes.length === 0) return <NotFound lang={lang} />;

  const chrome = getChrome(lang);
  const isMenu = payload.scope === "menu" || recipes.length > 1;
  const title = payload.title || row.title || recipes[0].title;

  return (
    <div
      lang={lang}
      dir={isRTL(lang) ? "rtl" : "ltr"}
      className={`${inter.className} min-h-screen bg-[#FFF8F1] text-[#2A2320]`}
    >
      <div className="mx-auto w-full max-w-2xl px-5">
        <LogoHeader />

        {/* Menu hero: the menu title, above the individual courses. */}
        {isMenu && (
          <div className="space-y-2 pb-8 pt-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F28705]">
              {chrome.menu}
            </p>
            <h1
              className={`${fraunces.className} text-4xl font-semibold leading-tight text-[#2F0168]`}
            >
              {title}
            </h1>
          </div>
        )}

        <main className="space-y-12 pb-4">
          {recipes.map((recipe, i) => (
            <div
              key={recipe.id ?? i}
              className={
                isMenu && i > 0 ? "border-t border-[#F28705]/15 pt-12" : undefined
              }
            >
              <RecipeBlock
                recipe={recipe}
                pairings={payload.pairings?.[recipe.id]}
                stepItems={payload.stepItems?.[recipe.id]}
                isMenu={isMenu}
                chrome={chrome}
              />
            </div>
          ))}
        </main>

        <FooterCTA chrome={chrome} />
      </div>
    </div>
  );
}
