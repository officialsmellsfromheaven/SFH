import { products, type Product, getProductFragranceFamilies, getProductMainAccords, getProductSubCategories } from "@/lib/data";

export const popularSearches = [
  "Sauvage",
  "Khamrah",
  "Khamrah Qahwa",
  "Cool Water",
  "Oud",
  "Vanilla",
  "Imagination",
  "Gucci Flora",
  "Good Girl",
  "Fresh",
];

const normalize = (value: string) => value.trim().toLowerCase();

export function getFeaturedSearchSuggestions(catalog: Product[] = products) {
  return [...catalog]
    .filter((product) => product.isBestSeller || product.isNew || product.rating >= 4.6)
    .sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || b.rating - a.rating)
    .slice(0, 4);
}

export function searchProducts(query: string, catalog: Product[] = products) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return [];
  }

  return [...catalog]
    .map((product) => {
      const name = (product.name ?? "").toLowerCase();
      const brand = (product.brand ?? "").toLowerCase();
      const family = (product.fragranceFamily ?? "").toLowerCase();
      const gender = (product.gender ?? "").toLowerCase();
      const collectionMatch = product.collections?.some((collection) =>
        collection.toLowerCase().includes(normalizedQuery)
      );

      const familyMatches = getProductFragranceFamilies(product).map((item) => item.toLowerCase());
      const subCategories = getProductSubCategories(product).map((item) => item.toLowerCase());
      const mainAccords = getProductMainAccords(product).map((item) => item.toLowerCase());
      const notes = [
        ...(product.topNotes ?? []),
        ...(product.heartNotes ?? []),
        ...(product.baseNotes ?? []),
      ].map((note) => note.toLowerCase());

      let score = 0;

      if (name === normalizedQuery) score += 1000;
      if (name.startsWith(normalizedQuery)) score += 550;
      if (name.includes(normalizedQuery)) score += 420;
      if (brand.includes(normalizedQuery)) score += 260;
      if (family.includes(normalizedQuery)) score += 230;
      if (gender.includes(normalizedQuery)) score += 200;
      if (collectionMatch) score += 180;

      if (familyMatches.some((item) => item.includes(normalizedQuery))) score += 200;
      if (subCategories.some((item) => item.includes(normalizedQuery))) score += 180;
      if (mainAccords.some((item) => item.includes(normalizedQuery))) score += 170;
      if (notes.some((note) => note.includes(normalizedQuery))) score += 150;

      const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
      const wordMatches = queryWords.filter((word) => {
        if (!word) return false;
        return (
          name.includes(word) ||
          brand.includes(word) ||
          family.includes(word) ||
          familyMatches.some((item) => item.includes(word)) ||
          subCategories.some((item) => item.includes(word)) ||
          mainAccords.some((item) => item.includes(word)) ||
          notes.some((note) => note.includes(word)) ||
          collectionMatch
        );
      }).length;

      if (wordMatches > 0) score += wordMatches * 25;

      return { product, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
    .map(({ product }) => product);
}
