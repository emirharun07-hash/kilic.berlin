# MIGRATION.md – Umzug von Wix zu Cloudflare mit neuer Hauptdomain www.orthomitte.de

Diese Anleitung beschreibt den vollständigen, SEO-schonenden Umzug – Schritt für Schritt und in
verständlichem Deutsch. **Jeder Schritt, der Domains, DNS, E-Mail oder die Live-Website betrifft,
wird nur nach Ihrer ausdrücklichen Freigabe ausgeführt.** Bis dahin bleibt die Wix-Website
unverändert online.

---

## 0. Zielbild

| | Heute | Nach der Umstellung |
|---|---|---|
| Hauptadresse | www.orthopaedische-praxis-mitte.de (Wix) | **www.orthomitte.de** (Cloudflare) |
| orthomitte.de / www.orthomitte.de | 301 → orthopaedische-praxis-mitte.de | orthomitte.de → 301 → www.orthomitte.de |
| orthopaedische-praxis-mitte.de (mit/ohne www) | Wix-Website | 301 → **gleicher Pfad** auf www.orthomitte.de |
| E-Mail (mail@orthomitte.de u. a.) | Strato | **unverändert Strato** |
| Domain-Registrierung | Strato | **unverändert Strato** (nur die DNS-Verwaltung zieht um) |
| Kosten | Wix-Abo | Cloudflare Free (0 €) |

Weil alle Pfade gleich bleiben (z. B. `/akupunktur`), funktioniert jede alte Adresse auch unter
der neuen Domain: `orthopaedische-praxis-mitte.de/akupunktur` → `www.orthomitte.de/akupunktur`.

## 1. Ist-Zustand DNS (erhoben am 28.10.2026, öffentlich abgefragt)

### orthomitte.de (Nameserver: `docks08.rzone.de`, `shades05.rzone.de` – Strato)

| Name | Typ | Wert | Zweck |
|---|---|---|---|
| orthomitte.de | A | 217.160.0.94 | Strato-Weiterleitungsserver (→ orthopaedische-praxis-mitte.de) |
| orthomitte.de | AAAA | 2001:8d8:100f:f000::200 | dto. (IPv6) |
| www.orthomitte.de | CNAME | orthomitte.de | |
| orthomitte.de | **MX** | 5 smtpin.rzone.de | **E-Mail-Empfang (Strato)** |
| *.orthomitte.de | (Wildcard) | A/MX wie oben | Strato-Standard (z. B. imap., autodiscover.) |
| _dmarc.orthomitte.de | TXT | `v=DMARC1;p=reject;` | **E-Mail-Schutz** |
| strato-dkim-0002._domainkey | TXT | `v=DKIM1; k=rsa; p=MIIBIjAN…` | **E-Mail-Signatur (DKIM)** |
| strato-dkim-0003._domainkey | TXT | `v=DKIM1; k=ed25519; p=hB4f…` | **E-Mail-Signatur (DKIM)** |
| orthomitte.de | TXT (SPF) | *keiner gefunden* | – |

### orthopaedische-praxis-mitte.de (Nameserver: `docks12.rzone.de`, `shades18.rzone.de` – Strato)

| Name | Typ | Wert | Zweck |
|---|---|---|---|
| orthopaedische-praxis-mitte.de | A | 185.230.63.107 | Wix |
| www | CNAME | pointing.wixdns.net | Wix |
| @ | MX | 5 smtpin.rzone.de | E-Mail (Strato) |
| _dmarc | TXT | `v=DMARC1;p=reject;` | E-Mail-Schutz |
| strato-dkim-0002/-0003._domainkey | TXT | DKIM-Schlüssel | E-Mail-Signatur |

> ⚠️ **Wichtig für die E-Mail:** DMARC steht auf `p=reject` und es gibt keinen SPF-Eintrag. Die
> Zustellung Ihrer ausgehenden Mails hängt daher an den DKIM-Einträgen. Fehlen diese nach einem
> Nameserver-Wechsel, werden Ihre Mails von vielen Empfängern **abgewiesen**. Deshalb gilt:
> Die neue DNS-Zone wird vorab vollständig aufgebaut und geprüft, bevor irgendetwas umgeschaltet wird.
> Die vollständige Liste der Einträge (inkl. ggf. weiterer Einträge, die öffentlich nicht sichtbar
> sind, z. B. für Microsoft 365, Google-Verifizierung, SRV) muss zusätzlich im Strato-Kundenlogin
> unter *Domains → Domainverwaltung → DNS* abgelesen und als Screenshot gesichert werden.

