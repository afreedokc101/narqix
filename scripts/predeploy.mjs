#!/usr/bin/env node
// Refuse to deploy without the server-only exam data (it is not in git; see README).
import fs from 'node:fs';
const dir = new URL('../exam-data/', import.meta.url);
const ok = fs.existsSync(new URL('index.js', dir)) && fs.readdirSync(dir).filter((f) => f.endsWith('.json')).length === 9;
if (!ok) {
  console.error('exam-data/ is missing. Unzip the Notion export into academy-export/ and run `npm run import` first.');
  process.exit(1);
}
const wr = fs.readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8');
if (wr.includes('00000000-0000-0000-0000-000000000000')) {
  console.error('Set database_id in wrangler.toml to your D1 database id first (see README step 2).');
  process.exit(1);
}
