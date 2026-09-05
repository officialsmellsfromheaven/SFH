import generatedProducts from "./generatedProductCatalog";
import { normalizeProductPricing } from "@/lib/pricing";

export type Product = {
  id: string;
  slug?: string;
  name: string;
  brand: string;
  category: "men" | "women" | "unisex" | "attar" | "luxury" | "inspired";
  price: number;
  originalPrice?: number;
  discount?: number;
  sizes: { size: string; price: number }[];
  images: string[];
  thumbnail?: string;
  fragranceFamily: string;
  occasion: string[];
  longevity: string;
  projection: string;
  season: string[];
  gender: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  description: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isLimited?: boolean;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  available?: boolean;
  stock?: number;
  ingredients: string;
  collections: string[];
  collection?: string;
  tags?: string[];

  // Additional optional fields for detailed fragrance information
  mainAccords?: { name: string; strength: number }[];
  notes?: { top: string[]; heart: string[]; base: string[] };
  dayNight?: { day: number; night: number };
  seasons?: { winter: number; spring: number; summer: number; autumn: number };
  fragranceFamilies?: string[];
  subCategories?: string[];
  mainAccordsList?: string[];
};

export const FALLBACK_PRODUCT_IMAGE = "/images/placeholder.svg";

export function normalizeProductIdentity(value?: string | null): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .replace(/^-+|-+$/g, "");
}

export function normalizeProductRouteValue(value?: string | null): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductSlug(product?: Pick<Product, "slug" | "id" | "name"> | null): string {
  if (!product) return "";
  const rawSlug = product.slug || product.id || product.name || "";
  const slug = normalizeProductRouteValue(rawSlug);
  return slug || "product";
}

export function getCanonicalProductIdentity(
  product?: Pick<Product, "id" | "slug" | "name" | "brand"> | null,
): string {
  if (!product) return "";

  const candidates = [
    product.slug,
    product.id,
    product.brand && product.name ? `${product.brand} ${product.name}` : null,
    product.name,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeProductIdentity(candidate);
    if (normalized) return normalized;
  }

  return "";
}

export function normalizeProductImages(images?: string[] | string | null): string[] {
  if (!images) return [];
  if (typeof images === "string") return images ? [images] : [];
  return images.filter((image): image is string => Boolean(image && image.trim()));
}

export function getProductPrimaryImage(
  product?: Pick<Product, "images" | "thumbnail"> | null,
  fallback = FALLBACK_PRODUCT_IMAGE
): string {
  if (!product) return fallback;

  const candidates = [
    ...normalizeProductImages(product.images),
    product.thumbnail,
  ].filter((image): image is string => Boolean(image && image.trim()));

  return candidates[0] ?? fallback;
}

export function getProductGalleryImages(
  product?: Pick<Product, "images" | "thumbnail"> | null,
  fallback = FALLBACK_PRODUCT_IMAGE
): string[] {
  const normalized = normalizeProductImages(product?.images);
  const gallery = normalized.length > 0 ? normalized : product?.thumbnail ? [product.thumbnail] : [];
  return gallery.length > 0 ? gallery : [fallback];
}

export type Review = {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  image?: string;
};

export type Collection = {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
};

