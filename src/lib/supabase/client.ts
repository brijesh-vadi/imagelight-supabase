import { createBrowserClient } from "@supabase/ssr";

// export function createClient() {
//   return createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
//     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
//   );
// }

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
