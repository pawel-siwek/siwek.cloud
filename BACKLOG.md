# Backlog

Recorded, not scheduled. Nothing here is implemented yet unless noted.

## 1. Game content phase (Legacy Dash)

- **Tip toasts on collect**: when a service is collected, show a short toast with one real Well-Architected tip for that service (one tip per entry in `SERVICES`).
- **Error-budget mechanic**: a monolith hit drains the SLO budget instead of killing you outright. Decide how much it drains and whether retries stay.
- **Leaderboard** on Cloudflare KV or D1. It has to stay within the free tier, because the "Monthly bill: €0.00" footer line must stay true.

## 2. HUD glyph polish

Partially done. Check the current state before starting:

- Done: `LAST DEPLOYED` already draws the collected service's glyph next to its name (`lastGlyphRef`).
- Done: `SERVICES` already renders a glyph strip (dimmed → lit on collect).
- Open: the strip always shows all 10 `SERVICES`, not the glyphs of the services in the current level.
- Open: the numeric fraction (`gemLabel`, e.g. `3 / 6`) is only in `title`. Move it to `aria-label` (and optionally `role="img"`) so screen readers get it.

## 3. Post-AI<>BA (after 2026-10-23): HAI goes public

- Publish the HAI repo and add a link plus a short write-up on `/waf/`: demo, slides, what broke on stage.
- Link it from the Now/STATUS panel on the homepage.

## 4. Postmortems

- 2–3 short "what broke and why" entries. Format per entry: **incident**, **root cause**, **lesson**.
- Scaffold the page only once Paweł has written the content. No placeholder page before that.

## 5. Home-keeping page

- One page: a Home Assistant automation schema, one photo, one chart.

## 6. `azurewaf` repo (github.com/pawelsiwek/azurewaf)

- Fill the empty pillar sections, with at least one snippet per pillar.
- Copy the WAF diagram into the repo instead of hot-linking learn.microsoft.com.

## 7. Hygiene

- Submit `https://siwek.cloud/sitemap.xml` in Google Search Console.
- Enable Cloudflare Web Analytics (free, cookieless).

## 8. Now ritual

- Quarterly reminder to update the STATUS date (`NOW_DATE` in `public/index.html`, plus the `NOW` constant in the game script). A stale "Now" is worse than none.