const legacyProducts: Product[] = [
  {
    id: "9",
    name: "Club de Nuit Intense Man",
    brand: "Armaf",
    category: "men",
    price: 2599,
    sizes: [
      { size: "30ml", price: 999 },
      { size: "50ml", price: 1799 },
      { size: "100ml", price: 2599 },
    ],
    images: ["/images/Club-de-Nuit-Intense-Man-Armaf-for-men-perfume-card.jpg"],
    fragranceFamily: "Citrus Aromatic",
    occasion: ["Evening", "Date Night", "Special Occasions"],
    longevity: "8–12 hours",
    projection: "Strong",
    season: ["Autumn", "Winter"],
    gender: "Men",
    topNotes: ["Lemon", "Bergamot", "Pineapple"],
    heartNotes: ["Jasmine", "Rose", "Birch"],
    baseNotes: ["Musk", "Ambroxan", "Vanilla"],
    description:
      "An intense, long-lasting masculine fragrance with a bright citrus opening and a warm, woody-amber base. Very powerful projection and longevity.",
    rating: 4.7,
    reviewCount: 1024,
    isBestSeller: true,
    ingredients: "Alcohol Denat., Parfum (Fragrance), Limonene, Linalool",
    collections: ["Luxury Inspired Collection"],
    mainAccords: [
      { name: "Citrus", strength: 90 },
      { name: "Fruity", strength: 80 },
      { name: "Woody", strength: 70 },
      { name: "Amber", strength: 60 },
      { name: "Leather", strength: 30 },
    ],
    notes: {
      top: ["Lemon", "Bergamot", "Pineapple"],
      heart: ["Jasmine", "Rose", "Birch"],
      base: ["Musk", "Ambroxan", "Vanilla"],
    },
    dayNight: { day: 40, night: 85 },
    seasons: { winter: 85, spring: 50, summer: 30, autumn: 75 },
  },
  {
    id: "10",
    name: "Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    category: "unisex",
    price: 14999,
    sizes: [
      { size: "70ml", price: 8999 },
      { size: "200ml", price: 14999 },
    ],
    images: ["/images/Baccarat-Rouge-540-Maison-Francis-Kurkdjian-for-women-and-men-perfume-card.jpg"],
    fragranceFamily: "Amber Floral",
    occasion: ["Evening", "Special Occasions"],
    longevity: "10–14 hours",
    projection: "Strong",
    season: ["Autumn", "Winter", "Spring"],
    gender: "Unisex",
    topNotes: ["Saffron", "Jasmine"],
    heartNotes: ["Amberwood", "Ambergris Accord"],
    baseNotes: ["Cedar", "Fir Resin"],
    description:
      "A luminous, airy amber floral with exceptional radiance. Known for its sweet-ambered transparency and long staying power.",
    rating: 4.9,
    reviewCount: 2000,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Luxury Inspired Collection"],
    mainAccords: [
      { name: "Amber", strength: 95 },
      { name: "Floral", strength: 70 },
      { name: "Woody", strength: 50 },
      { name: "Sweet", strength: 80 },
    ],
    notes: {
      top: ["Saffron", "Jasmine"],
      heart: ["Amberwood", "Ambergris Accord"],
      base: ["Cedar", "Fir Resin"],
    },
    dayNight: { day: 30, night: 90 },
    seasons: { winter: 85, spring: 70, summer: 40, autumn: 80 },
  },
  {
    id: "11",
    name: "Dior Sauvage",
    brand: "Dior",
    category: "men",
    price: 6999,
    sizes: [
      { size: "50ml", price: 3999 },
      { size: "100ml", price: 6999 },
    ],
    images: ["/images/Sauvage-Dior-for-men-perfume-card.jpg"],
    fragranceFamily: "Aromatic Fougere",
    occasion: ["Daily Wear", "Office", "Evening"],
    longevity: "8–10 hours",
    projection: "Strong",
    season: ["All Seasons"],
    gender: "Men",
    topNotes: ["Calabrian Bergamot", "Pepper"],
    heartNotes: ["Sichuan Pepper", "Lavender"],
    baseNotes: ["Ambroxan", "Cedar"],
    description:
      "A versatile aromatic fougere with a fresh peppery opening and a warm ambroxan base—very modern and wearable.",
    rating: 4.6,
    reviewCount: 1800,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Signature Collection"],
    mainAccords: [
      { name: "Citrus", strength: 75 },
      { name: "Spicy", strength: 65 },
      { name: "Woody", strength: 70 },
      { name: "Amber", strength: 60 },
    ],
    notes: {
      top: ["Bergamot", "Pepper"],
      heart: ["Lavender", "Sichuan Pepper"],
      base: ["Ambroxan", "Cedar"],
    },
    dayNight: { day: 65, night: 70 },
    seasons: { winter: 60, spring: 75, summer: 80, autumn: 70 },
  },
  {
    id: "12",
    name: "Bleu de Chanel (EDP)",
    brand: "Chanel",
    category: "men",
    price: 8499,
    sizes: [
      { size: "50ml", price: 4999 },
      { size: "100ml", price: 8499 },
    ],
    images: ["/images/Bleu-de-Chanel-Eau-de-Parfum-Chanel-for-men-perfume-card.jpg"],
    fragranceFamily: "Woody Aromatic",
    occasion: ["Daily Wear", "Office", "Evening"],
    longevity: "8–12 hours",
    projection: "Moderate to Strong",
    season: ["All Seasons"],
    gender: "Men",
    topNotes: ["Grapefruit", "Lemon"],
    heartNotes: ["Ginger", "Jasmine"],
    baseNotes: ["Sandalwood", "Cedar", "Incense"],
    description:
      "A modern woody-aromatic blend — refined, fresh opening with a smooth drydown suitable across seasons.",
    rating: 4.8,
    reviewCount: 1600,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Signature Collection"],
    mainAccords: [
      { name: "Citrus", strength: 70 },
      { name: "Woody", strength: 75 },
      { name: "Aromatic", strength: 65 },
    ],
    notes: {
      top: ["Grapefruit", "Lemon"],
      heart: ["Ginger", "Jasmine"],
      base: ["Sandalwood", "Cedar", "Incense"],
    },
    dayNight: { day: 75, night: 60 },
    seasons: { winter: 70, spring: 80, summer: 85, autumn: 75 },
  },
  {
    id: "13",
    name: "Acqua di Gio",
    brand: "Giorgio Armani",
    category: "men",
    price: 4499,
    sizes: [
      { size: "50ml", price: 2499 },
      { size: "100ml", price: 4499 },
    ],
    images: ["/images/Acqua-di-Gio-Giorgio-Armani-for-men-perfume-card.jpg"],
    fragranceFamily: "Aromatic Aquatic",
    occasion: ["Daily Wear", "Office", "Casual"],
    longevity: "6–8 hours",
    projection: "Moderate",
    season: ["Spring", "Summer"],
    gender: "Men",
    topNotes: ["Bergamot", "Marine Notes", "Jasmine"],
    heartNotes: ["Nutmeg", "Cedar"],
    baseNotes: ["Patchouli", "Musk"],
    description:
      "A fresh aquatic classic — light, breezy, and ideal for warm weather and daytime.",
    rating: 4.5,
    reviewCount: 1400,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Summer Collection"],
    mainAccords: [
      { name: "Citrus", strength: 70 },
      { name: "Aquatic", strength: 85 },
      { name: "Aromatic", strength: 60 },
    ],
    notes: {
      top: ["Bergamot", "Marine Notes", "Jasmine"],
      heart: ["Nutmeg", "Cedar"],
      base: ["Patchouli", "Musk"],
    },
    dayNight: { day: 90, night: 30 },
    seasons: { winter: 30, spring: 80, summer: 95, autumn: 50 },
  },
  {
    id: "14",
    name: "Viking",
    brand: "Creed",
    category: "men",
    price: 17999,
    sizes: [
      { size: "50ml", price: 9999 },
      { size: "100ml", price: 17999 },
    ],
    images: ["/images/creed viking.png"],
    fragranceFamily: "Aromatic Woody",
    occasion: ["Evening", "Special Occasions"],
    longevity: "8–12 hours",
    projection: "Strong",
    season: ["All Seasons"],
    gender: "Men",
    topNotes: ["Bergamot", "Sicilian Lemon"],
    heartNotes: ["Bulgarian Rose", "Geranium"],
    baseNotes: ["Sandalwood", "Cedar"],
    description:
      "A vibrant aromatic woody fragrance blending crisp citrus with a refined woody base.",
    rating: 4.6,
    reviewCount: 420,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Luxury Inspired Collection"],
    mainAccords: [
      { name: "Citrus", strength: 70 },
      { name: "Woody", strength: 75 },
      { name: "Floral", strength: 50 },
    ],
    notes: {
      top: ["Bergamot", "Lemon"],
      heart: ["Rose", "Geranium"],
      base: ["Sandalwood", "Cedar"],
    },
    dayNight: { day: 70, night: 60 },
    seasons: { winter: 60, spring: 80, summer: 80, autumn: 70 },
  },
  {
    id: "15",
    name: "Silver Mountain Water",
    brand: "Creed",
    category: "unisex",
    price: 16999,
    sizes: [
      { size: "50ml", price: 9499 },
      { size: "100ml", price: 16999 },
    ],
    images: ["/images/Silver-Mountain-Water-Creed-for-women-and-men-perfume-card.jpg"],
    fragranceFamily: "Fresh Aromatic",
    occasion: ["Daily Wear", "Office", "Outdoor"],
    longevity: "6–8 hours",
    projection: "Moderate",
    season: ["Spring", "Summer"],
    gender: "Unisex",
    topNotes: ["Bergamot", "Mandarin"],
    heartNotes: ["Green Tea", "Black Currant"],
    baseNotes: ["Musk", "Sandalwood"],
    description:
      "A crisp, fresh aquatic-leaning composition reminiscent of alpine streams — bright and uplifting.",
    rating: 4.7,
    reviewCount: 310,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Summer Collection"],
    mainAccords: [
      { name: "Fresh", strength: 90 },
      { name: "Citrus", strength: 75 },
      { name: "Aromatic", strength: 60 },
    ],
    notes: {
      top: ["Bergamot", "Mandarin"],
      heart: ["Green Tea", "Black Currant"],
      base: ["Musk", "Sandalwood"],
    },
    dayNight: { day: 85, night: 35 },
    seasons: { winter: 40, spring: 90, summer: 95, autumn: 60 },
  },
  {
    id: "16",
    name: "Patchouli Absolu",
    brand: "Tom Ford",
    category: "unisex",
    price: 13999,
    sizes: [
      { size: "50ml", price: 7999 },
      { size: "100ml", price: 13999 },
    ],
    images: ["/images/Patchouli-Absolu-Tom-Ford-for-women-and-men-perfume-card.jpg"],
    fragranceFamily: "Woody Patchouli",
    occasion: ["Evening", "Special Occasions"],
    longevity: "10–14 hours",
    projection: "Strong",
    season: ["Autumn", "Winter"],
    gender: "Unisex",
    topNotes: ["Patchouli"],
    heartNotes: ["Patchouli Absolute", "Incense"],
    baseNotes: ["Oud", "Vanilla"],
    description:
      "A concentrated patchouli-centric composition with dark, resinous depth and gourmand-like warmth.",
    rating: 4.6,
    reviewCount: 220,
    ingredients: "Parfum (Fragrance), Patchouli Absolute",
    collections: ["Luxury Inspired Collection"],
    mainAccords: [
      { name: "Woody", strength: 85 },
      { name: "Earthy", strength: 80 },
      { name: "Gourmand", strength: 50 },
    ],
    notes: {
      top: ["Patchouli"],
      heart: ["Patchouli Absolute", "Incense"],
      base: ["Oud", "Vanilla"],
    },
    dayNight: { day: 25, night: 85 },
    seasons: { winter: 90, spring: 50, summer: 30, autumn: 85 },
  },
  {
    id: "17",
    name: "Musk Tahara",
    brand: "Swiss Arabian",
    category: "unisex",
    price: 2499,
    sizes: [
      { size: "15ml", price: 799 },
      { size: "30ml", price: 1499 },
      { size: "50ml", price: 2499 },
    ],
    images: ["/images/Musk-Tahara-Swiss-Arabian-for-women-and-men-perfume-card.jpg"],
    fragranceFamily: "Musky Floral",
    occasion: ["Daily Wear", "Evening"],
    longevity: "8–12 hours",
    projection: "Moderate",
    season: ["All Seasons"],
    gender: "Unisex",
    topNotes: ["Citrus", "Green Notes"],
    heartNotes: ["White Musk", "Jasmine"],
    baseNotes: ["Musk", "Amber"],
    description:
      "A clean, soft musk-forward fragrance with a delicate floral heart and warm amber base — comforting and elegant.",
    rating: 4.5,
    reviewCount: 180,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Musk Collection"],
    mainAccords: [
      { name: "Musky", strength: 90 },
      { name: "Floral", strength: 60 },
      { name: "Amber", strength: 50 },
    ],
    notes: {
      top: ["Citrus", "Green Notes"],
      heart: ["White Musk", "Jasmine"],
      base: ["Musk", "Amber"],
    },
    dayNight: { day: 70, night: 50 },
    seasons: { winter: 65, spring: 75, summer: 80, autumn: 70 },
  },
  {
    id: "18",
    name: "Libre",
    brand: "Yves Saint Laurent",
    category: "women",
    price: 6999,
    sizes: [
      { size: "50ml", price: 3999 },
      { size: "90ml", price: 6999 },
    ],
    images: ["/images/Libre-Yves-Saint-Laurent-for-women-perfume-card.jpg"],
    fragranceFamily: "Floral Aromatic",
    occasion: ["Daily Wear", "Evening"],
    longevity: "8–10 hours",
    projection: "Moderate",
    season: ["Spring", "Autumn"],
    gender: "Women",
    topNotes: ["Lavender", "Mandarin"],
    heartNotes: ["Orange Blossom", "Jasmine"],
    baseNotes: ["Vanilla", "Cedar"],
    description:
      "A modern floral with aromatic freshness and a warm vanilla-cedar base — confident and feminine.",
    rating: 4.6,
    reviewCount: 720,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Signature Collection"],
    mainAccords: [
      { name: "Floral", strength: 85 },
      { name: "Aromatic", strength: 60 },
      { name: "Vanilla", strength: 55 },
    ],
    notes: {
      top: ["Lavender", "Mandarin"],
      heart: ["Orange Blossom", "Jasmine"],
      base: ["Vanilla", "Cedar"],
    },
    dayNight: { day: 65, night: 55 },
    seasons: { winter: 50, spring: 85, summer: 70, autumn: 60 },
  },
  {
    id: "19",
    name: "L'Eau d'Issey Pour Homme",
    brand: "Issey Miyake",
    category: "men",
    price: 3499,
    sizes: [
      { size: "50ml", price: 1999 },
      { size: "100ml", price: 3499 },
    ],
    images: ["/images/L-039-Eau-d-039-Issey-Pour-Homme-Issey-Miyake-for-men-perfume-card.jpg"],
    fragranceFamily: "Aquatic Aromatic",
    occasion: ["Daily Wear", "Office", "Casual"],
    longevity: "6–8 hours",
    projection: "Moderate",
    season: ["Spring", "Summer"],
    gender: "Men",
    topNotes: ["Yuzu", "Bergamot"],
    heartNotes: ["Nutmeg", "Coriander"],
    baseNotes: ["Cedar", "Sandalwood"],
    description:
      "A classic aquatic aromatic with crisp citrus and clean woody drydown — ideal for warm days.",
    rating: 4.4,
    reviewCount: 650,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Summer Collection"],
    mainAccords: [
      { name: "Aquatic", strength: 85 },
      { name: "Citrus", strength: 70 },
      { name: "Woody", strength: 50 },
    ],
    notes: {
      top: ["Yuzu", "Bergamot"],
      heart: ["Nutmeg", "Coriander"],
      base: ["Cedar", "Sandalwood"],
    },
    dayNight: { day: 90, night: 25 },
    seasons: { winter: 30, spring: 85, summer: 95, autumn: 60 },
  },
  {
    id: "20",
    name: "Good Girl",
    brand: "Carolina Herrera",
    category: "women",
    price: 5999,
    sizes: [
      { size: "50ml", price: 3499 },
      { size: "80ml", price: 5999 },
    ],
    images: ["/images/Good-Girl-Carolina-Herrera-for-women-perfume-card.jpg"],
    fragranceFamily: "Oriental Floral",
    occasion: ["Evening", "Party", "Date Night"],
    longevity: "8–12 hours",
    projection: "Strong",
    season: ["Autumn", "Winter"],
    gender: "Women",
    topNotes: ["Almond", "Coffee"],
    heartNotes: ["Jasmine Sambac", "Tuberose"],
    baseNotes: ["Tonka Bean", "Cocoa"],
    description:
      "A seductive, gourmand-leaning floral — rich, sensual, and made for evenings and special moments.",
    rating: 4.6,
    reviewCount: 980,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Date Night"],
    mainAccords: [
      { name: "Gourmand", strength: 85 },
      { name: "Floral", strength: 70 },
      { name: "Sweet", strength: 75 },
    ],
    notes: {
      top: ["Almond", "Coffee"],
      heart: ["Jasmine Sambac", "Tuberose"],
      base: ["Tonka Bean", "Cocoa"],
    },
    dayNight: { day: 30, night: 90 },
    seasons: { winter: 90, spring: 60, summer: 40, autumn: 85 },
  },
  {
    id: "21",
    name: "Flora Gorgeous Gardenia",
    brand: "Gucci",
    category: "women",
    price: 5999,
    sizes: [
      { size: "50ml", price: 3499 },
      { size: "100ml", price: 5999 },
    ],
    images: ["/images/Flora-Gorgeous-Gardenia-Gucci-for-women-perfume-card.jpg"],
    fragranceFamily: "Floral",
    occasion: ["Daily Wear", "Brunch", "Spring Events"],
    longevity: "6–8 hours",
    projection: "Moderate",
    season: ["Spring", "Summer"],
    gender: "Women",
    topNotes: ["Red Berries", "Mandarin"],
    heartNotes: ["Gardenia", "Ylang-Ylang"],
    baseNotes: ["Patchouli", "Sandalwood"],
    description:
      "A bright, feminine floral centred on gardenia — youthful, fresh, and perfect for springtime wear.",
    rating: 4.4,
    reviewCount: 420,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Summer Collection"],
    mainAccords: [
      { name: "Floral", strength: 90 },
      { name: "Fruity", strength: 60 },
      { name: "Woody", strength: 40 },
    ],
    notes: {
      top: ["Red Berries", "Mandarin"],
      heart: ["Gardenia", "Ylang-Ylang"],
      base: ["Patchouli", "Sandalwood"],
    },
    dayNight: { day: 85, night: 40 },
    seasons: { winter: 40, spring: 95, summer: 80, autumn: 60 },
  },
  {
    id: "22",
    name: "Fahrenheit",
    brand: "Dior",
    category: "men",
    price: 4999,
    sizes: [
      { size: "50ml", price: 2999 },
      { size: "100ml", price: 4999 },
    ],
    images: ["/images/Fahrenheit-Dior-for-men-perfume-card.jpg"],
    fragranceFamily: "Woody Floral",
    occasion: ["Evening", "Office"],
    longevity: "6–8 hours",
    projection: "Moderate",
    season: ["Autumn", "Spring"],
    gender: "Men",
    topNotes: ["Mandarin", "Hawthorn"],
    heartNotes: ["Nutmeg", "Violet"],
    baseNotes: ["Leather", "Vetiver"],
    description:
      "A unique woody-floral-masculine scent with a leathery backbone — classic and characterful.",
    rating: 4.3,
    reviewCount: 300,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Signature Collection"],
    mainAccords: [
      { name: "Woody", strength: 75 },
      { name: "Leather", strength: 70 },
      { name: "Floral", strength: 40 },
    ],
    notes: {
      top: ["Mandarin", "Hawthorn"],
      heart: ["Nutmeg", "Violet"],
      base: ["Leather", "Vetiver"],
    },
    dayNight: { day: 50, night: 70 },
    seasons: { winter: 65, spring: 70, summer: 40, autumn: 80 },
  },
  {
    id: "23",
    name: "Explorer",
    brand: "Montblanc",
    category: "men",
    price: 2999,
    sizes: [
      { size: "40ml", price: 1799 },
      { size: "100ml", price: 2999 },
    ],
    images: ["/images/Explorer-Montblanc-for-men-perfume-card.jpg"],
    fragranceFamily: "Woody Aromatic",
    occasion: ["Daily Wear", "Office"],
    longevity: "6–8 hours",
    projection: "Moderate",
    season: ["All Seasons"],
    gender: "Men",
    topNotes: ["Bergamot", "Pink Pepper"],
    heartNotes: ["Vetiver", "Leather"],
    baseNotes: ["Patchouli", "Vanilla"],
    description:
      "A woody aromatic scent inspired by travel and discovery — versatile and modern.",
    rating: 4.2,
    reviewCount: 210,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Office Wear"],
    mainAccords: [
      { name: "Woody", strength: 75 },
      { name: "Aromatic", strength: 65 },
      { name: "Gourmand", strength: 45 },
    ],
    notes: {
      top: ["Bergamot", "Pink Pepper"],
      heart: ["Vetiver", "Leather"],
      base: ["Patchouli", "Vanilla"],
    },
    dayNight: { day: 70, night: 50 },
    seasons: { winter: 60, spring: 75, summer: 75, autumn: 70 },
  },
  {
    id: "24",
    name: "Stronger With You Intensely",
    brand: "Emporio Armani",
    category: "men",
    price: 3999,
    sizes: [
      { size: "50ml", price: 2499 },
      { size: "100ml", price: 3999 },
    ],
    images: ["/images/Emporio-Armani-Stronger-With-You-Intensely-Giorgio-Armani-for-men-perfume-card.jpg"],
    fragranceFamily: "Oriental Fougere",
    occasion: ["Evening", "Date Night"],
    longevity: "8–10 hours",
    projection: "Strong",
    season: ["Autumn", "Winter"],
    gender: "Men",
    topNotes: ["Citrus", "Spices"],
    heartNotes: ["Cinnamon", "Lavender"],
    baseNotes: ["Vanilla", "Chestnut"],
    description:
      "A warm, sweet-ambery aromatic with gourmand touches — intimate and long-lasting.",
    rating: 4.4,
    reviewCount: 510,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Date Night"],
    mainAccords: [
      { name: "Gourmand", strength: 75 },
      { name: "Spicy", strength: 60 },
      { name: "Amber", strength: 70 },
    ],
    notes: {
      top: ["Citrus", "Spices"],
      heart: ["Cinnamon", "Lavender"],
      base: ["Vanilla", "Chestnut"],
    },
    dayNight: { day: 40, night: 85 },
    seasons: { winter: 85, spring: 60, summer: 40, autumn: 80 },
  },
  {
    id: "25",
    name: "Cool Water",
    brand: "Davidoff",
    category: "men",
    price: 2499,
    sizes: [
      { size: "50ml", price: 1499 },
      { size: "125ml", price: 2499 },
    ],
    images: ["/images/Cool-Water-Davidoff-for-men-perfume-card.jpg"],
    fragranceFamily: "Aromatic Aquatic",
    occasion: ["Daily Wear", "Summer"],
    longevity: "6–8 hours",
    projection: "Moderate",
    season: ["Summer"],
    gender: "Men",
    topNotes: ["Mint", "Green Notes"],
    heartNotes: ["Lavender", "Geranium"],
    baseNotes: ["Cedar", "Musk"],
    description:
      "A fresh aquatic classic — easy, breezy, and perfect for hot weather.",
    rating: 4.1,
    reviewCount: 980,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Summer Collection"],
    mainAccords: [
      { name: "Aquatic", strength: 85 },
      { name: "Fresh", strength: 80 },
    ],
    notes: {
      top: ["Mint", "Green Notes"],
      heart: ["Lavender", "Geranium"],
      base: ["Cedar", "Musk"],
    },
    dayNight: { day: 90, night: 25 },
    seasons: { winter: 30, spring: 75, summer: 95, autumn: 50 },
  },
  {
    id: "26",
    name: "Coco Mademoiselle",
    brand: "Chanel",
    category: "women",
    price: 6999,
    sizes: [
      { size: "50ml", price: 3999 },
      { size: "100ml", price: 6999 },
    ],
    images: ["/images/Coco-Mademoiselle-Chanel-for-women-perfume-card.jpg"],
    fragranceFamily: "Oriental Floral",
    occasion: ["Evening", "Signature"],
    longevity: "8–12 hours",
    projection: "Strong",
    season: ["Autumn", "Winter", "Spring"],
    gender: "Women",
    topNotes: ["Orange", "Mandarin"],
    heartNotes: ["Jasmine", "Rose"],
    baseNotes: ["Patchouli", "Vanilla"],
    description:
      "A sensual, sophisticated floral-oriental with sweetness and depth — a modern classic.",
    rating: 4.7,
    reviewCount: 1200,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Signature Collection"],
    mainAccords: [
      { name: "Floral", strength: 80 },
      { name: "Amber", strength: 70 },
      { name: "Sweet", strength: 60 },
    ],
    notes: {
      top: ["Orange", "Mandarin"],
      heart: ["Jasmine", "Rose"],
      base: ["Patchouli", "Vanilla"],
    },
    dayNight: { day: 50, night: 80 },
    seasons: { winter: 75, spring: 80, summer: 45, autumn: 80 },
  },
  {
    id: "27",
    name: "Brut",
    brand: "Faberge",
    category: "men",
    price: 999,
    sizes: [
      { size: "100ml", price: 999 },
    ],
    images: ["/images/Brut-Faberge-for-men-perfume-card.jpg"],
    fragranceFamily: "Aromatic Fougere",
    occasion: ["Daily Wear"],
    longevity: "4–6 hours",
    projection: "Moderate",
    season: ["All Seasons"],
    gender: "Men",
    topNotes: ["Lavender", "Bergamot"],
    heartNotes: ["Sage", "Coriander"],
    baseNotes: ["Oakmoss", "Patchouli"],
    description:
      "A classic affordable fougere — fresh, clean, and dependable for everyday wear.",
    rating: 4.0,
    reviewCount: 230,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Office Wear"],
    mainAccords: [
      { name: "Aromatic", strength: 70 },
      { name: "Woody", strength: 50 },
    ],
    notes: {
      top: ["Lavender", "Bergamot"],
      heart: ["Sage", "Coriander"],
      base: ["Oakmoss", "Patchouli"],
    },
    dayNight: { day: 80, night: 40 },
    seasons: { winter: 60, spring: 80, summer: 85, autumn: 70 },
  },
  {
    id: "28",
    name: "Bottled Absolu",
    brand: "Hugo Boss",
    category: "men",
    price: 3499,
    sizes: [
      { size: "50ml", price: 1999 },
      { size: "100ml", price: 3499 },
    ],
    images: ["/images/Bottled-Absolu-Hugo-Boss-for-men-perfume-card.jpg"],
    fragranceFamily: "Amber Woody",
    occasion: ["Evening", "Office"],
    longevity: "8–10 hours",
    projection: "Moderate to Strong",
    season: ["Autumn", "Winter"],
    gender: "Men",
    topNotes: ["Citrus", "Spices"],
    heartNotes: ["Leather", "Wood"],
    baseNotes: ["Vanilla", "Oakmoss"],
    description:
      "A warm amber-woody composition with refined sweetness and good longevity.",
    rating: 4.2,
    reviewCount: 340,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Signature Collection"],
    mainAccords: [
      { name: "Amber", strength: 75 },
      { name: "Woody", strength: 70 },
      { name: "Sweet", strength: 60 },
    ],
    notes: {
      top: ["Citrus", "Spices"],
      heart: ["Leather", "Wood"],
      base: ["Vanilla", "Oakmoss"],
    },
    dayNight: { day: 40, night: 80 },
    seasons: { winter: 80, spring: 60, summer: 40, autumn: 85 },
  },
  {
    id: "29",
    name: "Aqva Pour Homme",
    brand: "Bvlgari",
    category: "men",
    price: 2999,
    sizes: [
      { size: "50ml", price: 1799 },
      { size: "100ml", price: 2999 },
    ],
    images: ["/images/Aqva-Pour-Homme-Bvlgari-for-men-perfume-card.jpg"],
    fragranceFamily: "Aquatic Woody",
    occasion: ["Daily Wear", "Summer"],
    longevity: "6–8 hours",
    projection: "Moderate",
    season: ["Summer"],
    gender: "Men",
    topNotes: ["Mandarin", "Orange"],
    heartNotes: ["Posidonia", "Sage"],
    baseNotes: ["Siberian Pine", "Mineral Woody Notes"],
    description:
      "A marine-inspired woody aquatic — fresh, mineral, and energetic in warm weather.",
    rating: 4.3,
    reviewCount: 290,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Summer Collection"],
    mainAccords: [
      { name: "Aquatic", strength: 85 },
      { name: "Woody", strength: 55 },
    ],
    notes: {
      top: ["Mandarin", "Orange"],
      heart: ["Posidonia", "Sage"],
      base: ["Siberian Pine", "Mineral Woody Notes"],
    },
    dayNight: { day: 90, night: 30 },
    seasons: { winter: 30, spring: 75, summer: 95, autumn: 60 },
  },
  {
    id: "30",
    name: "Amber Oud Dubai Night",
    brand: "Al Haramain",
    category: "men",
    price: 1999,
    sizes: [
      { size: "50ml", price: 1999 },
    ],
    images: ["/images/Amber-Oud-Dubai-Night-Al-Haramain-Perfumes-for-men-perfume-card.jpg"],
    fragranceFamily: "Amber Oud",
    occasion: ["Evening", "Special Occasions"],
    longevity: "10–16 hours",
    projection: "Strong",
    season: ["Winter", "Autumn"],
    gender: "Men",
    topNotes: ["Bergamot", "Spices"],
    heartNotes: ["Amber", "Oud"],
    baseNotes: ["Musk", "Woody Resins"],
    description:
      "A heavy amber-oud oriental — deep, resinous, and designed for night and cold weather.",
    rating: 4.5,
    reviewCount: 140,
    ingredients: "Parfum (Fragrance)",
    collections: ["Arabian Collection"],
    mainAccords: [
      { name: "Amber", strength: 90 },
      { name: "Oud", strength: 85 },
      { name: "Resin", strength: 75 },
    ],
    notes: {
      top: ["Bergamot", "Spices"],
      heart: ["Amber", "Oud"],
      base: ["Musk", "Woody Resins"],
    },
    dayNight: { day: 25, night: 95 },
    seasons: { winter: 95, spring: 60, summer: 25, autumn: 90 },
  },
  {
    id: "31",
    name: "Allure Homme Sport",
    brand: "Chanel",
    category: "men",
    price: 4599,
    sizes: [
      { size: "50ml", price: 2799 },
      { size: "100ml", price: 4599 },
    ],
    images: ["/images/Allure-Homme-Sport-Chanel-for-men-perfume-card.jpg"],
    fragranceFamily: "Aromatic Aquatic",
    occasion: ["Sports", "Casual", "Daytime"],
    longevity: "6–8 hours",
    projection: "Moderate",
    season: ["Spring", "Summer"],
    gender: "Men",
    topNotes: ["Orange", "Sea Notes"],
    heartNotes: ["Aldehydes", "Pepper"],
    baseNotes: ["Tonka Bean", "Cedar"],
    description:
      "A sporty, fresh aromatic with a bright opening and an energetic character for active wearers.",
    rating: 4.2,
    reviewCount: 330,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Sports"],
    mainAccords: [
      { name: "Fresh", strength: 85 },
      { name: "Citrus", strength: 70 },
    ],
    notes: {
      top: ["Orange", "Sea Notes"],
      heart: ["Aldehydes", "Pepper"],
      base: ["Tonka Bean", "Cedar"],
    },
    dayNight: { day: 90, night: 30 },
    seasons: { winter: 40, spring: 85, summer: 95, autumn: 60 },
  },
  {
    id: "32",
    name: "Imagination",
    brand: "Louis Vuitton",
    category: "men",
    price: 12999,
    sizes: [
      { size: "50ml", price: 7999 },
      { size: "100ml", price: 12999 },
    ],
    images: ["/images/Imagination-Louis-Vuitton-for-men-perfume-card.jpg"],
    fragranceFamily: "Woody Spicy",
    occasion: ["Evening", "Formal"],
    longevity: "8–12 hours",
    projection: "Moderate to Strong",
    season: ["Autumn", "Winter"],
    gender: "Men",
    topNotes: ["Bergamot", "Spices"],
    heartNotes: ["Saffron", "Iris"],
    baseNotes: ["Patchouli", "Vanilla"],
    description:
      "A luxurious woody-spicy composition with elegant spices and a rounded drydown.",
    rating: 4.6,
    reviewCount: 150,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Luxury Inspired Collection"],
    mainAccords: [
      { name: "Spicy", strength: 75 },
      { name: "Woody", strength: 80 },
      { name: "Amber", strength: 60 },
    ],
    notes: {
      top: ["Bergamot", "Spices"],
      heart: ["Saffron", "Iris"],
      base: ["Patchouli", "Vanilla"],
    },
    dayNight: { day: 35, night: 80 },
    seasons: { winter: 80, spring: 60, summer: 40, autumn: 85 },
  },
  {
    id: "33",
    name: "9 PM Rebel",
    brand: "Afnan",
    category: "unisex",
    price: 1899,
    sizes: [
      { size: "30ml", price: 699 },
      { size: "50ml", price: 1199 },
      { size: "100ml", price: 1899 },
    ],
    images: ["/images/9-PM-Rebel-Afnan-for-women-and-men-perfume-card.jpg"],
    fragranceFamily: "Oriental Spicy",
    occasion: ["Evening", "Party"],
    longevity: "8–10 hours",
    projection: "Moderate to Strong",
    season: ["Autumn", "Winter"],
    gender: "Unisex",
    topNotes: ["Cardamom", "Citrus"],
    heartNotes: ["Saffron", "Rose"],
    baseNotes: ["Oud", "Amber", "Vanilla"],
    description:
      "A bold, spicy-oriental with warm saffron and resinous oud — ideal for nights and special moments.",
    rating: 4.4,
    reviewCount: 85,
    ingredients: "Parfum (Fragrance), Alcohol Denat.",
    collections: ["Arabian Collection"],
    mainAccords: [
      { name: "Spicy", strength: 85 },
      { name: "Amber", strength: 75 },
      { name: "Oud", strength: 80 },
    ],
    notes: {
      top: ["Cardamom", "Citrus"],
      heart: ["Saffron", "Rose"],
      base: ["Oud", "Amber", "Vanilla"],
    },
    dayNight: { day: 20, night: 90 },
    seasons: { winter: 90, spring: 50, summer: 25, autumn: 85 },
  },
  {
    id: "34",
    name: "Khamrah Qahwa",
    brand: "Lattafa",
    category: "attar",
    price: 1299,
    sizes: [
      { size: "12ml", price: 499 },
      { size: "30ml", price: 899 },
    ],
    images: ["/images/Khamrah-Qahwa-Lattafa-Perfumes-for-women-and-men-perfume-card.jpg"],
    fragranceFamily: "Oriental Coffee",
    occasion: ["Evening", "Casual"],
    longevity: "8–14 hours",
    projection: "Moderate",
    season: ["Autumn", "Winter"],
    gender: "Unisex",
    topNotes: ["Coffee", "Cardamom"],
    heartNotes: ["Rose", "Spices"],
    baseNotes: ["Vanilla", "Oud"],
    description:
      "A warm, coffee-forward oriental attar with spicy cardamom and a comforting vanilla-oud base.",
    rating: 4.3,
    reviewCount: 42,
    ingredients: "Attar oil (concentrated)",
    collections: ["Arabian Collection"],
    mainAccords: [
      { name: "Coffee", strength: 90 },
      { name: "Spicy", strength: 70 },
      { name: "Woody", strength: 60 },
    ],
    notes: {
      top: ["Coffee", "Cardamom"],
      heart: ["Rose", "Spices"],
      base: ["Vanilla", "Oud"],
    },
    dayNight: { day: 30, night: 85 },
    seasons: { winter: 90, spring: 50, summer: 20, autumn: 80 },
  },
  {
    id: "35",
    name: "Purple Oud",
    brand: "Dior",
    category: "unisex",
    price: 15999,
    sizes: [
      { size: "50ml", price: 8999 },
      { size: "100ml", price: 15999 },
    ],
    images: ["/images/Purple-Oud-Dior-for-women-and-men-perfume-card.jpg"],
    fragranceFamily: "Oud Woody",
    occasion: ["Evening", "Formal"],
    longevity: "10–14 hours",
    projection: "Strong",
    season: ["Autumn", "Winter"],
    gender: "Unisex",
    topNotes: ["Saffron", "Bergamot"],
    heartNotes: ["Rose", "Oud"],
    baseNotes: ["Patchouli", "Vanilla"],
    description:
      "A luxurious oud-forward composition with elegant florals and deep woody sweetness — suited to evenings and special events.",
    rating: 4.7,
    reviewCount: 240,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Luxury Inspired Collection", "Oud Collection"],
    mainAccords: [
      { name: "Oud", strength: 90 },
      { name: "Floral", strength: 60 },
      { name: "Woody", strength: 75 },
    ],
    notes: {
      top: ["Saffron", "Bergamot"],
      heart: ["Rose", "Oud"],
      base: ["Patchouli", "Vanilla"],
    },
    dayNight: { day: 20, night: 95 },
    seasons: { winter: 95, spring: 60, summer: 25, autumn: 90 },
  },
  {
    id: "36",
    name: "Rose Amira",
    brand: "Guerlain",
    category: "women",
    price: 12999,
    sizes: [
      { size: "50ml", price: 7999 },
      { size: "100ml", price: 12999 },
    ],
    images: ["/images/Rose-Amira-Guerlain-for-women-and-men-perfume-card.jpg"],
    fragranceFamily: "Rose Floral",
    occasion: ["Daytime", "Spring Events"],
    longevity: "6–8 hours",
    projection: "Moderate",
    season: ["Spring", "Autumn"],
    gender: "Women",
    topNotes: ["Bergamot", "Aldehydes"],
    heartNotes: ["Rose", "Iris"],
    baseNotes: ["Musk", "Sandalwood"],
    description:
      "A refined rosy floral with luminous top notes and a powdery, elegant drydown — perfect for springtime wear.",
    rating: 4.5,
    reviewCount: 160,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Signature Collection"],
    mainAccords: [
      { name: "Floral", strength: 90 },
      { name: "Powdery", strength: 60 },
      { name: "Woody", strength: 40 },
    ],
    notes: {
      top: ["Bergamot", "Aldehydes"],
      heart: ["Rose", "Iris"],
      base: ["Musk", "Sandalwood"],
    },
    dayNight: { day: 80, night: 35 },
    seasons: { winter: 40, spring: 95, summer: 70, autumn: 60 },
  },
  {
    id: "37",
    name: "Terre d'Hermès",
    brand: "Hermès",
    category: "men",
    price: 7999,
    sizes: [
      { size: "50ml", price: 4499 },
      { size: "100ml", price: 7999 },
    ],
    images: ["/images/Terre-d-039-Herm-s-Herm-s-for-men-perfume-card.jpg"],
    fragranceFamily: "Woody Spicy",
    occasion: ["Daily Wear", "Office"],
    longevity: "6–8 hours",
    projection: "Moderate",
    season: ["All Seasons"],
    gender: "Men",
    topNotes: ["Grapefruit", "Orange"],
    heartNotes: ["Pepper", "Pelargonium"],
    baseNotes: ["Vetiver", "Cedar"],
    description:
      "A modern woody-spicy fragrance with mineral and citrus facets — versatile and elegant for everyday use.",
    rating: 4.6,
    reviewCount: 520,
    ingredients: "Alcohol Denat., Parfum (Fragrance)",
    collections: ["Signature Collection"],
    mainAccords: [
      { name: "Citrus", strength: 70 },
      { name: "Woody", strength: 75 },
      { name: "Spicy", strength: 60 },
    ],
    notes: {
      top: ["Grapefruit", "Orange"],
      heart: ["Pepper", "Pelargonium"],
      base: ["Vetiver", "Cedar"],
    },
    dayNight: { day: 80, night: 45 },
    seasons: { winter: 60, spring: 85, summer: 75, autumn: 80 },
  },
  {
    id: "38",
    name: "Khamrah Waha",
    brand: "Lattafa",
    category: "attar",
    price: 1399,
    sizes: [
      { size: "12ml", price: 599 },
      { size: "30ml", price: 1099 },
    ],
    images: ["/images/Khamrah-Waha-Lattafa-Perfumes-for-women-and-men-perfume-card.jpg"],
    fragranceFamily: "Oriental Floral",
    occasion: ["Evening", "Special Occasions"],
    longevity: "8–12 hours",
    projection: "Moderate",
    season: ["Autumn", "Winter"],
    gender: "Unisex",
    topNotes: ["Rose", "Saffron"],
    heartNotes: ["Oud", "Patchouli"],
    baseNotes: ["Musk", "Amber"],
    description:
      "A rich floral oriental attar with warm rose and saffron layered over oud and amber for an elegant, long-lasting finish.",
    rating: 4.5,
    reviewCount: 95,
    ingredients: "Attar oil (concentrated)",
    collections: ["Arabian Collection"],
    mainAccords: [
      { name: "Floral", strength: 80 },
      { name: "Oud", strength: 70 },
      { name: "Amber", strength: 65 },
    ],
    notes: {
      top: ["Rose", "Saffron"],
      heart: ["Oud", "Patchouli"],
      base: ["Musk", "Amber"],
    },
    dayNight: { day: 25, night: 85 },
    seasons: { winter: 90, spring: 60, summer: 30, autumn: 80 },
  },
];