## 2. Empfohlene Variante und Alternative

**Variante A (empfohlen): DNS-Verwaltung beider Domains zu Cloudflare, Registrierung bleibt bei Strato.**
- Cloudflare Workers benötigt für eigene Domains eine Cloudflare-DNS-Zone (offizielle Doku).
- Nur so sind saubere, pfaderhaltende 301-Weiterleitungen für `orthomitte.de` (ohne www) und die
  gesamte alte Domain kostenlos und ohne zusätzlichen Code möglich (Cloudflare *Redirect Rules*).
- E-Mail bleibt bei Strato; es werden nur die DNS-Einträge 1:1 bei Cloudflare angelegt.

**Variante B (ohne Nameserver-Wechsel):** DNS bleibt bei Strato. Die Website läuft dann besser auf
*Cloudflare Pages* (unterstützt `www`-Subdomains per CNAME bei fremdem DNS). `orthomitte.de` ohne www
und die alte Domain müssten über Strato-Weiterleitungen bzw. zusätzliche Weiterleitungslogik laufen –
mehr bewegliche Teile, pfadgenaue Weiterleitung der alten Domain nicht garantiert. Nur wählen, wenn
ein Nameserver-Wechsel aus organisatorischen Gründen ausgeschlossen ist.

Die folgenden Schritte beschreiben **Variante A**.

## 3. Phase 1 – Vorbereitung (keine Auswirkungen auf Live-Systeme)

| ✔ | Schritt | Wer |
|---|---|---|
| ☐ | Inhalte der Vorschau-Website prüfen und freigeben (CONTENT-INVENTORY.md, Abschnitte 2, 8, 9) | Praxis |
| ☐ | **Rechtliche Prüfung** Impressum + Datenschutzerklärung, Entwurf in `docs/DATENSCHUTZ-AENDERUNGSVORSCHLAG.md` freigeben (siehe Abschnitt 9) | Praxis / Rechtsberatung |
| ☐ | Offene Fragen beantworten (Abschnitt 10) | Praxis |
| ☐ | Strato-Login: Screenshots aller DNS-Einträge beider Domains sichern | Praxis |
| ☐ | Wix: Export/Sicherung (Bilder, ggf. Formulareinträge, Blog) – Wix bleibt vorerst aktiv | Praxis |
| ☐ | Google Search Console: Zugang prüfen; Property für `orthopaedische-praxis-mitte.de` vorhanden? (falls nein: jetzt als *Domain-Property* anlegen – per DNS-TXT bei Strato, harmlos) | Praxis / Claude Code |
| ☐ | Cloudflare-Konto + GitHub-Verbindung einrichten, Vorschau unter `*.workers.dev` (DEPLOYMENT.md) | Praxis / Claude Code |

## 4. Phase 2 – DNS-Zonen bei Cloudflare vorbereiten (noch keine Umschaltung)

1. Cloudflare → **Add a domain** → `orthomitte.de` → Free-Plan.
   Cloudflare liest vorhandene Einträge automatisch ein. **Diese Liste ist unvollständig**
   (Wildcards und DKIM werden oft nicht erkannt) – manuell mit den Strato-Screenshots abgleichen.
2. Folgende Einträge **müssen** in der Cloudflare-Zone stehen, alle als **„DNS only“ (graue Wolke)**:

   | Name | Typ | Inhalt | Proxy |
   |---|---|---|---|
   | `@` | MX | `smtpin.rzone.de` (Priorität 5) | – |
   | `_dmarc` | TXT | `v=DMARC1;p=reject;` (unverändert) | – |
   | `strato-dkim-0002._domainkey` | CNAME **oder** TXT | laut aktueller Strato-FAQ „DKIM bei externen Nameservern“ (CNAME auf das von Strato genannte Ziel, z. B. `strato-dkim-0002._domainkey.rzone.de`) – alternativ den heutigen TXT-Wert 1:1 | DNS only |
   | `strato-dkim-0003._domainkey` | wie oben | wie oben | DNS only |
   | `imap`, `pop3`, `smtp`, `autodiscover` (falls genutzt) | CNAME/MX | wie bei Strato | DNS only |
   | alle weiteren Einträge aus den Strato-Screenshots | | 1:1 | DNS only |

   Die Website-Einträge für `@` und `www` legt später Cloudflare selbst an (Phase 3).
