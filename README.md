# TFMS Support Console — Cloudflare Workers + D1

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/MCFCMARK/support)

Replace `YOUR_GITHUB_USERNAME/YOUR_REPO` with the GitHub repo where you upload this folder.

This package contains only the files needed for Cloudflare deployment:

- Cloudflare Worker app: `worker/index.js`
- Cloudflare D1 schema migration: `migrations/0001_initial_schema.sql`
- Worker/D1 config: `wrangler.toml`
- One-command deploy script: `scripts/cloudflare-deploy.mjs`

## What the deploy script creates

- Worker: `tfms-support-console`
- D1 database: `tfms-support-console-db`
- D1 binding: `DB`
- Required tables:
  - `conversations`
  - `messages`
  - `email_threads`
  - `email_messages`

## Deploy from your computer

```bash
npm install
npx wrangler login
npm run deploy
```

The deploy script creates the D1 database if missing, writes the D1 database ID into `wrangler.toml`, applies the schema migration, then deploys the Worker.

## Routes

- `/` — staff support admin
- `/portal` — customer support portal
- `/api/*` — D1-backed support API

## Optional secrets

Protect the staff admin API after deployment:

```bash
npx wrangler secret put SUPPORT_ADMIN_KEY
```

