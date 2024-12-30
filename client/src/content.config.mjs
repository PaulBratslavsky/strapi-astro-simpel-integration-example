import { defineCollection, z } from "astro:content";
import qs from "qs";

const strapiPostsLoader = defineCollection({
  loader: async () => {
    const BASE_URL = import.meta.env.STRAPI_URL || "http://localhost:1337";
    const path = "/api/articles";
    const url = new URL(path, BASE_URL);

    url.search = qs.stringify({
      populate: {
        cover: {
          fields: ["url", "alternativeText"],
        },
      },
    });

    const articlesData = await fetch(url.href);
    const { data }= await articlesData.json();

    return data.map((item) => ({
      id: item.id.toString(),
      title: item.title,
      description: item.description,
      slug: item.slug,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      publishedAt: item.publishedAt,
      cover: {
        id: Number(item.cover.id),
        documentId: item.cover.documentId,
        url: item.cover.url,
        alternativeText: item.cover.alternativeText,
      }
    }));
  },
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string(),
    cover: z.object({
      id: z.number(),
      documentId: z.string(),
      url: z.string(),
      alternativeText: z.string(),
    }),
  }),
});

export const collections = {
  strapiPostsLoader,
};