3. **Prüfung vor dem Umschalten** (Claude Code kann das ausführen):
   ```bash
   # Cloudflare nennt zwei Nameserver, z. B. ada.ns.cloudflare.com
   dig @ada.ns.cloudflare.com orthomitte.de MX +short
   dig @ada.ns.cloudflare.com strato-dkim-0002._domainkey.orthomitte.de TXT +short
   dig @ada.ns.cloudflare.com _dmarc.orthomitte.de TXT +short
   # Ergebnisse müssen identisch sein mit:
   dig @docks08.rzone.de orthomitte.de MX +short   (usw.)
   ```
4. Dasselbe für `orthopaedische-praxis-mitte.de`.
5. **Empfehlung (separate Freigabe nötig):** zusätzlich einen SPF-Eintrag `v=spf1 redirect=_spf.strato.com`
   (laut Strato-FAQ) ergänzen – erhöht die Zustellbarkeit, ändert aber Ihre E-Mail-Konfiguration und wird
   deshalb **nicht** ohne Ihre Zustimmung gesetzt. Falls andere Dienste in Ihrem Namen mailen
   (z. B. Doctolib-Erinnerungen über eigene Absender, Praxissoftware), müssen diese berücksichtigt werden.

## 5. Phase 3 – Umschaltung orthomitte.de (Go-Live der neuen Website)

**Voraussetzung:** Ihre schriftliche Freigabe („Go-Live freigegeben“). Ideal: Dienstag–Donnerstag
vormittags, nicht vor Feiertagen.

1. **Strato** → Domainverwaltung → `orthomitte.de` → Nameserver auf die beiden Cloudflare-Nameserver ändern.
   (Notieren: alte Werte `docks08.rzone.de` / `shades05.rzone.de` – für einen eventuellen Rückweg.)
2. Warten, bis Cloudflare die Zone als **Active** meldet (Minuten bis wenige Stunden).
3. Sofort testen: E-Mail senden **und** empfangen (intern + an Gmail/Outlook), DKIM-Ergebnis z. B. mit
   mail-tester.com prüfen.
4. Workers → `orthomitte-website` → **Settings → Domains & Routes → Add → Custom domain**: `www.orthomitte.de`.
5. **Rules → Redirect Rules → Create rule** (Zone `orthomitte.de`):
   - Name: `orthomitte.de ohne www → www`
   - Wenn: *Hostname* equals `orthomitte.de`
   - Dann: *Dynamic* → Ausdruck `concat("https://www.orthomitte.de", http.request.uri.path)`,
     Statuscode **301**, „Preserve query string“ ✔
   - Damit das greift, braucht `orthomitte.de` einen proxied DNS-Eintrag (orange Wolke), z. B.
     `A @ 192.0.2.1` (Platzhalter-IP, laut Cloudflare-Doku üblich für reine Weiterleitungen).
6. SSL/TLS → Modus **Full (strict)**, „Always Use HTTPS“ ✔, HSTS **erst nach 1–2 Wochen** stabilen Betriebs aktivieren.
7. Prüfen (Claude Code):
   ```bash
   node scripts/check-urls.mjs https://www.orthomitte.de   # alle 82 alten Pfade
   curl -sI http://orthomitte.de/akupunktur                  # 301 → https://www.orthomitte.de/akupunktur
   ```

Zu diesem Zeitpunkt ist die Wix-Website unter orthopaedische-praxis-mitte.de **noch erreichbar**
(nur für wenige Stunden/Tage, bis Phase 4).

## 6. Phase 4 – Alte Domain weiterleiten

1. Strato → `orthopaedische-praxis-mitte.de` → Nameserver auf Cloudflare (Zone aus Phase 2).
2. In der Zone `orthopaedische-praxis-mitte.de`:
   - DNS: `A @ 192.0.2.1` (proxied) und `CNAME www @` (proxied) – ersetzt die Wix-Einträge.
   - **Redirect Rule:** Wenn *Hostname* ist in {`orthopaedische-praxis-mitte.de`, `www.orthopaedische-praxis-mitte.de`}
     → Dynamic `concat("https://www.orthomitte.de", http.request.uri.path)`, **301**, Query-String erhalten.
3. Testen: `curl -sI https://www.orthopaedische-praxis-mitte.de/hypermobilität` → 301 →
   `https://www.orthomitte.de/hypermobilit%C3%A4t` → 200.
