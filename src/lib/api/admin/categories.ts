export async function fetchAdminCategories() {
  const res = await fetch("/api/admin/categories");

  if (!res.ok) {
    throw new Error("Network error while fetching categories");
  }

  return res.json();
}
