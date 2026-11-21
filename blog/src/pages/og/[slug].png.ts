import type { APIContext } from 'astro';
import { TAG_LABELS } from '../../config';
import { getPosts, readingMinutes, type Post } from '../../lib/posts';
import { renderOg } from '../../lib/og';

export async function getStaticPaths() {
  const posts = await getPosts();
  return [
    ...posts.map((post) => ({ params: { slug: post.id }, props: { post } })),
    { params: { slug: 'default' }, props: { post: undefined } },
  ];
}

export async function GET({ props }: APIContext<{ post?: Post }>) {
  const post = props.post;
  const png = post
    ? await renderOg(
        post.data.title,
        post.data.tags.map((t) => TAG_LABELS[t] ?? t).join(' · ') || 'Blog',
        `${readingMinutes(post.body)} min read · Paweł Siwek · Azure MVP`,
      )
    : await renderOg('Five-minute reads from the talks', 'Well-Architected · Resiliency · Agentic', 'Paweł Siwek · Azure MVP');
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
}