const discoveredProducts: Product[] = generatedProducts as Product[];

// The filesystem/generated catalog is the primary source for product identity,
// pricing, images, and inventory. Some generated records can contain generic
// fragrance-note placeholders, though. For products that also exist in the
// curated legacy catalog, keep the generated record but restore the curated
// fragrance metadata so every known perfume shows its own real note pyramid.
function getLegacyFragranceData(product: Product): Product | undefined {
  const productName = normalizeProductIdentity(product.name);
  const productBrandName = normalizeProductIdentity(
    product.brand && product.name ? `${product.brand} ${product.name}` : product.name
  );

  return legacyProducts.find((legacy) => {
    const legacyName = normalizeProductIdentity(legacy.name);
    const legacyBrandName = normalizeProductIdentity(
      legacy.brand && legacy.name ? `${legacy.brand} ${legacy.name}` : legacy.name
    );

    return (
      productBrandName === legacyBrandName ||
      productName === legacyName
    );
  });
}

function enrichGeneratedProductFragranceData(product: Product): Product {
  const legacy = getLegacyFragranceData(product);
  if (!legacy) return product;

  return {
    ...product,
    fragranceFamily: legacy.fragranceFamily,
    occasion: legacy.occasion,
    longevity: legacy.longevity,
    projection: legacy.projection,
    season: legacy.season,
    gender: legacy.gender,
    topNotes: legacy.topNotes,
    heartNotes: legacy.heartNotes,
    baseNotes: legacy.baseNotes,
    mainAccords: legacy.mainAccords,
    notes: legacy.notes,
    dayNight: legacy.dayNight,
    seasons: legacy.seasons,
  };
}

