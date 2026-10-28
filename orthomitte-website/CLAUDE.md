# CLAUDE.md – Projektanleitung Website Orthopädische Praxis Mitte

Diese Datei ist die **verbindliche Arbeitsanleitung** für alle Claude-Code-Sitzungen in diesem Projekt.
Lies sie vollständig, bevor du Änderungen vornimmst. Die Praxisinhaberin/der Praxisinhaber bearbeitet die
Website ausschließlich über natürliche Sprachbefehle an Claude Code – es gibt kein CMS.

> Kurzfassung: Inhalte liegen in `src/data/*.ts` und `src/content/**/*.md`. Design liegt in
> `src/styles/global.css` und `src/components/`. Ändere bei Inhaltsaufträgen **nur die betroffene
> Inhaltsdatei**. Prüfe jede Änderung mit `npm test`. Medizinische und rechtliche Aussagen niemals
> eigenmächtig verändern oder erfinden.

---

## 1. Projektüberblick

| | |
|---|---|
| Website | Orthopädische Praxis Mitte, Dorotheenstraße 56, 10117 Berlin |
| Hauptdomain (künftig) | **https://www.orthomitte.de** |
| Alte Domain (Wix) | https://www.orthopaedische-praxis-mitte.de → wird per 301 auf www.orthomitte.de umgeleitet |
| Framework | Astro 6 (statische Seitengenerierung), TypeScript (strict), Tailwind CSS 4 |
| Hosting | Cloudflare Workers mit Static Assets (keine serverseitige Logik) |
| Repository | GitHub, Branches `main` (Produktion) und `develop` (Entwicklung/Vorschau) |
| Sprache | Deutsch (de-DE), Sie-Form |
| Node | ≥ 22.12 (siehe `.nvmrc`) |

Es gibt **keine** Datenbank, kein CMS, keine Cookies, kein Tracking, keine externen Schriftarten und
keine serverseitigen Funktionen. Das ist Absicht (Datenschutz, Sicherheit, Kosten, Wartbarkeit).

## 2. Ordnerstruktur

