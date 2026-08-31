import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const productsDir = path.join(projectRoot, "public", "products");
const outputFile = path.join(projectRoot, "src", "lib", "generatedProductCatalog.ts");
const pricingConfigPath = path.join(projectRoot, "config", "pricing.json");
const pricingConfig = JSON.parse(fs.readFileSync(pricingConfigPath, "utf8"));
const defaultSingleProductPricing = pricingConfig.defaultSingleProductPricing ?? {
  "20ml": 299,
  "30ml": 399,
  "50ml": 599,
  "100ml": 1199,
};
const defaultSingleProductSizeOrder = pricingConfig.defaultSingleProductSizeOrder ?? ["20ml", "30ml", "50ml", "100ml"];

const normalizeCategory = (value) => {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (["men", "male"].includes(normalized)) return "men";
  if (["women", "female"].includes(normalized)) return "women";
  if (["unisex", "neutral"].includes(normalized)) return "unisex";
  if (["attar", "attars"].includes(normalized)) return "attar";
  if (["luxury", "premium"].includes(normalized)) return "luxury";
  if (["inspired", "inspired by designer"].includes(normalized)) return "inspired";
  return "unisex";
};

const normalizeProductIdentity = (value) => String(value ?? "")
  .trim()
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[’']/g, "")
  .replace(/[^a-z0-9]+/g, "")
  .replace(/^-+|-+$/g, "");

const normalizeProductSlug = (value) => String(value ?? "")
  .trim()
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[’']/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const readProductJson = (folderPath) => {
  const metadataPath = path.join(folderPath, "product.json");
  if (!fs.existsSync(metadataPath)) return null;

  try {
    const contents = fs.readFileSync(metadataPath, "utf8");
    return JSON.parse(contents);
  } catch (error) {
    console.warn(`Skipping invalid product metadata for ${folderPath}:`, error.message);
    return null;
  }
};

const imageExtensions = /\.(jpe?g|png|webp|avif|gif|svg)$/i;

const toProduct = (folderName, metadata) => {
  const safeName = metadata.name || folderName.replace(/[-_]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  const normalizedSlug = normalizeProductSlug(metadata.slug || folderName || safeName);
  const slug = normalizedSlug || "product";
  const brand = metadata.brand || "Custom";
  const folderPath = path.join(productsDir, folderName);
  const fallbackImages = fs.existsSync(folderPath)
    ? fs
        .readdirSync(folderPath, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .filter((name) => imageExtensions.test(name) && name !== "product.json")
        .sort((a, b) => a.localeCompare(b))
        .map((name) => `/products/${folderName}/${name}`)
    : [];

  const images = metadata.images && metadata.images.length > 0
    ? metadata.images.map((image) => (image.startsWith("/") ? image : `/products/${folderName}/${image}`))
    : fallbackImages;

  const price = toNumber(metadata.price, 999);
  const baseNotes = metadata.baseNotes ?? metadata.notes?.base ?? ["Musk"];
  const topNotes = metadata.topNotes ?? metadata.notes?.top ?? ["Bergamot"];
  const heartNotes = metadata.heartNotes ?? metadata.notes?.heart ?? ["Rose"];

  const explicitSizeEntries = Array.isArray(metadata.sizes) ? metadata.sizes : [];
  const mergedSizeEntries = new Map();

  for (const size of defaultSingleProductSizeOrder) {
    const matchingExplicitValue = explicitSizeEntries.find((entry) => String(entry.size).trim() === size);
    mergedSizeEntries.set(size, {
      size,
      price: matchingExplicitValue
        ? toNumber(matchingExplicitValue.price, defaultSingleProductPricing[size] ?? 0)
        : defaultSingleProductPricing[size] ?? 0,
    });
  }

  for (const entry of explicitSizeEntries) {
    const size = String(entry.size).trim();
    if (!size) continue;
    const normalizedSize = size.match(/\d+/) ? `${size.match(/\d+/)[0]}ml` : size;
    mergedSizeEntries.set(normalizedSize, {
      size: normalizedSize,
      price: toNumber(entry.price, defaultSingleProductPricing[normalizedSize] ?? 0),
    });
  }

  const normalizedSizes = defaultSingleProductSizeOrder
    .map((size) => mergedSizeEntries.get(size))
    .filter(Boolean)
    .concat(Array.from(mergedSizeEntries.values()).filter((entry) => !defaultSingleProductSizeOrder.includes(entry.size)));

  const productId = String(metadata.id ?? slug ?? "product").trim() || slug;

  return {
    id: productId,
    slug,
    name: safeName,
    brand,
    category: normalizeCategory(metadata.category || metadata.gender || "unisex"),
    price: Number.isFinite(price) && price > 0 && price !== 999 ? price : normalizedSizes[0]?.price ?? defaultSingleProductPricing["20ml"],
    originalPrice: metadata.originalPrice ?? undefined,
    discount: metadata.discount ?? undefined,
    sizes: normalizedSizes,
    images: images.length > 0 ? images : ["/images/placeholder.svg"],
    thumbnail: metadata.thumbnail || images[0] || "/images/placeholder.svg",
    fragranceFamily: metadata.fragranceFamily || metadata.category || "UNCATEGORIZED",
    occasion: metadata.occasion && metadata.occasion.length > 0 ? metadata.occasion : ["Daily Wear"],
    longevity: metadata.longevity || "8–12 hours",
    projection: metadata.projection || "Moderate",
    season: metadata.season && metadata.season.length > 0 ? metadata.season : ["All Seasons"],
    gender: metadata.gender || "Unisex",
    topNotes,
    heartNotes,
    baseNotes,
    description: metadata.description || `${safeName} is a refined fragrance crafted for everyday elegance.`,
    rating: toNumber(metadata.rating, 4.5),
    reviewCount: toNumber(metadata.reviewCount, 0),
    isNew: Boolean(metadata.isNew ?? false),
    isBestSeller: Boolean(metadata.isBestSeller ?? false),
    isLimited: Boolean(metadata.isLimited ?? false),
    featured: Boolean(metadata.featured ?? false),
    bestseller: Boolean(metadata.bestseller ?? false),
    newArrival: Boolean(metadata.newArrival ?? metadata.isNew ?? false),
    available: metadata.available ?? true,
    stock: toNumber(metadata.stock, 999),
    ingredients: metadata.ingredients || "Alcohol Denat., Parfum (Fragrance)",
    collections: metadata.collections && metadata.collections.length > 0 ? metadata.collections : ["Signature Collection"],
    collection: metadata.collection || metadata.collections?.[0] || "Signature Collection",
    tags: metadata.tags && metadata.tags.length > 0 ? metadata.tags : [safeName],
    notes: metadata.notes || {
      top: topNotes,
      heart: heartNotes,
      base: baseNotes,
    },
    mainAccords: metadata.mainAccords ?? [
      { name: "Fresh", strength: 70 },
      { name: "Woody", strength: 60 },
    ],
  };
};

const buildCatalog = () => {
  if (!fs.existsSync(productsDir)) {
    return [];
  }

  const folders = fs
    .readdirSync(productsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const seenKeys = new Set();
  const products = [];

  for (const folderName of folders) {
    const productJson = readProductJson(path.join(productsDir, folderName));
    if (!productJson) continue;

    const product = toProduct(folderName, productJson);
    const identityKeys = [
      normalizeProductIdentity(product.slug || product.id),
      normalizeProductIdentity(product.id),
      normalizeProductIdentity(product.name),
    ].filter(Boolean);

    const duplicateKey = identityKeys.find((key) => seenKeys.has(key));
    if (duplicateKey) {
      console.warn(`Skipping duplicate product for ${folderName}: duplicate identity matches existing entry (${duplicateKey})`);
      continue;
    }

    identityKeys.forEach((key) => seenKeys.add(key));
    products.push(product);
  }

  return products;
};

const catalog = buildCatalog();
const output = `export const generatedProducts = ${JSON.stringify(catalog, null, 2)} as const;\nexport default generatedProducts;\n`;
fs.writeFileSync(outputFile, output, "utf8");
console.log(`Generated ${catalog.length} product(s) from ${productsDir}`);
