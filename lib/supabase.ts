import { createClient } from "@supabase/supabase-js";

// Public, read-only Supabase client for the shared-recipe pages.
// Uses only the publishable (anon) key — safe to expose in the browser.
// Access is limited to public data via row-level security (RLS).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Set them in .env.local.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // No user sessions here — this client only reads public data.
    persistSession: false,
    autoRefreshToken: false,
  },
});