```
orthomitte-website/
├── CLAUDE.md                  ← diese Anleitung
├── README.md / DEPLOYMENT.md / MIGRATION.md / CONTENT-INVENTORY.md
├── astro.config.mjs           ← Astro-Konfiguration (Domain, URL-Format, Sitemap)
├── wrangler.jsonc             ← Cloudflare-Workers-Konfiguration
├── public/                    ← Dateien, die 1:1 ausgeliefert werden
│   ├── _redirects             ← 301-Weiterleitungen alter/zusammengelegter URLs
│   ├── _headers               ← Sicherheits-Header (CSP, HSTS …) und Caching
│   ├── robots.txt, favicon.*, apple-touch-icon.png, logo.png
│   └── dokumente/             ← PDFs zum Download
├── scripts/
│   ├── verify-build.mjs       ← automatische Qualitätsprüfung (Teil von `npm test`)
│   ├── legacy-urls.json       ← Liste ALLER 82 alten Wix-URLs (müssen erreichbar bleiben)
│   ├── check-urls.mjs         ← prüft alle alten URLs gegen einen laufenden Server (`npm run test:urls`)
│   └── screenshots.mjs        ← Screenshots in 3 Bildschirmgrößen zur Sichtprüfung
├── archiv/wix-original/       ← Originaltexte aller Wix-Seiten (NICHT veröffentlicht, nur Nachschlagen)
├── docs/                      ← Entwürfe/Unterlagen (z. B. Datenschutz-Änderungsvorschlag)
└── src/
    ├── data/                  ← ZENTRALE STAMMDATEN (TypeScript-Objekte)
    │   ├── praxis.ts          ← Name, Adresse, Telefon, Fax, E-Mail, Doctolib, Anamnesebogen, 116117, ÖPNV, Karten
    │   ├── oeffnungszeiten.ts ← reguläre Sprechzeiten + Feriensprechzeiten
    │   ├── navigation.ts      ← Hauptmenü, Footer-Spalten, rechtliche Links
    │   ├── startseite.ts      ← alle Texte & Bilder der Startseite
    │   ├── leistungsbereiche.ts ← die 4 Leistungsbereiche (Gruppierung der Leistungen)
    │   ├── praxisteam.ts      ← MFA, Auszubildende, Aushilfen (nur Vornamen)
    │   ├── seo.ts             ← globale SEO-Standardwerte
    │   ├── strukturierte-daten.ts ← schema.org/JSON-LD (wird automatisch befüllt)
    │   └── rubriken.ts        ← Rubriken für Info-Seiten
    ├── content/               ← INHALTE ALS MARKDOWN (eine Datei = eine Unterseite)
    │   ├── leistungen/*.md    ← Behandlungen/Leistungen (Orthopädie + Privatpraxis)
    │   ├── team/*.md          ← Ärztinnen, Ärzte, Therapeuten mit Profil/Vita
    │   └── seiten/*.md        ← Patienteninformationen, Rechtliches, sonstige Seiten
    ├── content.config.ts      ← Schema (Pflichtfelder) aller Markdown-Dateien
    ├── assets/
    │   ├── images/praxis/     ← Praxisfotos (Räume, Hero)
    │   ├── images/team/       ← Porträtfotos
    │   ├── images/leistungen/ ← Bilder zu Leistungen
    │   ├── images/infos/      ← Bilder zu Info-Seiten
    │   └── logo/              ← Original-Logo + Vektorversion
    ├── components/
    │   ├── layout/            ← Header, Footer, mobile Buchungsleiste
    │   ├── sections/          ← große Seitenbereiche (PageHero, CtaBand …)
    │   ├── templates/         ← Vorlagen für Leistungs-, Team- und Info-Seiten
    │   ├── team/              ← TeamCard, TeamGrid
    │   ├── leistungen/        ← LeistungKarte, LeistungsBereich (Übersichten)
    │   ├── praxis/            ← AkutterminInfo, AnamneseHinweis (Texte zu Terminen/Anamnese)
    │   ├── seo/SeoHead.astro  ← <title>, Meta, Canonical, Open Graph, JSON-LD
    │   └── ui/                ← kleine Bausteine (Icon, Logo, Buttons, Sprechzeiten, Karte …)
    ├── layouts/BaseLayout.astro ← Grundgerüst jeder Seite
    ├── pages/                 ← Seiten mit eigenem Aufbau:
    │   ├── index.astro        ← Startseite (Inhalte in src/data/startseite.ts)
    │   ├── leistungen.astro   ← Leistungsübersicht (automatisch aus src/content/leistungen)
    │   ├── privatpraxis.astro ← Privatpraxis für Funktionelle Medizin
    │   ├── überuns.astro, aerzte.astro ← Team (automatisch aus src/content/team + praxisteam.ts)
    │   ├── infoseite.astro    ← Übersicht Patienteninformationen (Liste `artikel`)
    │   ├── termine.astro, feriensprechzeiten.astro, anamnese.astro, anfahrt.astro, kontaktformular.astro
    │   ├── 404.astro
    │   └── [...slug].astro    ← erzeugt automatisch alle Seiten aus src/content/
    ├── scripts/reveal.ts      ← dezente Scroll-Animation
    └── styles/global.css      ← DESIGNSYSTEM (Farben, Schriften, Buttons, Typografie)
```

## 3. Wo ändere ich was? (Aufgaben-Rezepte)

Halte dich an diese Rezepte. **Ändere nur die genannten Dateien**, sofern die Aufgabe nichts anderes verlangt.

