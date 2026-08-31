export type SiteImageDefinition = {
  id: string;
  src: string;
  alt: string;
  section: string;
  enabled?: boolean;
  priority?: boolean;
};

export const brandVisuals: SiteImageDefinition[] = [
  {
    id: "homeHero",
    src: "/images/A.png",
    alt: "Smells From Heaven luxury hero portrait",
    section: "home-hero",
    enabled: true,
    priority: true,
  },
  {
    id: "homeMood",
    src: "/images/anime art.png",
    alt: "Smells From Heaven Gen-Z lifestyle brand visual",
    section: "home-mood",
    enabled: true,
  },
  {
    id: "fragranceFinder",
    src: "/images/B.png",
    alt: "Smells From Heaven fragrance finder character visual",
    section: "fragrance-finder",
    enabled: true,
  },
  {
    id: "aboutStory",
    src: "/images/D.png",
    alt: "Smells From Heaven founder story visual",
    section: "about-story",
    enabled: true,
  },
  {
    id: "founder",
    src: "/images/rujo.png",
    alt: "Rushikesh Joshi founder portrait",
    section: "founder",
    enabled: true,
  },
  {
    id: "mensCampaign",
    src: "/images/light.png",
    alt: "Smells From Heaven men's fragrance campaign visual",
    section: "mens-campaign",
    enabled: true,
  },
  {
    id: "seasonalCampaign",
    src: "/images/F.png",
    alt: "Smells From Heaven seasonal sports campaign visual",
    section: "seasonal-campaign",
    enabled: true,
  },
  {
    id: "fallback",
    src: "/logo.png",
    alt: "Smells From Heaven logo",
    section: "fallback",
    enabled: true,
  },
];

const siteImageMap = new Map(brandVisuals.map((image) => [image.id, image]));

export function getSiteImage(id: string, fallbackId = "fallback"): SiteImageDefinition | null {
  const requested = siteImageMap.get(id) ?? siteImageMap.get(fallbackId);

  if (!requested || !requested.enabled) {
    return siteImageMap.get("fallback") ?? null;
  }

  return requested;
}

export function getSiteImageSrc(id: string, fallbackId = "fallback"): string {
  return getSiteImage(id, fallbackId)?.src ?? "/logo.png";
}

export function getSiteImageAlt(id: string, fallbackId = "fallback"): string {
  return getSiteImage(id, fallbackId)?.alt ?? "Smells From Heaven brand visual";
}