4. E-Mail-Test wie in Phase 3.
5. **Weiterleitungen dauerhaft bestehen lassen** (Domain nicht kündigen! Google empfiehlt mindestens
   1 Jahr, besser unbefristet – Backlinks, Lesezeichen, gedruckte Materialien).

## 7. Phase 5 – Google & Verzeichnisse (SEO)

| ✔ | Schritt |
|---|---|
| ☐ | Search Console: Property **`orthomitte.de`** als *Domain-Property* hinzufügen (TXT-Eintrag in Cloudflare-DNS). |
| ☐ | Sitemap einreichen: `https://www.orthomitte.de/sitemap-index.xml` |
| ☐ | **Adressänderungstool** (Search Console → alte Property `orthopaedische-praxis-mitte.de` → Einstellungen → Adressänderung) → Ziel `orthomitte.de`. Voraussetzungen: beide Properties bestätigt, 301-Weiterleitungen aktiv (Phase 4). |
| ☐ | URL-Prüfung für Startseite und 3–5 wichtige Seiten → „Indexierung beantragen“. |
| ☐ | **Google Unternehmensprofil** (Google Maps): Website-Link auf `https://www.orthomitte.de/` ändern. |
| ☐ | **Doctolib-Profil**, Jameda, Arztverzeichnisse, KV-Arztsuche, Instagram-Bio, E-Mail-Signaturen, Briefpapier/Visitenkarten (nach und nach) auf www.orthomitte.de umstellen. |
| ☐ | 2–4 Wochen beobachten: Search Console → *Seiten* (Indexierung), *Leistung* (Klicks), 404-Fehler. |

Was technisch bereits erledigt ist: identische Pfade, 301 für alle entfallenen Seiten (`public/_redirects`),
Canonical-Tags auf `https://www.orthomitte.de/…`, Sitemap, `robots.txt`, strukturierte Daten
(MedicalClinic, Öffnungszeiten, Adresse, Breadcrumbs), individuelle Titel und Beschreibungen,
`noindex` für alle Vorschau-Adressen (`*.workers.dev`).

## 8. Phase 6 – Wix abschalten

Frühestens **4 Wochen** nach Phase 4, wenn Google die neue Domain indexiert hat:
1. Wix → Domain-Verbindung trennen (betrifft nur Wix, DNS liegt bereits bei Cloudflare).
2. Wix-Premium-Abo kündigen (Laufzeit/Kündigungsfrist beachten), Wix-Site ggf. unveröffentlichen.

## 9. Rechtliche Überarbeitung (Stand 28.10.2026) und verbleibende Punkte

Auf Wunsch der Praxis wurden Impressum, Datenschutzerklärung und Werbeaussagen überarbeitet
(keine Rechtsberatung – abschließende Prüfung durch Fachanwalt für Medizinrecht empfohlen).

**Erledigt**

| Thema | Umsetzung |
|---|---|
| Impressum | Neu nach § 5 DDG: BAG, Berufsangaben (Kammer, KV, Berufsordnung), Verbraucherstreitbeilegung (§ 36 VSBG), Haftung, medizinischer Hinweis. |
| Datenschutzerklärung | Neu: Cloudflare-Hosting, keine Cookies/kein Tracking, E-Mail (Strato), OpenStreetMap (Zwei-Klick, § 25 TDDDG), Doctolib, SM-Clinic, 116117, Instagram, Rechte, Aufsichtsbehörde BlnBDI. |
| HWG § 12 | COVID-19/Post-Covid, Herpes Zoster, Krebs-/Tumorbezüge aus Werbetexten entfernt. |
| HWG § 3 (Irreführung) | Wirkversprechen neutralisiert („sofort spürbar“, „effektiver als Tabletten“, „vollkommen sicher“, „Anti-Aging“, „Entgiftungsmeister“, „nicht dauerhaft behandelbar ohne …“ u. a.). Chelattherapie: nur noch nachgewiesene Schwermetallvergiftung als anerkannte Indikation. |
| Komplementärmedizin | Frontmatter-Feld `komplementaer: true` blendet auf 16 Leistungs- und 7 Info-Seiten einen Hinweis ein (Wirksamkeit nicht für alle Anwendungsgebiete belegt). Alle Leistungs-/Info-Seiten tragen zusätzlich einen allgemeinen medizinischen Hinweis (`MedizinischerHinweis.astro`). |
| HWG § 10 / Markennamen | ProcCluster®, Dekristol®, Phyto C®, Vagusvit®, Amitriptylin entfernt bzw. durch Wirkstoff-/Gattungsbegriffe ersetzt. |
| UWG | Vergleich „6000 statt 2000 Impulse bei anderen Anbietern“, „bestmögliche Qualität zu fairen Konditionen“ entfernt. |
| Berufsbezeichnung | dr. Landenberger: „Ärztin in Weiterbildung für Allgemeinmedizin, Schwerpunkt Funktionelle Medizin“. |
| Osteopathie | Geklärt: Herr Giesker behandelt auf ärztliche Anordnung (Delegation) – im Profil und auf der Seite Privatpraxis vermerkt. |
| Go-Live-Sperre | `npm run build:production` bricht ab, solange Platzhalter „BITTE ERGÄNZEN“ existieren (`scripts/golive-check.mjs`). |

