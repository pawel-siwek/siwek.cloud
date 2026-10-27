export const SITE = {
  title: 'siwek.cloud blog',
  description:
    'Five-minute reads on Azure Well-Architected, resiliency and agentic systems — from the talks of Paweł Siwek, Microsoft Azure MVP.',
  author: 'Paweł Siwek',
  url: 'https://siwek.cloud',
};

export const TAG_LABELS: Record<string, string> = {
  'azure-mvp': 'Azure MVP',
  resiliency: 'Resiliency',
  waf: 'Well-Architected',
  agentic: 'Agentic',
};

// Comments via giscus (GitHub Discussions). Comments stay hidden until categoryId is set.
// Get categoryId from https://giscus.app after enabling Discussions on the repo.
export const GISCUS = {
  repo: 'pawel-siwek/siwek.cloud',
  repoId: 'R_kgDOUcY2EQ',
  category: 'Blog comments',
  categoryId: '',
};
