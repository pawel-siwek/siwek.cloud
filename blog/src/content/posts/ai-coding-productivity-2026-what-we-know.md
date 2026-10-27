---
title: "19% slower? What we actually know about AI coding productivity in 2026"
description: "The METR '19% slower' study is now outdated. What the 2026 data says, and why perceived and measured speed keep disagreeing."
date: 2026-11-18
tags: ["agentic"]
draft: true
---

Every few weeks someone sends me the same headline: experienced developers are 19% slower with AI. Sometimes as a gotcha, sometimes as comfort. It's a real number from a good study. It's also from early 2025, and the people who produced it no longer treat it as a description of today.

So here's what the evidence says as of late 2026, with the caveats left in. Caveats are the part that usually gets cut.

## Where "19% slower" came from

In July 2025, METR published a [randomized controlled trial](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/). Sixteen experienced open-source developers worked on 246 real issues in repositories they had contributed to for years. Each task was randomly assigned: AI allowed or AI not allowed. The tools were early-2025 state of the art, mostly Cursor with Claude 3.5 and 3.7 Sonnet.

With AI, tasks took 19% longer.

The more interesting number is the other one. Before the study, the developers expected a 24% speedup. After it, they believed AI had made them about 20% faster. They were slower, and they felt faster. Hold on to that gap between feeling and measurement. It will matter more than the 19%.

METR was careful about what this did not show: not that AI slows down most developers, not that it would stay this way, not that it applies to less experienced people or unfamiliar codebases. Those caveats rarely made it into the headline. The study page now carries a notice that METR no longer considers the results to reflect the current impact of AI.

## What changed in 2026

In February 2026, METR published an [update](https://metr.org/blog/2026-02-24-uplift-update/). 57 developers (10 returning, 47 new), 143 repositories, more than 800 tasks, and a world in which agentic tools like Claude Code and Codex had become common.

Returning developers came out about 18% faster. New developers about 4% faster. Neither result is statistically significant: the confidence intervals run from 38% faster to 9% slower, and from 15% faster to 9% slower.

The bigger story is selection. Between 30% and 50% of developers told METR they were choosing not to submit some tasks because they didn't want to do them without AI. More developers also declined to take part at all, because they didn't want to do half their work without it. METR's own reading: the estimate is likely a lower bound, and the data is "only very weak evidence" for the size of the effect.

Sit with that for a second. The experiment struggled because participants avoided the control condition. That's a finding too, just not one that fits in a percentage.

Other 2026 data points, briefly:

| Study | Design | Result | Caveat |
|---|---|---|---|
| [Microsoft rollout of Claude Code and Copilot CLI](https://arxiv.org/html/2607.01418v1) | Observational, tens of thousands of engineers, Jan–Apr 2026 | +24% merged PRs per engineer per day | Measures volume, not quality; authors work at the vendor |
| [Anthropic](https://www.anthropic.com/research/AI-assistance-coding-skills), Jan 2026 | RCT, 52 mostly junior engineers learning a new Python library | No significant speed gain (about 2 minutes) | Quiz scores 17 points lower (50% vs 67%) |
| [DORA 2025](https://www.infoq.com/news/2025/09/dora-state-of-ai-in-dev-2025) | Survey, about 5,000 professionals | Nearly 90% use AI; throughput up | Delivery instability still rising |

Each of these is honest about its limits, which is more than can be said for most of the posts quoting them.

The Microsoft paper says plainly that a merged PR is not the same as delivered value, and that quality is the open question. Its authors also disclose that they work for the company selling the tools. The Anthropic study is the one I'd show anyone leading a team of juniors: the AI group finished about as fast and understood less, with the biggest gap on debugging questions. That's a learning cost, and it doesn't appear on any sprint board. DORA frames AI as an amplifier: it magnifies the strengths of good delivery organisations and the dysfunctions of struggling ones.

## So is "19% slower" still a fair headline?

No. It described one group, one set of tools and one moment, and its own authors have moved on. Quoting it in late 2026 as a fact about AI coding is like quoting a benchmark for a model nobody runs anymore.

But the durable lesson from that study holds up much better than the number: perceived speed and measured speed diverge. In 2025, developers felt 20% faster while being 19% slower. In 2026, a good share of developers won't work without the tools, which tells you about preference, not throughput. A 24% rise in merged PRs tells you about volume, not value. Over 80% of DORA respondents believe AI has made them more productive, while instability keeps going up.

Every one of these is a signal. None of them is the thing a business actually pays for.

So if you're making decisions for a team, measure what you'd measure anyway. Lead time for changes users care about. Change failure rate. Incidents and rework. Whether people can still debug the code they shipped six months ago. Not how fast it felt, and not how many PRs got merged.

One closing note from the conference circuit. A speaker this autumn summed up his own experience in a single line: "AI made me 0.81x faster… but in five places at once."

The 0.81 is a nod to the METR number. The second half is the more accurate description of agentic coding I've heard this year. The tools don't make one task dramatically faster. They let you run several in parallel. The bottleneck moves from typing to attention: reviewing, deciding, noticing what drifted. Attention doesn't scale with your token budget.

Stop asking whether AI makes developers faster. Ask what you're measuring, and whether it's the thing you actually care about.
