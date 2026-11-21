import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const TAGS = ['azure-mvp', 'resiliency', 'waf', 'agentic'] as const;

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    // Publish date. Posts dated in the future stay hidden until a build runs on or after this day.
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.enum(TAGS)).default([]),
    // The talk this post comes from, if any.
    session: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
