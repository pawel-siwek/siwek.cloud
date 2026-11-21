import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

// PR preview builds set SHOW_DRAFTS=1 so drafts and future-dated posts can be reviewed.
const showAll = process.env.SHOW_DRAFTS === '1';

export function isPublished(post: Post, now = new Date()): boolean {
  if (showAll) return true;
  return !post.data.draft && post.data.date.getTime() <= now.getTime();
}

export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts');
  return all
    .filter((p) => isPublished(p))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function readingMinutes(body: string | undefined): number {
  const words = (body ?? '').replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
