# Änderungsvorschlag Datenschutzerklärung (ENTWURF – nicht veröffentlicht)

> **Status (28.10.2026): umgesetzt.** Datenschutzerklärung und Impressum wurden auf Grundlage dieses
> Vorschlags neu gefasst (`src/content/seiten/datenschutz.md`, `impressum.md`). Offene Angaben sind dort als
> „BITTE ERGÄNZEN“ markiert. Dieses Dokument bleibt als Begründung/Arbeitsgrundlage erhalten.

## A. Inhaltliche Mängel der bisherigen Fassung

1. Enthält einen Ausfüllhinweis der Vorlage: „Rechte, die für die eigene Webseite keine Relevanz haben,
   müssen nicht genannt werden. Insoweit kann die Auflistung gekürzt werden.“
2. Gliederung unvollständig (Abschnitte II und III fehlen, Nummerierung springt).
3. Keine Angaben zum **Hosting** (bisher Wix, künftig Cloudflare), zu Server-Logfiles, Cookies,
   Google Analytics/Tag Manager (die Wix-Seite lädt diese Dienste), Google Maps, Google Fonts.
4. Keine Angaben zu **Doctolib** (Terminbuchung), **SM-Clinic** (Anamnesebogen), **116117**, Instagram-Links.
5. Beschreibt ein Kontaktformular, das es künftig nicht mehr gibt.
6. Verantwortliche Stelle nennt nur die BAG; die eigenständige **Privatpraxis** ist nicht berücksichtigt.
7. Kein Hinweis auf Datenschutzbeauftragte(n) (ggf. erforderlich, je nach Praxisgröße/Verarbeitung – prüfen).

## B. Technische Fakten der neuen Website (für die Formulierung)

| Thema | Tatsächliche Verarbeitung |
|---|---|
| Hosting / Auslieferung | Cloudflare, Inc. (Workers Static Assets, CDN). Verarbeitung von IP-Adresse, Zeitpunkt, angefragter URL, User-Agent zur Auslieferung und Abwehr von Angriffen. Cloudflare ist unter dem EU-US Data Privacy Framework zertifiziert; Auftragsverarbeitungsvertrag (DPA) ist Bestandteil der Cloudflare-Nutzungsbedingungen (im Dashboard abrufbar). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. |
| Server-Logs | Keine eigenen Logs/Analysen aktiviert (Workers Logs/Analytics nicht konfiguriert). Cloudflare verarbeitet sicherheitsbezogene Daten kurzzeitig. |
| Cookies | **Keine.** Kein Tracking, keine Analyse-Tools, kein Cookie-Banner erforderlich. |
| Schriftarten | Lokal vom eigenen Server (keine Verbindung zu Google Fonts). |
| Karte | OpenStreetMap (OpenStreetMap Foundation, UK) – wird **erst nach Klick** auf „Karte laden“ geladen (IP-Übermittlung an OSM). Zusätzlich reine Links zu Google Maps/Apple Karten. Rechtsgrundlage: Einwilligung, Art. 6 Abs. 1 lit. a DSGVO. |
| Terminbuchung | Links zu Doctolib (Doctolib GmbH, Berlin). Verarbeitung erst nach Verlassen der Website auf doctolib.de; eigene Datenschutzerklärung von Doctolib; Verweis auf AV-Vertrag/gemeinsame Verantwortung prüfen. |
| Anamnesebogen | Link zu SM-Clinic (Anbieter-/Vertragsdaten ergänzen); dort werden **Gesundheitsdaten** (Art. 9 DSGVO) verarbeitet → AV-Vertrag mit SM-Clinic erforderlich, Hinweis aufnehmen. |
| 116117 | Link zum Patienten-Navi der Kassenärztlichen Bundesvereinigung (keine Datenübermittlung beim Seitenaufruf). |
| Instagram | Reine Textlinks (keine eingebetteten Inhalte). |
| E-Mail | Kontakt per E-Mail (Strato als E-Mail-Provider); Hinweis, dass unverschlüsselte E-Mail für Gesundheitsdaten ungeeignet ist. |
| Kontaktformular | **Entfällt** (von der Praxis bestätigt). |

## C. Gliederungsvorschlag

1. Verantwortliche Stelle(n): BAG Orthopädische Praxis Mitte (Schlichting & Dr. Kilic) **und** Privatpraxis (Inhaber/in ergänzen); ggf. Datenschutzbeauftragte(r)
2. Allgemeines zur Datenverarbeitung, Rechtsgrundlagen, Speicherdauer
3. Bereitstellung der Website (Hosting Cloudflare), Server-Logfiles, Sicherheit (TLS)
4. Keine Cookies, kein Tracking
5. Kontaktaufnahme (Telefon, E-Mail) – Hinweis zur unverschlüsselten E-Mail
6. Externe Dienste: Doctolib, SM-Clinic (Anamnesebogen), 116117, OpenStreetMap (Zwei-Klick), Instagram-Links
7. Verarbeitung von Gesundheitsdaten im Rahmen der Behandlung (Verweis auf Patienteninformation nach Art. 13 DSGVO in der Praxis)
8. Rechte der betroffenen Personen (Art. 15–21, 77 DSGVO) inkl. zuständiger Aufsichtsbehörde: Berliner Beauftragte für Datenschutz und Informationsfreiheit
9. Stand / Änderungen

## D. Impressum – Hinweise für die Überarbeitung

- „§ 5 TMG“ → „§ 5 DDG“ (Digitale-Dienste-Gesetz, in Kraft seit 14.05.2024).
- Angaben zur Privatpraxis (Inhaber/in, Anschrift, Kammer, Berufsbezeichnungen der dort tätigen Ärztinnen).
- Rechtsform der BAG (z. B. Partnerschaftsgesellschaft/GbR) und ggf. Register.
- Link zur Berufsordnung der Ärztekammer Berlin.
- Hinweis zur Verbraucherstreitbeilegung (§ 36 VSBG) prüfen.
- Hinweis „Quellverweis: Datenschutzerklärung von eRecht24“ passt inhaltlich nicht zum Impressum.