| Auftrag (Beispiel) | Datei(en) |
|---|---|
| „Ändere die Öffnungszeiten am Freitag“ | `src/data/oeffnungszeiten.ts` → Array `sprechzeiten` |
| „Neue Feriensprechzeiten“ | `src/data/oeffnungszeiten.ts` → `feriensprechzeiten` (Seite `/feriensprechzeiten` zeigt sie automatisch) |
| „Hinweis zu Akutterminen ändern“ | `src/components/praxis/AkutterminInfo.astro` (erscheint auf /termine, /feriensprechzeiten, /kontaktformular) |
| „Kennzahlen auf der Startseite ändern“ (20+ Jahre …) | `src/data/startseite.ts` → `kennzahlen` |
| „Preis einer Infusion ändern“ | betreffende Datei in `src/content/leistungen/` – **alle** Seiten mit diesem Preis anpassen (`grep -rn "€" src/content`) |
| „Neue Telefonnummer / E-Mail / Adresse“ | `src/data/praxis.ts` (wirkt überall, inkl. Google-Daten) |
| „Doctolib-Link ändern“ | `src/data/praxis.ts` → `terminbuchung.url` |
| „Tausche das Bild auf der Startseite aus“ | Bild nach `src/assets/images/praxis/` kopieren, Import in `src/data/startseite.ts` anpassen, `bildAlt` aktualisieren |
| „Ändere den Text auf der Startseite“ | `src/data/startseite.ts` |
| „Füge einen neuen Facharzt hinzu“ | neue Datei `src/content/team/<vorname-nachname>.md` + Foto in `src/assets/images/team/` (siehe §7) |
| „Neue Mitarbeiterin am Empfang“ | `src/data/praxisteam.ts` |
| „Neue Unterseite über eine Behandlung“ | neue Datei `src/content/leistungen/<slug>.md` (siehe §6) |
| „Neue Info-Seite“ | neue Datei `src/content/seiten/<slug>.md` + Eintrag in Übersicht `src/pages/infoseite.astro` (Liste `artikel`) |
| „Menüpunkt hinzufügen“ | `src/data/navigation.ts` |
| „Seite löschen“ | Datei löschen **und** 301-Weiterleitung in `public/_redirects` eintragen (siehe §8) |
| „Mitarbeiter ausgeschieden“ | Datei in `src/content/team/` löschen, Profil-URL in `public/_redirects` → `/überuns` |
| „Farbe/Schrift ändern“ | nur `src/styles/global.css` (`@theme`) – nach Rückfrage, betrifft die ganze Website |

## 4. Designsystem

Das Design ist bewusst ruhig, hochwertig und medizinisch seriös. **Keine neuen Farben, Schriften oder
Schatten ad hoc einführen** – immer die Tokens aus `src/styles/global.css` verwenden.

**Farben (Tailwind-Klassen)**

| Token | Wert | Verwendung |
|---|---|---|
| `brand-500` | `#ff6633` | exaktes Logo-Orange – nur Flächen, Linien, Logo, Deko (kein Text auf Weiß!) |
| `brand-600` | `#c2451a` | Buttons (weiße Schrift, Kontrast 5,0:1) |
| `brand-700` | `#a54322` | Text-Links und farbige Texte (Kontrast 6,1:1) |
| `ink-50 … ink-950` | Schiefergrün | Text (`ink-800` Fließtext, `ink-900` Überschriften), dunkle Flächen (`ink-900/950`) |
| `sand-50 … sand-300` | warmes Off-White | Seitenhintergründe (`sand-50` Standard, `sand-100` Kopfbereiche) |
| `sage-100/500/700` | Salbei | sparsamer Zweitakzent (z. B. „Neu“-Badge, Privatpraxis) |

**Schriften:** Überschriften `font-serif` = *Fraunces* (variabel), Fließtext `font-sans` = *Manrope*.
Beide werden lokal über `@fontsource-variable` ausgeliefert. **Niemals Google Fonts per Link einbinden** (DSGVO).

