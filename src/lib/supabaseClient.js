import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  const missing = [
    !supabaseUrl ? "VITE_SUPABASE_URL" : null,
    !supabaseAnonKey ? "VITE_SUPABASE_ANON_KEY" : null,
  ]
    .filter(Boolean)
    .join(", ");

  throw new Error(
    `Missing ${missing} environment variable(s). Create a .env file in the project root with:\nVITE_SUPABASE_URL=https://your-project-ref.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key\nThen restart the Vite dev server.`
  );
}

if (!/^https?:\/\//i.test(supabaseUrl)) {
  throw new Error(
    "Invalid VITE_SUPABASE_URL. Use the full URL, for example: https://your-project-ref.supabase.co"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
