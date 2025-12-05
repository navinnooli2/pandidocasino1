import { getCollection } from "astro:content";

export async function GET(context) {
  const site = context.site || "https://pandido-casino1.fr";
  const posts = await getCollection("blog");
  
  // Pages statiques principales
  const staticPages = [
    "",
    "/about",
    "/bonus",
    "/live-casino",
    "/paiements",
    "/slots",
    "/sports",
    "/blog",
    "/en",
  ];
  
  // Articles de blog
  const blogPages = posts.map((post) => `/blog/${post.id}/`);
  
  // Toutes les URLs
  const allUrls = [...staticPages, ...blogPages];
  
  // Générer le XML du sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${site}${url}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === "" ? "1.0" : url.startsWith("/blog/") ? "0.8" : "0.9"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

