---
title: "I ran a Well-Architected review on my own blog"
description: "Even a free static site has a blast radius. What the five Well-Architected pillars found when I moved siwek.cloud to Azure Static Web Apps."
date: 2026-11-04
tags: ["waf", "resiliency", "azure-mvp"]
draft: true
---

siwek.cloud started as a single static HTML page. Then it grew a game. Legacy Dash is a Boulder Dash tribute about cloud tech debt: you dig through legacy, collect Azure services and try to reach the portal before a monolith lands on your head. Three levels: sandbox, staging, production. Production is the hard one, as it should be.

It all ran on Cloudflare Workers static assets, and the footer said so with some pride: "Monthly bill: €0.00. Cost optimization starts at home."

Now I'm adding a blog: short posts from my sessions, written ahead and scheduled for a set date, with comments underneath. And I'm moving the hosting to Azure Static Web Apps on the Free plan.

A static blog is about the lowest-stakes workload I can think of. So before changing anything, I did what I keep telling conference audiences to do: a Well-Architected review. Five pillars, one evening, no slides. It found more than I expected.

## Cost and reliability turned out to be one finding

Cost looked like a non-question. Cloudflare free tier: €0. Static Web Apps Free: also €0. Done?

Not quite. The [quotas page](https://learn.microsoft.com/en-us/azure/static-web-apps/quotas) gives both Free and Standard 100 GB of included bandwidth per month. Standard can go over at $0.20 per GB. On Free, overage is "unavailable". The [pricing page](https://azure.microsoft.com/en-us/pricing/details/app-service/static/) says the 100 GB is per subscription, not per app, and spells out what "unavailable" means: "If your site exceeds these usage quotas, we will not be able to serve your site."

So there's no surprise bill. There's a surprise outage instead. One post that does well on a Monday could take the site dark for the rest of the month. The [plans page](https://learn.microsoft.com/en-us/azure/static-web-apps/plans) is honest about it: Free has no SLA, Standard does.

That's the moment a cost decision becomes a reliability decision. My first fix was to keep Cloudflare where it already is, as a proxy and cache in front of the origin, so the origin would barely touch its 100 GB.

Then I reviewed the fix. Static Web Apps renews its free certificate only while the [custom domain resolves to the app](https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain). Put a proxy in front and that's no longer true. People in a [Microsoft Q&A thread](https://learn.microsoft.com/en-us/answers/questions/2046412/what-is-the-proper-way-to-route-a-static-web-app-t) describe the result: the certificate can't renew, and after a while Azure removes the domain binding altogether. A cache that quietly unbinds my domain in six months is not a reliability fix. It's a delayed outage.

So Cloudflare stays, but as DNS only. The old Cloudflare deployment keeps getting built by the same pipeline as a warm standby, so failing back is a DNS change, not a project. And if the bandwidth numbers ever get close to the cap, Standard is the next step.

The second reliability finding was the one I didn't see coming. Scheduled posts on a static site work like this: the build skips anything dated in the future, and a scheduled GitHub Actions workflow rebuilds the site daily, so Tuesday's post appears on Tuesday.

Except GitHub's docs contain this warning: "[In a public repository, scheduled workflows are automatically disabled when no repository activity has occurred in 60 days.](https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/disabling-and-enabling-a-workflow)"

The whole point of scheduling is to write six posts in one sitting and then not touch the repo for two months. That's exactly the inactivity that switches the scheduler off. The feature fails precisely when it's doing its job. Nothing turns red. Posts just stop appearing.

The fix is boring: a keepalive step that re-enables the workflow on every scheduled run, plus an issue opened automatically when a scheduled publish fails. And because a run that never starts produces no failure, every build also stamps its time into the site at `/build.json`. An external monitor can then alert when the newest deploy is more than two days old. That watches for the absence of a deploy, not only for red builds.

## Security: public in more places than I thought

The repository is public. Fine for a blog, until you remember that a post scheduled for next Tuesday is already in git today. Anyone reading the repo reads the post early. For most of what I write, I can live with that. Anything time-sensitive stays out of the public repo until publish day.

Same story for previews. Static Web Apps creates a preview environment per pull request, which is perfect for reviewing a draft. But the [docs](https://learn.microsoft.com/en-us/azure/static-web-apps/review-publish-pull-requests) are clear: "Anyone can access the staged versions of your application via their URL, even if your GitHub repo is private." Obscure is not private.

Then the build. The old site had no build step: HTML in, HTML out. A Markdown blog means npm, and npm means a supply chain that runs on every deploy. So: a committed lockfile, GitHub Actions pinned to commit SHAs instead of tags, and Dependabot. That's the minimum for anything that executes third-party code next to deploy credentials.

And a small one: the site already sends sensible security headers, but no HSTS. That gets added.

## Operations and performance: boring on purpose

Operational Excellence is mostly about not relying on memory. Content, config and workflows live in git. The Static Web Apps resource goes into Bicep, so I can recreate it without clicking through the portal. Pull requests get preview environments; the Free plan gives me three, plenty for one author.

The finding that made me laugh at myself was about the subscription. My personal Azure subscription comes with the MVP award. It's the obvious place for the site, and the wrong one. MVP benefits last as long as the award does, and the award has to be renewed. Credit-based subscriptions also have a [spending limit](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/spending-limit): when the credit runs out, "the services that you deployed are disabled for the rest of that billing period." A site that vanishes because a benefit expired is a resiliency failure with my name on it.

So the blog lives on the pay-as-you-go subscription I pay for myself, separate from the MVP benefits, with a €1 budget alert. On a Free-plan site that alert should never fire. If it does, I want to know on day one.

Performance was the shortest discussion. It's static HTML, and Static Web Apps distributes static files globally on the Free plan too. The only JavaScript on a post page will be the comments widget, loaded lazily when you scroll to it. Legacy Dash remains the heaviest thing on the site, and I'm keeping it that way.

## The scorecard

| Pillar | Finding | What I'm doing |
|---|---|---|
| Cost | €0 either way; Free has a hard 100 GB/month cap per subscription | Stay on Free, watch bandwidth |
| Reliability | Over the cap the site stops being served; a proxy in front breaks certificate renewal; scheduled workflows die after 60 days without repo activity | DNS-only Cloudflare, warm standby on the old host; keepalive, failure issue, freshness check |
| Security | Future-dated posts and previews are public; npm supply chain; no HSTS | Sensitive drafts stay private; lockfile, pinned actions, Dependabot; HSTS |
| Operational Excellence | Hosting on the MVP subscription ties the site to the award | Bicep, PR previews, my own pay-as-you-go sub, €1 budget alert |
| Performance | Static files, globally distributed | JavaScript only for comments, loaded lazily |

None of these findings is dramatic. That's the point. Each is a small, quiet way for a "free static site" to go dark or leak something, and each is cheap to fix once it's written down.

Even a free static site has a blast radius. Review it like production. The footer can keep saying €0.00, and now it should still be true next month.