**Noch von der Praxis zu ergänzen bzw. zu entscheiden (vor Go-Live)**

| Priorität | Thema | Detail |
|---|---|---|
| **hoch** | Impressum-Platzhalter | Geltungsbereich der Berufshaftpflicht (Versicherer: Deutsche Ärzteversicherung AG, eingetragen). Geklärt: BAG (kein Registereintrag angegeben – falls doch Partnerschaftsgesellschaft, Register ergänzen), Privatpraxis ist Teil der BAG, keine USt-IdNr. |
| mittel | Datenschutz | AV-Verträge mit Cloudflare, Strato, SoftX ITS (SM-Clinic) prüfen. Geklärt: SM-Clinic-Anbieter eingetragen, Privatpraxis = BAG, kein Datenschutzbeauftragter benannt. |
| **hoch** | Paketpreise / Rabatte | „600 € bei Buchung von 4 Terminen“, „5er-Kur 550 €“: Pauschal- bzw. Rabattpreise sind mit der GOÄ (Einzelabrechnung) und § 7 HWG (Zuwendungen) schwer vereinbar → anwaltlich prüfen; ggf. auf GOÄ-Einzelpreise umstellen. |
| mittel | Procain-/Eiseninfusion | Verschreibungspflichtige Arzneimittel: Seiten beschreiben nur das Verfahren (ohne Präparatenamen). Bitte so beibehalten. |
| niedrig | Preise | Widersprüchliche Preisangaben (CONTENT-INVENTORY.md, Abschnitt 8) vereinheitlichen. |
| niedrig | Bildrechte | Nutzungsrechte und Einwilligungen für alle übernommenen Fotos bestätigen; hEDS-Checkliste (PDF): Urheber/Erlaubnis. |

## 10. Offene Fragen an die Praxis

1. ~~Team: Susanne Koop / Freia de Vries~~ – geklärt: nicht mehr in der Praxis (Profile weitergeleitet, Texte archiviert).
2. **Vivien Zahn:** Foto und Lebenslauf vorhanden?
3. **Eiseninfusion:** eigener Text gewünscht? (bisherige Seite enthielt Procain-Text)
4. **Preise:** Welche Procain-Preise (120/550 € oder 150/650 €) und welcher Energy-&-Balance-Paketpreis (575 € oder 600 €) gelten?
5. ~~Arzt-Direkt~~ – geklärt: wird nicht mehr genutzt, Verweise auf Doctolib umgestellt.
6. **ÖPNV-Angaben:** Welche Linienliste ist korrekt (Startseite vs. Anfahrt)?
7. **Corona-Seite:** endgültig entfernen (derzeit Weiterleitung auf Impfungen)?
8. **Ohrakupunktur:** Seite war leer – eigener Text gewünscht?
9. ~~Kontaktformular~~ – geklärt: es gibt kein Kontaktformular mehr.
10. **SPF-Eintrag** für die E-Mail-Zustellbarkeit ergänzen (Abschnitt 4.5)?

## 11. Rückweg (Rollback)

- Website-Fehler: Cloudflare → Workers → Deployments → Rollback (sofort).
- Grundsätzliches Problem nach Phase 3/4: Bei Strato die Nameserver wieder auf die alten Werte setzen
  (`docks08.rzone.de`/`shades05.rzone.de` bzw. `docks12.rzone.de`/`shades18.rzone.de`). Die Strato-Zonen
  bleiben dort erhalten; nach Verbreitung (bis 24 h) ist der alte Zustand wiederhergestellt – deshalb
  Wix erst in Phase 6 kündigen.