function mergeProductsByCanonicalIdentity(legacy: Product[], filesystem: Product[]): Product[] {
  const uniqueProducts = new Map<string, Product>();
  const sourceByIdentity = new Map<string, "legacy" | "filesystem">();

  const recordProduct = (source: "legacy" | "filesystem", product: Product) => {
    const canonicalKey = getCanonicalProductIdentity(product);
    if (!canonicalKey) return;

    const existingSource = sourceByIdentity.get(canonicalKey);
    if (!existingSource) {
      sourceByIdentity.set(canonicalKey, source);
      uniqueProducts.set(canonicalKey, product);
      return;
    }

    if (existingSource === source) {
      console.warn(
        `Duplicate product detected:\ncanonical key: ${canonicalKey}\nSources:\n- ${source}\nResolution:\n- ${source} product retained\n- duplicate product ignored`
      );
      return;
    }

    if (source === "filesystem") {
      console.warn(
        `Duplicate product detected:\ncanonical key: ${canonicalKey}\nSources:\n- legacy catalog\n- filesystem catalog\nResolution:\n- filesystem product retained\n- legacy duplicate removed`
      );
      uniqueProducts.set(canonicalKey, product);
      sourceByIdentity.set(canonicalKey, source);
      return;
    }

    console.warn(
      `Duplicate product detected:\ncanonical key: ${canonicalKey}\nSources:\n- legacy catalog\n- filesystem catalog\nResolution:\n- filesystem product retained\n- legacy duplicate removed`
    );
  };

  for (const product of filesystem) {
    recordProduct("filesystem", product);
  }

  for (const product of legacy) {
    recordProduct("legacy", product);
  }

  return Array.from(uniqueProducts.values());
}

