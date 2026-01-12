export async function fetchManufacturerProductById(productId: string) {
  const res = await fetch(`/api/manufacturer/products/${productId}`);

  if (!res.ok) {
    throw new Error("Network error while fetching product");
  }

  return res.json();
}