**Bausteine (CSS-Klassen in global.css):**
`container-page` (Seitenbreite), `eyebrow` (Dachzeile), `btn-primary`, `btn-secondary`, `btn-ghost-light`,
`card`, `link`, `prose-praxis` (Fließtext aus Markdown). Für gestaltete Info-Artikel gibt es innerhalb von
`prose-praxis` HTML-Bausteine: `inline-cta`, `infografik` (figure), `vergleich` (zwei Spalten), `hervorhebung`,
`merksatz`, `symptomliste`, `faq` (details/summary), `merkmale` – Vorlage: `src/content/seiten/vegetatives-nervensystem.md`.
Info-Seiten können im Frontmatter eine Autorenzeile `autor:` und ein Kartenbild für `/infoseite` (`vorschaubild:` + `vorschaubildAlt:`, sonst `bild`) haben. Animation: Attribut `data-reveal` (+ optional
`style="--reveal-delay:80ms"`) für dezentes Einblenden.

**Komponenten wiederverwenden:** `PageHero`, `SectionHeading`, `CtaBand`, `BookingButton`, `OpeningHours`,
`MapEmbed`, `TransitInfo`, `TeamCard`, `TeamGrid`, `Icon` (Icon-Namen siehe `src/components/ui/Icon.astro`).

**Gestaltungsregeln:** großzügige Abstände (`py-20 sm:py-24` bis `py-32` für Sektionen), runde Ecken
(`rounded-2xl` / `--radius-card`), weiche Schatten (`--shadow-soft`, `--shadow-lift`), max. ~68 Zeichen
Zeilenlänge im Fließtext, genau **eine `<h1>` pro Seite**, Überschriften-Hierarchie ohne Sprünge.

## 5. Inhaltsverwaltung – Grundregeln

1. **Stammdaten nie doppelt pflegen.** Telefon, Adresse, Zeiten, Links kommen immer aus `src/data/`.
   In Markdown-Texten Telefonnummern nur dann ausschreiben, wenn sie Teil eines Fließtextes sind.
2. **Markdown-Dateien:** Frontmatter (zwischen `---`) muss dem Schema in `src/content.config.ts` entsprechen.
   Der Build schlägt fehl, wenn Pflichtfelder fehlen – das ist gewollt.
3. **Dateinamen:** klein, ohne Umlaute, mit Bindestrichen (`dry-needling.md`). Die **URL** steht im Feld
   `url` und darf Umlaute enthalten, wenn eine bestehende Adresse erhalten werden muss (z. B. `stoßwelle`).
4. **Überschriften in Markdown** beginnen mit `##` (die `<h1>` erzeugt die Vorlage aus `titel`).
5. **Interne Links** immer relativ und ohne Domain: `[Akupunktur](/akupunktur)`.
6. **Sprache:** Sie-Form, sachlich, freundlich, gut verständlich. Fachbegriffe kurz erklären.

## 6. Neue Leistungs-/Behandlungsseite

Datei `src/content/leistungen/<slug>.md`:

```markdown
---
titel: Stoßwellentherapie
url: stoßwelle                 # Adresse ohne Schrägstrich; bestehende URLs nie ändern
bereich: orthopaedie           # orthopaedie | funktionelle-medizin
kategorie: diagnose            # orthopaedie: diagnose | therapie | regeneration | spezial · funktionelle-medizin: grundlagen | infusionen
kurzbeschreibung: Ein bis zwei Sätze für Übersichten und Meta-Description (max. ~160 Zeichen).
bild: ../../assets/images/leistungen/stosswelle.jpg   # optional
bildAlt: Beschreibung des Bildinhalts                  # Pflicht, wenn bild gesetzt
reihenfolge: 10
komplementaer: false          # true bei Methoden der Komplementär-/Erfahrungsmedizin (blendet Hinweis ein)
seo:
  title: Stoßwellentherapie in Berlin-Mitte            # optional, ~50–60 Zeichen
  description: …                                       # optional, ~120–160 Zeichen
---

## Was ist …?
Text …
```

