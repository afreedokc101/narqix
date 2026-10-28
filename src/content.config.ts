import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lessons' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    section: z.string(),
    page: z.string(),
    order: z.number(),
    summary: z.string().default(''),
    duration: z.string().optional(),
    scriptTrack: z.string().optional(),
    scriptId: z.string().optional(),
    role: z.string().optional(),
    stage: z.string().optional(),
  }),
});

export const collections = { lessons };
