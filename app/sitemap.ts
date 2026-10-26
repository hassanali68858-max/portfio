import type { MetadataRoute } from "next";
import { projects, site } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, priority: 1 },
    ...projects.map((p) => ({ url: `${site.url}/work/${p.slug}`, lastModified: now, priority: 0.8 })),
  ];
}