Checkliste: Inhalte **nur aus Angaben der Praxis** übernehmen (nichts erfinden) · Kostenhinweise
(GKV/GOÄ/IGeL) nur wörtlich wie von der Praxis vorgegeben · `npm test` ausführen · Seite erscheint
automatisch in Übersicht und „Weitere Leistungen“. Neue Leistung ggf. auch in die Übersichtsseite
(`/leistungen` bzw. `/leistungen-2`) aufnehmen – das passiert automatisch über `bereich`/`kategorie`.

## 7. Neues Mitarbeiterprofil (Ärztin/Arzt/Therapeut)

1. Foto nach `src/assets/images/team/<vorname-nachname>.jpg` (Hochformat ~4:5, mind. 800 px breit,
   neutraler Hintergrund). Einverständnis der Person zur Veröffentlichung muss vorliegen.
2. Datei `src/content/team/<vorname-nachname>.md`:

```markdown
---
name: Dr. Max Beispiel                # exakt wie von der Person/Praxis angegeben (Titel!)
rolle: Facharzt für Orthopädie und Unfallchirurgie
gruppe: aerzte                        # aerzte | therapie | team
url: dr-max-beispiel                  # eigene Profilseite (optional)
foto: ../../assets/images/team/max-beispiel.jpg
fotoAlt: Porträt von Dr. Max Beispiel
email: beispiel@orthomitte.de         # optional, nur wenn gewünscht
schwerpunkte: [Manuelle Medizin, Akupunktur]
reihenfolge: 3                        # Position in Teamlisten
zeigeAufStartseite: true
---

| Jahr | Station |
| --- | --- |
| 2010–2016 | Studium der Humanmedizin, … |
```

**Titel und Qualifikationen exakt übernehmen.** Akademische Grade, Facharzt- und Zusatzbezeichnungen
sind rechtlich geschützt (Heilberufe-Kammergesetz, Berufsordnung). Ausländische Grade in Originalform
(Beispiel: „dr. Isabelle Landenberger“ – kleines „dr.“ ist korrekt und darf nicht geändert werden).
Ausscheidende Person: Datei löschen und Weiterleitung von ihrer Profil-URL auf `/überuns` eintragen.

## 8. URLs, Weiterleitungen, SEO-Konventionen

- **Bestehende URLs nie ändern.** Alle alten Wix-Adressen stehen in `scripts/legacy-urls.json` und werden
  von `npm test` geprüft. Muss eine Seite entfallen: Eintrag in `public/_redirects`
  (`/alte-url /neue-url 301`), Umlaute dürfen wörtlich stehen.
- URL-Format: ohne abschließenden Schrägstrich (`/aerzte`), Astro erzeugt `aerzte.html` (`build.format: 'file'`).
- Jede Seite braucht einen individuellen `<title>` (Seitentitel + Suffix „| Orthopädische Praxis Mitte Berlin“)
  und eine individuelle Meta-Description (120–160 Zeichen). Lokalbezug „Berlin-Mitte“ wo sinnvoll.
- Canonical, Open Graph, Sitemap (`/sitemap-index.xml`) und JSON-LD werden automatisch erzeugt.
- Strukturierte Daten: nur wahre, belegte Angaben (keine Bewertungen/Sterne, keine Preise, keine Heilversprechen).
- Bilder brauchen aussagekräftige `alt`-Texte (deutsch, beschreibend, ohne „Bild von“).

## 9. Bilder und Medien

- Ablage unter `src/assets/images/<bereich>/`, Dateinamen klein, ohne Umlaute, mit Bindestrichen.
- Originale möglichst groß (≥ 1600 px Breite, JPG/PNG/WebP). Astro erzeugt beim Build automatisch
  verkleinerte WebP-Varianten (`<Image>`-Komponente aus `astro:assets` verwenden, nie `<img src>` mit
  großen Dateien). Max. sinnvolle Originalgröße: 2400 px Kantenlänge.