export const products: Product[] = discoveredProducts.map((product) =>
  normalizeProductPricing(enrichGeneratedProductFragranceData(product))
);

export const fragranceFamilies = [
  "Fresh & Clean",
  "Citrus",
  "Aquatic",
  "Green & Herbal",
  "Floral",
  "Fruity",
  "Gourmand",
  "Woody",
  "Oud",
  "Amber",
  "Spicy",
  "Musk",
  "Dark & Luxury",
  "Sweet & Seductive",
  "Specialty",
] as const;

export const fragranceSubCategories: Record<string, string[]> = {
  "Fresh & Clean": ["Fresh Citrus", "Fresh Aquatic", "Oceanic", "Marine", "Blue Fresh", "Clean Musk", "Fresh Green", "Fresh Aromatic", "Fresh Woody"],
  Citrus: ["Lemon Citrus", "Bergamot Citrus", "Orange Citrus", "Grapefruit Citrus", "Citrus Aromatic", "Citrus Woody", "Citrus Fresh", "Citrus Musk"],
  Aquatic: ["Ocean Breeze", "Marine Fresh", "Sea Salt", "Water Lily", "Aqua Woody", "Aqua Citrus", "Blue Marine"],
  "Green & Herbal": ["Green Tea", "Fresh Herbs", "Mint", "Basil", "Green Leaves", "Fig Green", "Green Woody", "Herbal Aromatic"],
  Floral: ["Rose", "Jasmine", "Tuberose", "Gardenia", "Lily", "Violet", "Lavender", "Iris", "White Floral", "Floral Musk", "Floral Woody", "Floral Amber"],
  Fruity: ["Apple", "Peach", "Pear", "Strawberry", "Raspberry", "Cherry", "Mango", "Pineapple", "Coconut", "Tropical Fruits", "Fruity Floral", "Fruity Musk"],
  Gourmand: ["Vanilla", "Caramel", "Chocolate", "Coffee", "Praline", "Honey", "Almond", "Pistachio", "Tonka", "Sweet Gourmand", "Vanilla Amber", "Fruity Gourmand"],
  Woody: ["Sandalwood", "Cedarwood", "Vetiver", "Cashmere Wood", "Smoky Wood", "Dry Wood", "Woody Musk", "Woody Amber", "Aromatic Woody"],
  Oud: ["Pure Oud", "Oud Woody", "Oud Amber", "Oud Rose", "Oud Saffron", "Oud Vanilla", "Oud Musk", "Oud Spicy"],
  Amber: ["Warm Amber", "Sweet Amber", "Amber Woody", "Amber Vanilla", "Amber Musk", "Amber Spicy", "Amber Floral"],
  Spicy: ["Black Pepper", "Pink Pepper", "Cardamom", "Cinnamon", "Saffron", "Nutmeg", "Spicy Woody", "Spicy Amber"],
  Musk: ["White Musk", "Clean Musk", "Powdery Musk", "Floral Musk", "Woody Musk", "Amber Musk", "Vanilla Musk"],
  "Dark & Luxury": ["Leather", "Suede", "Tobacco", "Smoky", "Dark Amber", "Dark Woody", "Incense", "Oud Leather", "Tobacco Vanilla"],
  "Sweet & Seductive": ["Sweet Vanilla", "Sweet Fruity", "Sweet Floral", "Sweet Amber", "Sweet Musk", "Vanilla Gourmand", "Caramel Amber", "Fruity Vanilla"],
  Specialty: ["Coffee", "Tea", "Chocolate", "Tobacco", "Incense", "Saffron", "Coconut", "Mineral", "Salty", "Smoky"],
};

