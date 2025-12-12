import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const email = process.env.ADMIN_EMAIL;
  const mobile = process.env.ADMIN_MOBILE;

  if (!username || !password) {
    console.error("ADMIN_USERNAME and ADMIN_PASSWORD are required");
    process.exit(1);
  }

  const { data: existingAdmin, error: checkError } = await supabase
    .from("admin")
    .select("id, username")
    .eq("username", username)
    .single();

  if (existingAdmin) {
    console.log(`Admin "${username}" already exists. Skipping.`);
    process.exit(0);
  }

  if (checkError && checkError.code !== "PGRST116") {
    console.error("Error checking existing admin:", checkError);
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from("admin")
    .insert({
      username,
      password: hashedPassword,
      profile_image: null,
      email,
      mobile,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }

  console.log(`Admin created successfully!`);
  console.log(`Username: ${data.username}`);
  console.log(`ID: ${data.id}`);
  console.log(`Login at /admin/sign-in`);
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  });
