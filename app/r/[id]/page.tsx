import Link from "next/link";

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
// renders the full recipe(s) from a v2 payload. Everything is already localized in
// payload.lang (title, steps, ingredient/equipment names, cuisine, course, stepItems),
// so this page renders strings directly — no glossary, no i18n, no slug resolution.
// French section labels (Ingrédients, Préparation, Accords, …).

/** "150 g — Farine", "Sel (à volonté)", "2 — Œufs" — quantity may be null ("to taste"). */
function formatIngredient(ing: Ingredient): string {
  const qty = ing.quantity != null ? String(ing.quantity) : null;
  const unit = ing.unit?.trim() ?? "";
  const amount = [qty, unit].filter(Boolean).join(" ").trim();
  if (!amount) return ing.name;
  return `${amount} — ${ing.name}`;
}

function IngredientList({ ingredients }: { ingredients: Ingredient[] }) {
  if (!ingredients?.length) return null;
  return (
    <ul className="list-disc space-y-1 pl-6">
      {ingredients.map((ing, i) => (
        <li key={i}>{formatIngredient(ing)}</li>
      ))}
    </ul>
  );
}

/** Small line under a step listing the resolved (already localized) item names. */
function StepItems({ items }: { items: SharedStepItems | undefined }) {
  if (!items) return null;
  const names = [...(items.ingredients ?? []), ...(items.utensils ?? [])];
  if (names.length === 0) return null;
  return (
    <p className="mt-1 text-sm text-gray-500">{names.join(" · ")}</p>
  );
}

function PairingList({ pairings }: { pairings: Pairing[] }) {
  if (!pairings?.length) return null;
  return (
    <div className="space-y-4">
      {pairings.map((p, i) => (
        <div key={i} className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="font-semibold">{p.name}</h4>
            <span className="text-xs uppercase tracking-wide text-gray-500">
              {p.alcoholic ? "Alcoolisé" : "Sans alcool"}
            </span>
          </div>
          {(p.style || p.origin) && (
            <p className="text-sm text-gray-700">
              {[p.style, p.origin].filter((x) => x && x !== "—").join(" · ")}
            </p>
          )}
          {p.why && <p className="mt-1 text-sm text-gray-700">{p.why}</p>}
        </div>
      ))}
    </div>
  );
}

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
    <article className="space-y-6">
      <header className="space-y-1">
        {isMenu && (
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            {recipe.course}
          </p>
        )}
        <h2 className="text-2xl font-bold">{recipe.title}</h2>
        <p className="text-sm text-gray-600">
          {[
            recipe.cuisine,
            !isMenu ? recipe.course : null,
            recipe.totalTimeMinutes ? `${recipe.totalTimeMinutes} min` : null,
            recipe.baseServings ? `${recipe.baseServings} pers.` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>

      {recipe.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full rounded-lg object-cover"
        />
      )}

      {recipe.ingredients?.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-lg font-semibold">Ingrédients</h3>
          <p className="text-sm text-gray-500">
            Pour {recipe.baseServings} personne
            {recipe.baseServings > 1 ? "s" : ""}
          </p>
          <IngredientList ingredients={recipe.ingredients} />
        </section>
      )}

      {recipe.equipment?.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-lg font-semibold">Matériel</h3>
          <ul className="list-disc space-y-1 pl-6">
            {recipe.equipment.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </section>
      )}

      {recipe.steps?.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-lg font-semibold">Préparation</h3>
          <ol className="list-decimal space-y-3 pl-6">
            {recipe.steps.map((step, i) => (
              <li key={i} className="pl-1">
                <span>{step}</span>
                <StepItems items={stepItems?.[i]} />
              </li>
            ))}
          </ol>
        </section>
      )}

      {pairings && pairings.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Accords</h3>
          <PairingList pairings={pairings} />
        </section>
      )}
    </article>
  );
}

function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Recette introuvable</h1>
      <p className="mt-2 text-gray-600">
        Ce lien de partage n’existe pas ou a expiré.
      </p>
      <Link href="/" className="mt-6 inline-block text-blue-600 underline">
        Retour à l’accueil
      </Link>
    </main>
  );
}

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
    <main className="mx-auto max-w-2xl space-y-10 px-4 py-10">
      <header className="space-y-1 border-b border-gray-200 pb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
          {isMenu ? "Menu" : "Recette"}
        </p>
        <h1 className="text-3xl font-bold">{title}</h1>
      </header>

      {recipes.map((recipe, i) => (
        <div
          key={recipe.id ?? i}
          className={
            isMenu && i > 0 ? "border-t border-gray-200 pt-10" : undefined
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

      <footer className="border-t border-gray-200 pt-6 text-center text-sm text-gray-400">
        Partagé via Hearth Atlas
      </footer>
    </main>
  );
}
