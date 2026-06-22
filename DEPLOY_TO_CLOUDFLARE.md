# One-click Cloudflare deployment

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO)

Replace `YOUR_GITHUB_USERNAME/YOUR_REPO` with your GitHub repo URL path before using the button.

## Included Cloudflare files

```text
package.json
wrangler.toml
worker/index.js
migrations/0001_initial_schema.sql
scripts/cloudflare-deploy.mjs
README.md
DEPLOY_TO_CLOUDFLARE.md
```

## Manual deploy

```bash
npm install
npx wrangler login
npm run deploy
```

`npm run deploy` creates or reuses the D1 database, applies the schema, and deploys the Worker.

## Admin key

Only the `SUPPORT_ADMIN_KEY` secret is used for deployment-time access control. No webhook URL, webhook token, or other deploy keys are included.
