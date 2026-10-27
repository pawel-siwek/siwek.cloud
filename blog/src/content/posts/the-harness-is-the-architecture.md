---
title: "The harness is the architecture"
description: "Several AI<>BA 2026 talks landed on the same design: the model proposes, deterministic code decides. Here is how it maps to Well-Architected."
date: 2026-11-11
tags: ["agentic", "waf"]
session: "AI<>BA 2026 — Azure Well-Architected Framework: AI Workloads in Practice"
draft: true
---

I went to AI<>BA 2026 in Katowice to talk about the Well-Architected Framework for AI workloads. I came back with a sharper version of that talk, because the other speakers kept delivering pieces of it.

Not in the same words. Different companies, different industries, different names for the boxes. But underneath the slides, several of the talks I saw converged on one architecture:

**The model proposes. Deterministic code decides.**

Some called it guardrails, some boundaries, some a factory. I'll call it the harness. And I've started to think the harness is the architecture. The model is a component inside it.

## Six talks, one pattern

Mikalai Saskavets (Coherent Solutions) framed an agent around four boundaries: Action, Resource, Evidence and Handoff. What it may do, what it may touch, what it has to show, and when it hands the work back to a human. His best example was a failure: an agent that looped for 55 rounds on a wrong patch. The fix wasn't a smarter model. It was a "no-progress" rule: stop after three rounds with the same failure and no new green tests. That's an IF statement, not a breakthrough, and it would have saved 52 rounds.

Antoni Hanke (mBank) gave the most useful sentence of the conference for anyone in a regulated business. Use AI only to read the insured amount from a scanned policy. Then use an IF to compare it. The model does the part only a model can do, reading a messy scan. Code does the part that has to be right every time.

He also showed the numbers that quietly kill AI business cases. They were illustrative, but the shape is real. Catching the last two underinsured policies added 768 false alarms. And with €500 in savings against €700 in run cost, the whole process went negative. Accuracy at the margin is expensive, and someone has to read every false alarm.

Shardul Vaidya (AWS) talked about "Dark Factories" for code. A candidate change goes through mechanical checks first, then a three-seat semantic review panel, then a judge with a quorum, and finally a human merge gate. Rework is bounded at two rounds. The orchestration is deterministic. Only the seats are models.

Adrian Jaworek (Base.com) put the whole idea into one line: "The LLM interprets, hard logic guarantees the data."

Sebastian Fyda went after a subtler failure: plan drift. His plan-reviewer reconstructs the goal blind, from the plan alone, and compares it with the original. If they don't match, the plan has drifted, however good it reads. His line stuck with me: "Coherence is what drift looks like." A plan that drifted doesn't look broken. It looks fluent.

Paweł Smorczewski (Bluesoft) covered identity: an agent gets its own identity in Microsoft Entra Agent ID, with a human sponsor attached. In Entra, a [sponsor](https://learn.microsoft.com/en-us/entra/agent-id/agent-owners-sponsors-managers) is the accountable business owner who makes lifecycle decisions and can disable the agent during an incident. An agent nobody owns is an incident waiting for an owner.

## Why the visible tests always pass

Why does any of this matter more than picking the best model? Because a model can be very good and still be wrong in exactly the places your checks don't look.

The data point I keep coming back to is Epoch AI's [MirrorCode](https://epoch.ai/blog/mirrorcode) benchmark, built together with METR. Claude Opus 4.6 reimplemented gotree, a Go bioinformatics toolkit of about 16,000 lines, and passed all 1,899 visible tests. On the held-out tests it passed 101 of 102. That's a strong result. It's also exactly the shape of result that ships a bug: the one edge case nobody wrote a visible test for.

If your agent can see the tests, the tests become its target. Held-out checks are how you find out whether it learned the task or the test suite.

## Mapping the harness to Well-Architected

Here's where the pattern lands in the WAF pillars. None of it is new. It's what we already do for distributed systems, applied to a component that is nondeterministic by design.

| Pillar | What the harness does |
|---|---|
| Reliability | No-progress rule; bounded rework (max 2 rounds); held-out tests the agent never sees |
| Security | Agent identity with a human sponsor; least privilege per tool; blocking risky tool calls before they run |
| Cost Optimization | Budgets at step, run, task and campaign level; cost of the whole process, false alarms included |
| Operational Excellence | Traces of every step; an evidence ledger; spot-checks of cases the system did not flag |
| Performance Efficiency | Parallel workers; the right model per task instead of the biggest model everywhere |

Two rows deserve a comment.

Cost. A token budget per call is the easy part. The real cost is the whole process: the run, the retries, the review panel, and the humans reading 768 false alarms. Antoni's €500 versus €700 doesn't show up on any token dashboard. It only shows up when you price the process end to end.

Operational Excellence. Spot-checking unflagged cases is the step teams skip. Everyone reviews what the system raised. Few look at what it let through, and that's where the false negatives live. The evidence ledger is what makes the check affordable: if every decision records what it was based on, you can sample and verify instead of redoing the work.

A harness doesn't make the model deterministic. It limits the blast radius.

That distinction matters the moment someone asks whether the system is "safe". The model will still hallucinate now and then, still loop, still misread a scan. The harness decides what happens next. A rule stops the loop. An IF catches the misread amount. A quorum overrules one bad reviewer. A human sponsor can switch the agent off.

It's also why I've stopped asking "which model?" first. Models get replaced every few months. The harness is what you actually operate, monitor and pay for, and it's what survives the next model swap.

So the question I now ask at the start of any agentic design review is simpler: how do you know it's correct? If the answer is "the model is very good", there's no architecture yet. If the answer is a list of checks, budgets and gates, there is.
