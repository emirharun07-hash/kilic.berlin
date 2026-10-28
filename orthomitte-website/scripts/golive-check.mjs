/**
 * Go-Live-Sperre: bricht ab, solange in Inhalten oder Daten noch Platzhalter
 * „[[BITTE ERGÄNZEN: …]]“ stehen (z. B. fehlende Pflichtangaben im Impressum).
 * Wird von `npm run build:production` vor dem Produktions-Build ausgeführt.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const MARKER = '[[BITTE ERGÄNZEN';
const ordner = ['src/content', 'src/data', 'src/pages', 'src/components'];
const funde = [];

function durchsuche(pfad) {
  for (const name of readdirSync(pfad)) {
    const datei = join(pfad, name);
    if (statSync(datei).isDirectory()) durchsuche(datei);
    else if (/\.(md|ts|astro)$/.test(name)) {
      readFileSync(datei, 'utf8')
        .split('\n')
        .forEach((zeile, i) => {
          if (zeile.includes(MARKER)) funde.push(`${datei}:${i + 1}: ${zeile.trim().slice(0, 120)}`);
        });
    }
  }
}

ordner.forEach(durchsuche);

if (funde.length) {
  console.error(`\n✖ Go-Live gesperrt: ${funde.length} offene Platzhalter „${MARKER} …]]“\n`);
  funde.forEach((f) => console.error('  ' + f));
  console.error('\nBitte die Angaben ergänzen (siehe MIGRATION.md §9) und erneut ausführen.\n');
  process.exit(1);
}
console.log('✔ Go-Live-Prüfung: keine offenen Platzhalter.');
