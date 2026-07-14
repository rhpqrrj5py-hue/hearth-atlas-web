// Types for the public shared-recipe payload stored in Supabase `shared_recipes.payload`.
// These MIRROR the mobile app's real types (src/recipe/types.ts, src/sommelier/types.ts)
// and src/share/shareRecipe.ts — keep them in sync if those change. The web project can't
// import from the mobile app, so the shapes are redeclared here.
//
// PAYLOAD IS v2: fully localized at share time in the sharer's language (payload.lang).
// Every display string — title, steps, ingredient/equipment names, cuisine, course, and
// the per-step item names in stepItems — is already translated. The web viewer renders
// them directly: no glossary, no i18n lookup, no slug resolution.

export interface Macros {
  fat: number; // % of kcal
  carbs: number; // % of kcal
  protein: number; // % of kcal
}

export interface Ingredient {
  name: string; // localized display name
  quantity: number | null; // null = "to taste"
  unit: string; // 'g', 'ml', 'tbsp', 'to taste', or ''
  cookedIngredientName?: string;
}

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface Recipe {
  id: string; // e.g. "FR-001"
  title: string; // localized
  added?: string; // YYYY-MM-DD
  image?: string; // public URL in the payload (may be absent)
  cuisine: string; // localized display string, e.g. "Allemagne"
  course: string; // localized display string, e.g. "Plat principal"
  difficulty: Difficulty;
  totalTimeMinutes: number;
  baseServings: number;
  caloriesPerPerson: number | null;
  macros: Macros | null;
  ingredients: Ingredient[]; // names localized
  equipment: string[]; // localized
  steps: string[]; // localized
}

export interface Pairing {
  name: string; // canonical, e.g. "Pinot Noir" (intentionally not translated)
  style: string; // colour/style + notes (in the sharer's language)
  origin: string; // region/appellation/country, or ''
  alcoholic: boolean;
  why: string; // one sentence, in the sharer's language
}

// Per-step resolved items, already localized (replaces the old slug-based stepTags).
// Empty arrays are kept so the index aligns with the recipe's steps.
export interface SharedStepItems {
  ingredients: string[]; // localized ingredient display names for this step
  utensils: string[]; // localized utensil/equipment display names for this step
}

// The self-contained snapshot stored in shared_recipes.payload (jsonb), v2.
// pairings / stepItems are OPTIONAL and keyed by recipe id (CHEF-<i> or catalogue id).
export interface SharedRecipePayload {
  version: 2;
  scope: "dish" | "menu";
  lang: string; // content language the names/steps are frozen in (e.g. 'fr', 'en')
  title: string;
  recipes: Recipe[];
  pairings?: Record<string, Pairing[]>;
  stepItems?: Record<string, SharedStepItems[]>;
  sharedAt: string; // ISO
}

// A full row of the public.shared_recipes table.
export interface SharedRecipeRow {
  id: string;
  payload: SharedRecipePayload;
  title: string | null;
  image_url: string | null;
  scope: "dish" | "menu";
  created_by: string;
  created_at?: string;
}
