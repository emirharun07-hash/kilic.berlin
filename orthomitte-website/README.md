# Website Orthopädische Praxis Mitte

Neue Website der **Orthopädischen Praxis Mitte**, Dorotheenstraße 56, 10117 Berlin –
künftige Adresse **https://www.orthomitte.de**.

- Ersetzt die bisherige Wix-Website (www.orthopaedische-praxis-mitte.de)
- Schnell, barrierearm, datenschutzfreundlich: **keine Cookies, kein Tracking, keine Drittanbieter beim Seitenaufruf**
- Statisch erzeugt mit [Astro](https://astro.build), gestaltet mit Tailwind CSS, gehostet auf **Cloudflare Workers**
- Pflege ausschließlich über **Claude Code** (natürliche Sprache) – kein CMS nötig

| Kennzahl (Lighthouse, Desktop-Test lokal) | Alt (Wix) | Neu |
|---|---|---|
| Performance | 53 | 99–100 |
| Barrierefreiheit | 89 | 100 |
| Best Practices | 73 | 100 |
| SEO | 100 | 100 |
| Datenmenge Startseite | 2,5 MB / 225 Anfragen | ca. 0,2 MB |

---

## Für die Praxis: So ändern Sie Inhalte

Öffnen Sie Claude Code in diesem Ordner und beschreiben Sie Ihren Wunsch, z. B.:

- „Ändere unsere Öffnungszeiten am Freitag auf 8 bis 13 Uhr.“
- „Füge Dr. Max Muster als neuen Facharzt hinzu – hier sind Foto und Lebenslauf.“
- „Erstelle eine neue Unterseite über Stoßwellentherapie bei Fersensporn mit folgendem Text: …“
- „Tausche das Bild auf der Startseite gegen dieses Foto aus.“
- „Trage Feriensprechzeiten für die Osterferien ein.“

Claude Code kennt über die Datei [`CLAUDE.md`](CLAUDE.md) alle Regeln dieses Projekts, testet jede
Änderung automatisch und veröffentlicht nur nach Ihrer Freigabe (siehe [`DEPLOYMENT.md`](DEPLOYMENT.md)).

## Dokumentation

| Datei | Inhalt |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Verbindliche Projektanleitung für Claude Code (Struktur, Designsystem, Regeln) |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | GitHub, Branches, Cloudflare einrichten, Vorschau & Veröffentlichung |
| [`MIGRATION.md`](MIGRATION.md) | Schritt-für-Schritt-Umzug von Wix, Domain- & E-Mail-Sicherheit, SEO, offene Fragen, Rechtsprüfung |
| [`CONTENT-INVENTORY.md`](CONTENT-INVENTORY.md) | Bestandsaufnahme aller 82 alten Seiten, Bilder, Systeme, Unstimmigkeiten |
| [`docs/DATENSCHUTZ-AENDERUNGSVORSCHLAG.md`](docs/DATENSCHUTZ-AENDERUNGSVORSCHLAG.md) | Entwurf für die Aktualisierung von Datenschutz & Impressum (rechtliche Prüfung nötig) |
| [`archiv/`](archiv/) | Originaltexte aller Wix-Seiten (nicht veröffentlicht) |

## Technische Installation

Voraussetzung: [Node.js](https://nodejs.org) ab Version 22.12 (siehe `.nvmrc`).

```bash
npm install            # Abhängigkeiten installieren (einmalig)
npm run dev            # lokale Vorschau mit Live-Reload: http://localhost:4321
npm test               # Typprüfung + Build + Qualitätsprüfung (muss vor jedem Commit grün sein)
npm run preview        # Build in echter Cloudflare-Laufzeit (wrangler dev): http://localhost:8787
npm run test:urls      # (bei laufendem preview) alle 82 alten Wix-URLs prüfen
npm run golive:check   # offene Pflichtangaben („BITTE ERGÄNZEN“) vor dem Go-Live finden
npm run screenshots    # Screenshots mobil/Tablet/Desktop nach screenshots/ (benötigt Playwright)
```

## Projektstruktur (Kurzfassung)

```
src/data/          Stammdaten: Praxis, Sprechzeiten, Navigation, Startseite, SEO
src/content/       Inhalte als Markdown: leistungen/, team/, seiten/
src/assets/images/ Fotos (werden beim Build automatisch optimiert)
src/components/    Bausteine (Layout, Abschnitte, Vorlagen, UI)
src/pages/         Seiten mit eigenem Aufbau (Startseite, Übersichten, Kontakt …)
src/styles/        Designsystem (global.css)
public/            _redirects, _headers, robots.txt, Favicons, Dokumente
scripts/           Qualitätsprüfungen
```

Details: [`CLAUDE.md`](CLAUDE.md).

## Technik-Entscheidungen

- **Astro 6, statische Ausgabe** – jede Seite ist fertiges HTML, kein Server nötig.
- **Cloudflare Workers (Static Assets)** – von Cloudflare für neue Projekte empfohlen; statische Anfragen kostenlos.
- **Keine Datenbank, kein CMS, keine serverseitigen Funktionen** – minimale Angriffsfläche und Kosten.
- **Inhalte als Markdown + TypeScript-Daten** – für Claude Code gut les- und änderbar, durch Schema geprüft.
- **Schriften lokal** (Fraunces, Manrope via Fontsource), **Karte per Zwei-Klick** (OpenStreetMap),
  **Doctolib als Link** statt Widget-Skript.
- **Alle alten URLs bleiben erhalten** (inkl. Umlaut-Adressen wie `/überuns`, `/stoßwelle`); entfallene
  Seiten werden per 301 weitergeleitet (`public/_redirects`).
