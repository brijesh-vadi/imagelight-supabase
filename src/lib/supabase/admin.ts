import { createServerClient } from "@supabase/ssr";

export const createAdminClient = () =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    },
  );
