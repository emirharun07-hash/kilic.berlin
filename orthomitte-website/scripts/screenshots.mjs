#!/usr/bin/env node
/**
 * Erstellt Screenshots ausgewählter Seiten in mehreren Bildschirmgrößen (für die visuelle Prüfung).
 * Aufruf:  npm run build && node scripts/screenshots.mjs [pfad1 pfad2 ...]
 * Voraussetzung: Playwright mit Chromium ist installiert (npx playwright install chromium).
 * Ergebnis: screenshots/<breite>/<seite>.png
 */
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  try {
    // Fallback: global installiertes Playwright (NODE_PATH=$(npm root -g))
    ({ chromium } = createRequire(import.meta.url)('playwright'));
  } catch {}
}
if (!chromium) {
  console.error('Playwright fehlt. Installation: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

const PORT = 4329;
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/leistungen', '/überuns', '/aerzte', '/anfahrt', '/privatpraxis'];
const viewports = [
  { name: 'mobil-390', width: 390, height: 844 },
  { name: 'tablet-820', width: 820, height: 1180 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
const base = `http://localhost:${PORT}`;
for (let i = 0; i < 60; i++) {
  try { await fetch(base); break; } catch { await new Promise((r) => setTimeout(r, 500)); }
}

const browser = await chromium.launch();
try {
  for (const vp of viewports) {
    mkdirSync(`screenshots/${vp.name}`, { recursive: true });
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    for (const p of pages) {
      await page.goto(base + encodeURI(p), { waitUntil: 'networkidle' });
      // langsam scrollen, damit Lazy-Loading-Bilder geladen werden
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForLoadState('networkidle');
      // alle Einblend-Animationen sofort sichtbar machen
      await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible')));
      await page.waitForTimeout(400);
      const name = (decodeURI(p).replace(/^\//, '') || 'startseite').replace(/\//g, '_');
      await page.screenshot({ path: `screenshots/${vp.name}/${name}.png`, fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      let culprit = '';
      if (overflow) {
        culprit = await page.evaluate(() => {
          const w = window.innerWidth;
          const clipped = (e) => {
            for (let p = e.parentElement; p; p = p.parentElement) {
              const o = getComputedStyle(p).overflowX;
              if (o === 'hidden' || o === 'clip') return true;
            }
            return false;
          };
          const el = [...document.querySelectorAll('body *')].find(
            (e) => e.getBoundingClientRect().right > w + 1 && getComputedStyle(e).position !== 'fixed' && !clipped(e),
          );
          return el ? `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 80)}` : '';
        });
      }
      console.log(`${vp.name} ${p}${overflow ? '  ⚠️ horizontaler Überlauf: ' + culprit : ''}`);
    }
    if (errors.length) console.log('  JS-Fehler:', [...new Set(errors)].join(' | '));
    await ctx.close();
  }
} finally {
  await browser.close();
  server.kill();
}
