export async function fetchUnits() {
  const res = await fetch("/api/manufacturer/units");

  if (!res.ok) {
    throw new Error("Failed to fetch units");
  }

  return res.json();
}