- Nur Bilder verwenden, an denen die Praxis die Rechte hat (eigene Fotos, lizenzierte Stockfotos).
  Personen nur mit Einwilligung. Keine Arzneimittel-Markennamen im Bild (Heilmittelwerbegesetz).
- PDFs zum Download nach `public/dokumente/` (Dateiname ohne Umlaute/Leerzeichen).

## 10. Medizinische und rechtliche Inhaltsgrenzen (WICHTIG)

Für Arztpraxen gelten Heilmittelwerbegesetz (HWG), ärztliche Berufsordnung (MBO-Ä §27), UWG, DSGVO und TMG/DDG.

**Niemals ohne ausdrückliche Anweisung und Freigabe der Praxis:**
- medizinische Aussagen, Wirkversprechen, Indikationen oder Risiken ändern oder ergänzen,
- Heilungs- oder Erfolgsversprechen formulieren („garantiert schmerzfrei“, „heilt …“),
- Patientenbewertungen, Testimonials, Vorher-/Nachher-Bilder oder Fallbeispiele erfinden/einfügen,
- Qualifikationen, Titel, Facharztbezeichnungen, Mitgliedschaften erfinden oder umformulieren,
- Preise, Kostenangaben oder Aussagen zur Kostenübernahme (GKV/PKV/GOÄ/IGeL) ändern,
- Impressum oder Datenschutzerklärung inhaltlich ändern (nur nach Vorgabe, rechtliche Prüfung empfohlen),
- verschreibungspflichtige Arzneimittel namentlich bewerben.

**Erlaubt:** Rechtschreibung/Zeichensetzung korrigieren, Texte gliedern (Zwischenüberschriften, Listen),
Formulierungen glätten, **ohne den Sinn zu verändern**. Bei Zweifel: nachfragen, nicht raten.
Fehlende Angaben werden **nicht erfunden**, sondern als offene Frage gemeldet.

## 11. Datenschutz & Sicherheit

- Keine Tracking-/Analyse-Tools, keine Cookies, kein Google Maps/Fonts/reCAPTCHA, keine Social-Media-Plugins.
  Eine Ergänzung solcher Dienste erfordert Rücksprache, Datenschutzerklärung und ggf. Einwilligungsbanner.
- Externe Inhalte nur als **Link** oder per **Zwei-Klick-Lösung** (siehe `MapEmbed.astro`).
- Externe Links: `target="_blank" rel="noopener noreferrer"`.
- Kein eigenes Kontaktformular mit Gesundheitsdaten (Art. 9 DSGVO): Kontakt läuft über Telefon,
  E-Mail und die Doctolib-Nachrichtenfunktion. Ein Formular nur nach Rücksprache (Verschlüsselung, AV-Vertrag).
- Sicherheits-Header in `public/_headers` (CSP!). Neue externe Quellen (Skripte, iframes, Bilder)
  müssen dort freigegeben werden – sonst blockiert der Browser sie. Inline-Skripte sind erlaubt.
- Keine Geheimnisse (API-Tokens, Passwörter) ins Repository. Cloudflare-Zugangsdaten nur als
  GitHub-/Cloudflare-Secrets.

## 12. Testverfahren (vor JEDEM Commit)

```bash
npm install          # einmalig
npm run dev          # lokale Vorschau http://localhost:4321 (Live-Reload)
npm test             # = astro check (Typen) + astro build + scripts/verify-build.mjs
npm run preview      # Build in echter Cloudflare-Umgebung (wrangler dev) http://localhost:8787
npm run test:urls      # bei laufendem preview: alle 82 alten URLs inkl. Weiterleitungen prüfen
npm run golive:check   # meldet offene Platzhalter „BITTE ERGÄNZEN“ (Teil von build:production)
```

`npm test` prüft: TypeScript/Schema, Build, alle alten URLs erreichbar, Titel/Description/Canonical/H1
auf jeder Seite, Bild-Alt-Texte, defekte interne Links, doppelte Titel, Pflichtdateien.
**Ein Commit darf nur erfolgen, wenn `npm test` grün ist.**