export const mainAccordOptions = [
  "Fresh",
  "Citrus",
  "Aquatic",
  "Floral",
  "Fruity",
  "Woody",
  "Spicy",
  "Sweet",
  "Musky",
  "Amber",
  "Powdery",
  "Leather",
  "Smoky",
  "Green",
  "Aromatic",
] as const;

export const noteSearchOptions = [
  "Vanilla",
  "Rose",
  "Jasmine",
  "Oud",
  "Sandalwood",
  "Bergamot",
  "Lavender",
  "Coffee",
  "Saffron",
  "Musk",
];

export const primaryCategoryNavigation = {
  men: ["Fresh & Aquatic", "Blue", "Woody", "Aromatic", "Spicy", "Oud & Amber", "Leather & Tobacco"],
  women: ["Floral", "Fruity", "Sweet & Gourmand", "Vanilla", "Powdery", "Musk", "Amber"],
  unisex: ["Citrus", "Woody", "Musk", "Oud", "Amber", "Aquatic", "Gourmand"],
} as const;

const familyKeywordMap: Record<string, string[]> = {
  "Fresh & Clean": ["fresh", "clean", "marine", "ocean", "aquatic", "blue", "citrus", "mint", "green", "herbal", "aromatic"],
  Citrus: ["citrus", "bergamot", "lemon", "grapefruit", "orange", "mandarin"],
  Aquatic: ["aquatic", "marine", "ocean", "sea", "water", "blue", "fresh"],
  "Green & Herbal": ["green", "herbal", "mint", "tea", "basil", "leaf", "fig", "thyme", "sage"],
  Floral: ["floral", "rose", "jasmine", "tuberose", "gardenia", "lily", "violet", "lavender", "iris", "white floral"],
  Fruity: ["fruity", "apple", "peach", "pear", "strawberry", "raspberry", "cherry", "mango", "pineapple", "coconut", "tropical"],
  Gourmand: ["gourmand", "vanilla", "caramel", "chocolate", "coffee", "praline", "honey", "almond", "pistachio", "tonka", "sweet"],
  Woody: ["woody", "cedar", "sandalwood", "vetiver", "cashmere", "dry wood", "amberwood"],
  Oud: ["oud", "agarwood"],
  Amber: ["amber", "warm", "resin", "benzoin"],
  Spicy: ["spicy", "pepper", "cardamom", "cinnamon", "saffron", "nutmeg"],
  Musk: ["musk", "white musk", "powdery"],
  "Dark & Luxury": ["leather", "suede", "tobacco", "smoky", "dark", "incense"],
  "Sweet & Seductive": ["sweet", "vanilla", "fruity", "floral", "amber", "musk", "caramel"],
  Specialty: ["tea", "coffee", "chocolate", "tobacco", "incense", "mineral", "salty", "smoky"],
};

