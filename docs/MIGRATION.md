# Moving siwek.cloud to Azure Static Web Apps

Runbook for the cutover from Cloudflare Workers static assets to Azure Static Web Apps (SWA) Free.
Cloudflare stays as the DNS provider and as a warm standby.

## Target state

```
visitor ──DNS (Cloudflare, DNS only)──▶ Azure Static Web Apps Free ── serves dist/
                                         ▲
GitHub Actions (site.yml) ── build ──────┤ production on main, preview per PR
                                         └▶ Cloudflare Worker "pawelsiwekslides" (standby, not on the request path)
```

- **Why DNS only, not proxied:** SWA renews its managed certificate only while the custom domain resolves
  to the app ([docs](https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain)). Users report that
  with Cloudflare proxying in front, the certificate stops renewing and Azure eventually drops the domain
  binding ([Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/2046412/what-is-the-proper-way-to-route-a-static-web-app-t)).
- **Why a separate pay-as-you-go subscription:** a credit-based (MVP benefit) subscription gets disabled when
  the credit runs out or the benefit ends, and takes the site with it. Free SKU costs nothing anyway.
- **Bandwidth:** Free includes 100 GB/month per subscription with no overage. Above that the site is not
  served until the next month. Standard (about $9/app/month) is the escape hatch.

## 0. Before you start

- Azure CLI logged in, GitHub CLI logged in, access to the Cloudflare dashboard for `siwek.cloud`.
- This PR reviewed. Merging it is safe before the cutover: the SWA deploy step is skipped until its secret
  exists, and Cloudflare keeps deploying exactly as today (now from `dist/`, blog included).

## 1. Subscription, Static Web App, budget

```bash
# Use a pay-as-you-go subscription, not the MVP credit one.
az account set --subscription "<pay-as-you-go subscription>"

az group create -n rg-siwek-cloud -l westeurope
az deployment group create -g rg-siwek-cloud -f infra/swa.bicep --query properties.outputs.defaultHostname.value -o tsv
# → note the default hostname, e.g. <random-name>.azurestaticapps.net

az deployment sub create -l westeurope -f infra/budget.bicep \
  -p contactEmails='["<your email>"]'
```

## 2. Deployment token → GitHub secret

```bash
az staticwebapp secrets list -n swa-siwek-cloud -g rg-siwek-cloud --query properties.apiKey -o tsv \
  | gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN -R pawel-siwek/siwek.cloud
```

Then run the workflow on main (Actions → *Build and deploy siwek.cloud* → Run workflow), or merge this PR.

## 3. Check the app on its default hostname

- `https://<default hostname>/`: Legacy Dash starts and plays.
- `/waf/`, `/blog/`, `/blog/rss.xml`, `/build.json`, and a 404 page (`/nope`).
- Headers: `curl -sI https://<default hostname>/ | grep -iE "strict|frame|nosniff|referrer|permissions"`.

## 4. Custom domain (validate before switching traffic)

```bash
az staticwebapp hostname set -n swa-siwek-cloud -g rg-siwek-cloud \
  --hostname siwek.cloud --validation-method dns-txt-token --no-wait
az staticwebapp hostname show -n swa-siwek-cloud -g rg-siwek-cloud --hostname siwek.cloud \
  --query "{status:status, token:validationToken}"
```

In Cloudflare DNS add the TXT record exactly as the portal shows it (for the apex it is `_dnsauth.siwek.cloud`)
with the token as its value. Wait until `status` is `Ready`. Traffic is untouched until step 5.

## 5. Cutover (one DNS change)

In Cloudflare DNS, replace the current apex record with:

| Type | Name | Target | Proxy status |
|---|---|---|---|
| CNAME | `siwek.cloud` (`@`) | `<default hostname>` | **DNS only** (grey cloud) |

Cloudflare flattens a CNAME at the apex automatically. The Worker routes (`siwek.cloud/*`) only apply to
proxied traffic, so with a grey cloud they stop handling requests without being deleted.

Verify: `curl -sI https://siwek.cloud/ | grep -i strict-transport-security` should show `max-age=31536000`
(the Cloudflare version sends no HSTS).

**Rollback:** switch the same record back to **Proxied** (orange cloud). The Worker routes take over again and
serve the standby build of the same commit. Don't leave it proxied for long, or the SWA certificate can't renew.

## 6. Comments (giscus)

1. Repo Settings → General → Features → enable **Discussions**.
2. Create a discussion category **Blog comments**, type *Announcement* (only maintainers and giscus open threads).
3. Install the giscus app for this repo: https://github.com/apps/giscus
4. On https://giscus.app enter `pawel-siwek/siwek.cloud`, pick the category, copy `data-category-id`.
5. Paste it into `GISCUS.categoryId` in `blog/src/config.ts`. Comments render once it's set.

## 7. Monitoring

- **Freshness:** point an uptime/synthetic monitor at `https://siwek.cloud/build.json` and alert when
  `builtAt` is older than 48 hours. That catches a schedule that silently stopped, which no failed run reports.
- **Scheduled publish failures** open a GitHub issue titled *Scheduled publish failed* automatically.
- **Bandwidth:** SWA → Metrics → *Data Out*, monthly sum. Look before it gets near 100 GB.

## 8. After a few quiet weeks

Decide whether the Cloudflare standby is still worth it. If not:

- Delete the Worker `pawelsiwekslides` and its routes in Cloudflare.
- Remove `wrangler.jsonc`, `public/_headers`, `public/_redirects`, `public/.assetsignore`, the
  *Deploy to Cloudflare* step in `.github/workflows/site.yml`, and the `CLOUDFLARE_*` secrets.

## Publishing posts

- New post: `blog/src/content/posts/<slug>.md` with `title`, `description`, `date`, `tags`, `draft`.
- Open a PR: the preview environment shows drafts and future-dated posts (`SHOW_DRAFTS=1`, noindex).
  Previews are public URLs, so nothing confidential goes into the repo.
- Merge with `draft: false` and a future `date`: the daily 05:17 UTC build publishes it on that day.