Visuelle Prüfung (bei Layout-Änderungen): `npm run build && node scripts/screenshots.mjs / /pfad`
→ Screenshots in `screenshots/` (mobil 390 px, Tablet 820 px, Desktop 1440 px) ansehen; das Skript
meldet auch horizontales Überlaufen und JavaScript-Fehler.

### Besonderheiten dieses Projekts

- **Rechtstexte** (`src/content/seiten/impressum.md`, `datenschutz.md`) wurden am 28.10.2026 auf Wunsch der
  Praxis neu gefasst (DDG, VSBG, DSGVO/TDDDG). Platzhalter `[[BITTE ERGÄNZEN: …]]` muss die Praxis füllen;
  `npm run build:production` (Produktion) bricht ab, solange welche existieren. Inhaltlich nur nach Vorgabe ändern.
- **Werbeaussagen (HWG/UWG):** Keine Heilversprechen, keine Werbung mit Krankheiten nach § 12 HWG
  (z. B. meldepflichtige Infektionen wie COVID-19, Krebs), keine Präparatenamen verschreibungspflichtiger
  Arzneimittel, keine herabsetzenden Vergleiche mit anderen Anbietern. Methoden der Komplementär-/
  Erfahrungsmedizin erhalten im Frontmatter `komplementaer: true` (blendet Pflichthinweis ein).
  Details: MIGRATION.md §9.
- **Preise**: Es gibt bekannte Widersprüche aus der alten Website (siehe CONTENT-INVENTORY.md §8).
  Bei Preisänderungen alle Fundstellen prüfen.
- **„dr. Isabelle Landenberger“** – kleines „dr.“ ist korrekt (ausländischer Grad), nicht korrigieren.
- **Fehlende Bilder** bei Leistungen sind gewollt (nur echte Praxisfotos mit geklärten Rechten).
  Feld `bild` erst setzen, wenn ein geeignetes eigenes Foto vorliegt.
- Die URLs `/neuraltherapie-2`, `/leistungen-2/energy-balance` usw. sehen ungewöhnlich aus, sind aber
  bestehende, bei Google bekannte Adressen – **nicht umbenennen**.

## 13. Deployment-Prozess (Kurzfassung – Details in DEPLOYMENT.md)

1. Änderungen auf Branch `develop` (oder Feature-Branch → Pull Request nach `develop`).
2. GitHub Actions führt `npm test` aus.
3. Cloudflare Workers Builds lädt für `develop`/Pull Requests eine **Vorschau-Version** hoch
   (Vorschau-URL `*.workers.dev`, nicht von Google indexiert).
4. Die Praxis prüft die Vorschau und gibt frei.
5. Erst dann: Pull Request `develop` → `main`. Ein Merge in `main` veröffentlicht die Produktionsversion.

**Niemals** ohne ausdrückliche Freigabe der Praxis nach `main` mergen, deployen, DNS-Einträge,
Domains, E-Mail-Einstellungen (MX/SPF/DKIM/DMARC) oder Weiterleitungen der Live-Domain verändern.

## 14. Arbeitsweise für Claude Code

- Vor Änderungen die betroffene Datei lesen; kleinste mögliche Änderung durchführen.
- Keine „Verbesserungen“ an Dateien, die nicht zur Aufgabe gehören.
- Nach der Änderung: `npm test`; bei Layout-Änderungen zusätzlich Screenshots prüfen.
- Commit-Nachrichten auf Deutsch, aussagekräftig („Sprechzeiten Freitag auf 8–13 Uhr geändert“).
- Am Ende kurz berichten: was geändert wurde, welche Datei, Testergebnis, ob eine Vorschau bereitsteht.
- Wenn eine Angabe fehlt (z. B. Foto, Qualifikation, Preis): nachfragen statt erfinden.