const accordKeywordMap: Record<string, string[]> = {
  Fresh: ["fresh", "clean", "marine", "ocean", "bergamot", "lemon", "citrus", "water", "mint"],
  Citrus: ["citrus", "bergamot", "lemon", "grapefruit", "orange"],
  Aquatic: ["aquatic", "marine", "sea", "water", "ocean"],
  Floral: ["floral", "rose", "jasmine", "lavender", "orchid", "gardenia", "lily"],
  Fruity: ["fruit", "apple", "peach", "pear", "berry", "mango", "pineapple", "coconut"],
  Woody: ["woody", "cedar", "sandalwood", "vetiver", "amberwood"],
  Spicy: ["spicy", "pepper", "cardamom", "cinnamon", "saffron", "nutmeg"],
  Sweet: ["sweet", "vanilla", "caramel", "honey", "sugar", "candy"],
  Musky: ["musk", "powdery", "white musk"],
  Amber: ["amber", "resin", "warm"],
  Powdery: ["powdery", "iris", "musk", "vanilla"],
  Leather: ["leather", "suede", "tobacco"],
  Smoky: ["smoky", "incense", "tobacco"],
  Green: ["green", "tea", "mint", "herbal", "leaf"],
  Aromatic: ["aromatic", "lavender", "basil", "sage", "herbal"]
};

const unique = <T,>(items: T[]) => [...new Set(items.filter(Boolean))] as T[];

export function getProductGender(product: Product): "men" | "women" | "unisex" {
  const value = (product.gender || product.category || "").toLowerCase();
  if (value.includes("women")) return "women";
  if (value.includes("men")) return "men";
  return "unisex";
}

export function getProductFragranceFamilies(product: Product): string[] {
  const direct = Array.isArray(product.fragranceFamilies) ? product.fragranceFamilies : [];
  const allText = [
    product.fragranceFamily,
    product.name,
    product.brand,
    product.description,
    ...(product.topNotes ?? []),
    ...(product.heartNotes ?? []),
    ...(product.baseNotes ?? []),
    ...(product.notes ? Object.values(product.notes).flat() : []),
  ].join(" ").toLowerCase();

  const matches = fragranceFamilies.filter((family) => {
    const keywords = familyKeywordMap[family] ?? [];
    return keywords.some((keyword) => allText.includes(keyword.toLowerCase()));
  });

  return unique([...direct, ...matches]).slice(0, 3);
}

export function getProductSubCategories(product: Product): string[] {
  const direct = Array.isArray(product.subCategories) ? product.subCategories : [];
  const families = getProductFragranceFamilies(product);
  const notes = unique([
    ...(product.topNotes ?? []),
    ...(product.heartNotes ?? []),
    ...(product.baseNotes ?? []),
    ...(product.notes ? Object.values(product.notes).flat() : []),
  ]);

  const highlighted = families.flatMap((family) => {
    const options = fragranceSubCategories[family] ?? [];
    return options.filter((subCategory) => {
      const label = subCategory.toLowerCase();
      return notes.some((note) => note.toLowerCase().includes(label.replace(/[^a-z]/g, "")) || label.includes(note.toLowerCase().replace(/[^a-z]/g, "")));
    });
  });

  return unique([...direct, ...highlighted]).slice(0, 4);
}

