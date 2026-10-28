#!/usr/bin/env node
/**
 * Prüft alle alten Wix-URLs gegen einen laufenden Server (Standard: wrangler dev auf Port 8787).
 * Aufruf: npm run build && npx wrangler dev &  dann  node scripts/check-urls.mjs [basis-url]
 * Erwartet: jede URL liefert 200 oder 301 auf ein Ziel, das 200 liefert.
 */
import { readFileSync } from 'node:fs';
const base = process.argv[2] ?? 'http://localhost:8787';
const { urls } = JSON.parse(readFileSync(new URL('./legacy-urls.json', import.meta.url), 'utf8'));
let fehler = 0;
for (const path of urls) {
  const url = base + encodeURI(path);
  const r = await fetch(url, { redirect: 'manual' });
  let info = `${r.status}`;
  if (r.status === 301 || r.status === 302 || r.status === 307 || r.status === 308) {
    const ziel = new URL(r.headers.get('location'), url);
    const r2 = await fetch(ziel, { redirect: 'manual' });
    info += ` → ${decodeURI(ziel.pathname)} (${r2.status})`;
    if (r2.status !== 200) fehler++;
  } else if (r.status !== 200) fehler++;
  console.log(`${info.padEnd(48)} ${path}`);
}
console.log(fehler ? `\n❌ ${fehler} URL(s) fehlerhaft` : `\n✅ Alle ${urls.length} alten URLs erreichbar`);
process.exit(fehler ? 1 : 0);
