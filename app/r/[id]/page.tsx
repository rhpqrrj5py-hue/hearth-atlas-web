import Link from "next/link";
import { Fraunces, Inter } from "next/font/google";

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
// presents those strings; no glossary, no i18n, no slug resolution. French labels.

// --- Brand ------------------------------------------------------------------
const HOME_URL = "https://hearthatlas.lodestar-studio.com";
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

function PairingCard({ pairing }: { pairing: Pairing }) {
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
          {pairing.alcoholic ? "Alcoolisé" : "Sans alcool"}
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
}: {
  recipe: Recipe;
  pairings?: Pairing[];
  stepItems?: SharedStepItems[];
  isMenu: boolean;
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
              <Pill tint="purple">{recipe.totalTimeMinutes} min</Pill>
            )}
            {recipe.baseServings > 0 && (
              <Pill tint="teal">
                {recipe.baseServings} pers.
              </Pill>
            )}
          </div>
        </div>
      </div>

      {/* Ingredients */}
      {recipe.ingredients?.length > 0 && (
        <Card className="space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <SectionHeading>Ingrédients</SectionHeading>
            <span className="shrink-0 text-sm text-[#8A7F76]">
              Pour {recipe.baseServings} personne
              {recipe.baseServings > 1 ? "s" : ""}
            </span>
          </div>
          <IngredientRows ingredients={recipe.ingredients} />
        </Card>
      )}

      {/* Equipment */}
      {recipe.equipment?.length > 0 && (
        <div className="space-y-3">
          <SectionHeading>Matériel</SectionHeading>
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
          <SectionHeading>Préparation</SectionHeading>
          <Steps steps={recipe.steps} stepItems={stepItems} />
        </Card>
      )}

      {/* Sommelier */}
      {pairings && pairings.length > 0 && (
        <Card className="space-y-4 border-[#0EA5A4]/20">
          <SectionHeading>Accords</SectionHeading>
          <div className="space-y-3">
            {pairings.map((p, i) => (
              <PairingCard key={i} pairing={p} />
            ))}
          </div>
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

function FooterCTA() {
  return (
    <footer className="space-y-6 pb-12 pt-4 text-center">
      <div className="rounded-2xl bg-gradient-to-b from-[#F28705]/[0.08] to-[#F28705]/[0.03] px-6 py-9">
        <h3
          className={`${fraunces.className} text-2xl font-semibold text-[#2F0168]`}
        >
          Cuisinez le monde avec Hearth Atlas
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-[#5C544E]">
          Des recettes du monde entier, un guide de cuisine dans votre poche.
        </p>
        <a
          href={HOME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[#F28705] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          Découvrir l’application
        </a>
        {/* QR codes + store buttons come in the next step. */}
      </div>
      <p className="text-xs text-[#B3A99F]">Partagé via Hearth Atlas</p>
    </footer>
  );
}

function NotFound() {
  return (
    <div
      className={`${inter.className} flex min-h-screen flex-col bg-[#FFF8F1]`}
    >
      <LogoHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 text-center">
        <h1
          className={`${fraunces.className} text-3xl font-semibold text-[#2F0168]`}
        >
          Recette introuvable
        </h1>
        <p className="mt-3 text-[#5C544E]">
          Ce lien de partage n’existe pas ou a expiré.
        </p>
        <a
          href={HOME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#F28705] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          Découvrir Hearth Atlas
        </a>
      </main>
    </div>
  );
}

// --- Page -------------------------------------------------------------------

export default async function SharedRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("shared_recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return <NotFound />;

  const row = data as SharedRecipeRow;
  const payload: SharedRecipePayload | undefined = row.payload;
  const recipes = payload?.recipes ?? [];
  if (recipes.length === 0) return <NotFound />;

  const isMenu = payload.scope === "menu" || recipes.length > 1;
  const title = payload.title || row.title || recipes[0].title;

  return (
    <div className={`${inter.className} min-h-screen bg-[#FFF8F1] text-[#2A2320]`}>
      <div className="mx-auto w-full max-w-2xl px-5">
        <LogoHeader />

        {/* Menu hero: the menu title, above the individual courses. */}
        {isMenu && (
          <div className="space-y-2 pb-8 pt-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F28705]">
              Menu
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
              />
            </div>
          ))}
        </main>

        <FooterCTA />
      </div>
    </div>
  );
}