export function getProductMainAccords(product: Product): string[] {
  const direct = Array.isArray(product.mainAccordsList) ? product.mainAccordsList : [];
  const legacy = (product.mainAccords ?? []).map((accord) => accord.name);
  const text = [
    product.fragranceFamily,
    product.name,
    product.description,
    ...(product.topNotes ?? []),
    ...(product.heartNotes ?? []),
    ...(product.baseNotes ?? []),
    ...(product.notes ? Object.values(product.notes).flat() : []),
  ].join(" ").toLowerCase();

  const matches = mainAccordOptions.filter((accord) => {
    const keywords = accordKeywordMap[accord] ?? [];
    return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
  });

  return unique([...direct, ...legacy, ...matches]).slice(0, 5);
}

export function matchesFragranceSearch(product: Product, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [
    product.name,
    product.brand,
    product.gender,
    product.fragranceFamily,
    ...getProductFragranceFamilies(product),
    ...getProductSubCategories(product),
    ...getProductMainAccords(product),
    ...product.topNotes,
    ...product.heartNotes,
    ...product.baseNotes,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalized);
}

export const collections: Collection[] = [
  {
    id: "summer",
    name: "Summer Collection",
    description: "Light, fresh, and vibrant fragrances for the warm season",
    image: "/images/Flora-Gorgeous-Gardenia-Gucci-for-women-perfume-card.jpg",
    productCount: 12,
  },
  {
    id: "winter",
    name: "Winter Collection",
    description: "Warm, spicy, and comforting scents for cold evenings",
    image: "/images/Amber-Oud-Dubai-Night-Al-Haramain-Perfumes-for-men-perfume-card.jpg",
    productCount: 10,
  },
  {
    id: "office",
    name: "Office Wear",
    description: "Professional, subtle, and lasting fragrances for the workplace",
    image: "/images/Bleu-de-Chanel-Eau-de-Parfum-Chanel-for-men-perfume-card.jpg",
    productCount: 8,
  },
  {
    id: "date",
    name: "Date Night",
    description: "Sensual, captivating scents to make an unforgettable impression",
    image: "/images/Good-Girl-Carolina-Herrera-for-women-perfume-card.jpg",
    productCount: 9,
  },
  {
    id: "signature",
    name: "Signature Collection",
    description: "Our iconic bestsellers — the essence of Smells From Heaven",
    image: "/images/Imagination-Louis-Vuitton-for-men-perfume-card.jpg",
    productCount: 15,
  },
  {
    id: "oud",
    name: "Oud Collection",
    description: "Premium oud fragrances crafted with the finest agarwood",
    image: "/images/Amber-Oud-Dubai-Night-Al-Haramain-Perfumes-for-men-perfume-card.jpg",
    productCount: 7,
  },
  {
    id: "musk",
    name: "Musk Collection",
    description: "Clean, sensual musk fragrances for everyday elegance",
    image: "/images/Musk-Tahara-Swiss-Arabian-for-women-and-men-perfume-card.jpg",
    productCount: 6,
  },
  {
    id: "arabian",
    name: "Arabian Collection",
    description: "Exotic oriental blends inspired by the Arabian Peninsula",
    image: "/images/Khamrah-Waha-Lattafa-Perfumes-for-women-and-men-perfume-card.jpg",
    productCount: 11,
  },
  {
    id: "luxury",
    name: "Luxury Inspired Collection",
    description: "Designer-inspired fragrances at accessible prices",
    image: "/images/Baccarat-Rouge-540-Maison-Francis-Kurkdjian-for-women-and-men-perfume-card.jpg",
    productCount: 20,
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "1",
    userName: "Priya Sharma",
    rating: 5,
    comment:
      "Absolutely divine! The oud note is so authentic and rich. I get compliments every time I wear this. Lasts all day easily.",
    date: "2026-06-15",
    verified: true,
  },
  {
    id: "r2",
    productId: "3",
    userName: "Rahul Mehta",
    rating: 5,
    comment:
      "Best men's fragrance I've ever bought. The leather and tobacco notes are so well-balanced. This is my signature scent now.",
    date: "2026-06-20",
    verified: true,
  },
  {
    id: "r3",
    productId: "2",
    userName: "Ananya Patel",
    rating: 4,
    comment:
      "Rose de Paradis is beautiful — very feminine and sophisticated. Perfect for spring. The longevity is impressive for a floral.",
    date: "2026-07-01",
    verified: true,
  },
  {
    id: "r4",
    productId: "8",
    userName: "Mohammad Khan",
    rating: 5,
    comment:
      "The attar is incredible. Applied just a tiny amount and it lasted the entire day. Very authentic oriental scent.",
    date: "2026-06-28",
    verified: true,
  },
];

export const faqs = [
  {
    question: "Are your products 100% original?",
    answer:
      "Absolutely. We source our fragrance oils and Attars from trusted suppliers and carefully prepare our final products. Our EDP and Extrait de Parfum fragrances are professionally diluted, blended, and formulated by us to meet our quality standards. We do not sell counterfeit products.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 7 days of delivery, provided the product is unused, unopened, and in its original packaging. For any return, damage, leakage, missing item, or wrong-product claim, a continuous end-to-end unboxing video of the parcel is mandatory. The video must clearly show the package from the time it is received, including the shipping label, all sides of the parcel, and the complete opening of the package without any cuts, edits, or interruptions. Please contact our support team with your order ID and the complete unboxing video to initiate a return or claim. A valid, continuous unboxing video is mandatory for return, damage, leakage, missing item, or wrong-product claims. Claims without a valid unboxing video may not be eligible for return or refund.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, Credit/Debit Cards, and Net Banking, subject to availability.",
  },
  {
    question: "What is the difference between EDP and Extrait de Parfum?",
    answer:
      "EDP (Eau de Parfum) and Extrait de Parfum both offer a rich and long-lasting fragrance experience. Our EDP and Extrait de Parfum fragrances are formulated with approximately 30–40% fragrance concentration, depending on the fragrance. Extrait de Parfum generally has a higher fragrance concentration than EDP and can provide a deeper, richer, and more intense fragrance experience. Actual longevity and performance may vary depending on the fragrance, skin type, application, and environment.",
  },
  {
    question: "Are your fragrances alcohol-free?",
    answer:
      "Our Attars are alcohol-free and are formulated as oil-based fragrances. Our EDP and Extrait de Parfum sprays contain cosmetic-grade denatured alcohol, which acts as the carrier for the fragrance and helps with application and fragrance diffusion. If you prefer an alcohol-free fragrance, our Attar range is the ideal choice.",
  },
];

export const blogPosts = [
  {
    id: "1",
    title: "How to Choose the Perfect Perfume for Every Occasion",
    excerpt:
      "Finding your signature scent is a personal journey. Here's our comprehensive guide to matching fragrances with different occasions, moods, and seasons.",
    image: "/images/Imagination-Louis-Vuitton-for-men-perfume-card.jpg",
    date: "2026-07-01",
    readTime: "5 min read",
    category: "Fragrance Guide",
  },
  {
    id: "2",
    title: "EDP vs EDT vs Attar: What's the Difference?",
    excerpt:
      "Confused about fragrance concentrations? We break down everything you need to know about Eau de Parfum, Eau de Toilette, and traditional attars.",
    image: "/images/Acqua-di-Gio-Giorgio-Armani-for-men-perfume-card.jpg",
    date: "2026-06-20",
    readTime: "4 min read",
    category: "Education",
  },
  {
    id: "3",
    title: "The Art of Layering Fragrances",
    excerpt:
      "Master the art of fragrance layering to create a unique, multi-dimensional scent profile that is entirely your own.",
    image: "/images/Imagination-Louis-Vuitton-for-men-perfume-card.jpg",
    date: "2026-06-10",
    readTime: "6 min read",
    category: "Tips & Tricks",
  },
  {
    id: "4",
    title: "Best Perfumes for Men in 2026",
    excerpt:
      "From fresh aquatics to deep orientals, we curate the finest men's fragrances that deserve a place in your collection this year.",
    image: "/images/creed viking.png",
    date: "2026-05-28",
    readTime: "7 min read",
    category: "Men's Fragrances",
  },
  {
    id: "5",
    title: "How to Store Your Perfume Properly",
    excerpt:
      "Your perfume is an investment. Learn the simple steps to store fragrances correctly and preserve their quality for years.",
    image: "/images/Silver-Mountain-Water-Creed-for-women-and-men-perfume-card.jpg",
    date: "2026-05-15",
    readTime: "3 min read",
    category: "Care Tips",
  },
];

export const occasions = [
  "Daily Wear",
  "Office",
  "Evening",
  "Date Night",
  "Special Occasions",
  "Sports",
  "Casual",
  "Prayer",
];
