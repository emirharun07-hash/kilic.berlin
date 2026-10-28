#!/usr/bin/env node
/**
 * Qualitätsprüfung nach dem Build (Teil von `npm test`).
 *
 * Prüft im Ordner dist/:
 *  1. Jede alte Wix-URL (scripts/legacy-urls.json) liefert eine Seite ODER hat eine Weiterleitung in _redirects.
 *  2. Jede HTML-Seite hat <title>, Meta-Description, Canonical auf www.orthomitte.de und genau eine <h1>.
 *  3. Alle <img> besitzen ein alt-Attribut.
 *  4. Alle internen Links zeigen auf existierende Seiten/Dateien oder Weiterleitungen.
 *  5. Keine doppelten Seitentitel / Meta-Descriptions.
 *
 * Bei Fehlern endet das Skript mit Exit-Code 1 (CI schlägt fehl).
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const SITE = 'https://www.orthomitte.de';
const errors = [];
const warnings = [];

if (!existsSync(DIST)) {
  console.error('dist/ fehlt – zuerst `npm run build` ausführen.');
  process.exit(1);
}

// ---------- Hilfsfunktionen ----------
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));

/** URL-Pfad -> existiert als Seite oder Datei? */
const pageExists = (path) => {
  const clean = decodeURIComponent(path.split('#')[0].split('?')[0]).replace(/\/$/, '');
  if (clean === '' || clean === '/') return existsSync(join(DIST, 'index.html'));
  return (
    existsSync(join(DIST, clean + '.html')) ||
    existsSync(join(DIST, clean, 'index.html')) ||
    (existsSync(join(DIST, clean)) && statSync(join(DIST, clean)).isFile())
  );
};

// _redirects einlesen
const redirectsFile = join(DIST, '_redirects');
const redirects = new Map();
if (existsSync(redirectsFile)) {
  for (const line of readFileSync(redirectsFile, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const [from, to, code] = t.split(/\s+/);
    if (redirects.has(from)) errors.push(`_redirects: Quelle doppelt: ${from}`);
    redirects.set(from, { to, code });
    if (from.includes('*') || from.includes(':')) continue;
    if (to.startsWith('/') && !pageExists(to)) errors.push(`_redirects: Ziel existiert nicht: ${from} -> ${to}`);
    if (pageExists(from)) warnings.push(`_redirects: Quelle ${from} existiert auch als Seite (Weiterleitung hat Vorrang nicht immer)`);
  }
}
const hasRedirect = (path) => {
  const decoded = decodeURIComponent(path);
  return redirects.has(path) || redirects.has(decoded) || redirects.has(encodeURI(decoded));
};

// ---------- 1. Alte URLs ----------
const legacy = JSON.parse(readFileSync(new URL('./legacy-urls.json', import.meta.url), 'utf8'));
let legacyOk = 0;
for (const path of legacy.urls) {
  if (pageExists(path) || hasRedirect(path)) legacyOk++;
  else errors.push(`Alte URL nicht abgedeckt: ${path}`);
}

// ---------- 2.–5. HTML-Prüfungen ----------
const titles = new Map();
const descriptions = new Map();
const linkTargets = new Set();

for (const file of htmlFiles) {
  const rel = '/' + relative(DIST, file);
  const html = readFileSync(file, 'utf8');
  const isNoindex = /<meta name="robots" content="noindex/.test(html);
  const is404 = rel === '/404.html';

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;

  if (!title) errors.push(`${rel}: <title> fehlt`);
  if (!desc) errors.push(`${rel}: Meta-Description fehlt`);
  else if (desc.length > 170) warnings.push(`${rel}: Meta-Description sehr lang (${desc.length} Zeichen)`);
  if (!is404 && (!canonical || !canonical.startsWith(SITE))) errors.push(`${rel}: Canonical fehlt oder falsche Domain (${canonical})`);
  if (h1Count !== 1) errors.push(`${rel}: ${h1Count} <h1>-Überschriften (erwartet: 1)`);

  if (!is404 && !isNoindex) {
    if (title) titles.set(title, [...(titles.get(title) || []), rel]);
    if (desc) descriptions.set(desc, [...(descriptions.get(desc) || []), rel]);
  }

  for (const img of html.match(/<img\b[^>]*>/g) || []) {
    if (!/\balt=/.test(img)) errors.push(`${rel}: Bild ohne alt-Attribut: ${img.slice(0, 120)}`);
  }

  for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|tel:|#)/.test(href)) {
      if (href.startsWith(SITE)) linkTargets.add(`${rel}|${href.slice(SITE.length) || '/'}`);
      continue;
    }
    linkTargets.add(`${rel}|${href}`);
  }
}

for (const entry of linkTargets) {
  const [from, href] = entry.split('|');
  const path = href.split('#')[0];
  if (!path) continue;
  if (!pageExists(path) && !hasRedirect(path)) errors.push(`${from}: defekter interner Link -> ${href}`);
  else if (hasRedirect(path) && !pageExists(path)) warnings.push(`${from}: Link auf Weiterleitung -> ${href} (besser direkt verlinken)`);
}

for (const [t, pages] of titles) if (pages.length > 1) errors.push(`Doppelter Seitentitel "${t}": ${pages.join(', ')}`);
for (const [, pages] of descriptions) if (pages.length > 1) warnings.push(`Doppelte Meta-Description auf: ${pages.join(', ')}`);

// ---------- Pflichtdateien ----------
for (const f of ['robots.txt', 'sitemap-index.xml', '_headers', '_redirects', '404.html', 'favicon.svg']) {
  if (!existsSync(join(DIST, f))) errors.push(`Pflichtdatei fehlt: ${f}`);
}

// ---------- Ausgabe ----------
console.log(`\nGeprüft: ${htmlFiles.length} HTML-Seiten, ${legacyOk}/${legacy.urls.length} alte URLs abgedeckt, ${redirects.size} Weiterleitungen.`);
if (warnings.length) {
  console.log(`\n⚠️  ${warnings.length} Hinweise:`);
  warnings.forEach((w) => console.log('   - ' + w));
}
if (errors.length) {
  console.error(`\n❌ ${errors.length} Fehler:`);
  errors.forEach((e) => console.error('   - ' + e));
  process.exit(1);
}
console.log('\n✅ Alle Prüfungen bestanden.\n');
