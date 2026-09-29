import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * One page, so the sitemap is short — but the in-page anchors are listed too,
 * since they are the only addressable destinations this site has.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...["features", "models", "preview", "pricing", "faq"].map((anchor) => ({
      url: `${SITE.url}/#${anchor}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
