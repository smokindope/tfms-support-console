#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const DB_NAME = process.env.D1_DATABASE_NAME || "tfms-support-console-db";
const WRANGLER = process.platform === "win32" ? "npx.cmd" : "npx";

function run(args, opts = {}) {
  console.log(`\n$ npx ${args.join(" ")}`);
  return execFileSync(WRANGLER, args, { stdio: opts.capture ? ["ignore", "pipe", "inherit"] : "inherit", encoding: "utf8" });
}

function runJson(args) {
  const out = run(args, { capture: true });
  try { return JSON.parse(out); } catch { return null; }
}

function getDatabaseId() {
  const list = runJson(["wrangler", "d1", "list", "--json"]);
  const existing = Array.isArray(list) ? list.find(db => db.name === DB_NAME) : null;
  if (existing?.uuid) return existing.uuid;
  if (existing?.database_id) return existing.database_id;

  const created = runJson(["wrangler", "d1", "create", DB_NAME, "--json"]);
  const db = Array.isArray(created) ? created[0] : created;
  const id = db?.uuid || db?.database_id || db?.d1_databases?.[0]?.database_id;
  if (!id) {
    console.error("Could not read the created D1 database ID from Wrangler output.");
    process.exit(1);
  }
  return id;
}

function updateWrangler(databaseId) {
  const path = "wrangler.toml";
  let text = readFileSync(path, "utf8");
  text = text.replace(/database_name\s*=\s*"[^"]*"/, `database_name = "${DB_NAME}"`);
  text = text.replace(/database_id\s*=\s*"[^"]*"/, `database_id = "${databaseId}"`);
  writeFileSync(path, text);
}

const databaseId = getDatabaseId();
console.log(`Using D1 database ${DB_NAME} (${databaseId})`);
updateWrangler(databaseId);

run(["wrangler", "d1", "execute", DB_NAME, "--remote", "--file", "migrations/0001_initial_schema.sql"]);
run(["wrangler", "deploy"]);

console.log("\nCloudflare deploy complete.");
console.log("Admin console: open the Worker URL");
console.log("Customer portal: open /portal on the same Worker URL");
