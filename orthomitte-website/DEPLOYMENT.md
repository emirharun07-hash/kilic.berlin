# DEPLOYMENT.md – GitHub & Cloudflare

Diese Anleitung erklärt Schritt für Schritt, wie die Website über GitHub verwaltet und über
Cloudflare veröffentlicht wird. Sie ist so geschrieben, dass sie ohne technisches Vorwissen
nachvollziehbar ist. **Kein Schritt in dieser Anleitung verändert Ihre bestehende Wix-Website,
Ihre Domains oder Ihre E-Mails** – das passiert erst in MIGRATION.md und nur nach Ihrer Freigabe.

---

## 1. Warum Cloudflare Workers (und nicht Cloudflare Pages)?

Cloudflare bietet zwei Produkte für Websites an. Die offizielle Cloudflare-Dokumentation empfiehlt
seit 2025 für **neue Projekte ausdrücklich Workers** („Start new projects with Workers“), weil Workers
Cloudflares Hauptplattform ist und Pages-Funktionen dort zusammengeführt werden.

Für diese Website bedeutet das:

| Eigenschaft | Lösung |
|---|---|
| Statische Seiten (HTML, CSS, Bilder) | **Workers Static Assets** – das Ausliefern statischer Dateien ist kostenlos und unbegrenzt |
| Serverseitige Funktionen | **keine** (nicht nötig → keine Kosten, keine Angriffsfläche) |
| Weiterleitungen alter URLs | Datei `public/_redirects` (wird von Workers nativ unterstützt) |
| Sicherheits-Header | Datei `public/_headers` |
| Automatische Builds aus GitHub | **Workers Builds** (in Cloudflare integriert) |
| Vorschau vor Veröffentlichung | **Preview URLs** (`…workers.dev`) für jeden Nicht-Produktions-Branch |
| Kosten | Free-Plan genügt (statische Anfragen sind kostenlos) |

Einzige Voraussetzung von Workers: Die Domain muss für die eigene Domain-Anbindung bei Cloudflare
als **Zone** verwaltet werden (Nameserver bei Cloudflare). Das ist ohnehin nötig, damit
`orthomitte.de` (ohne www) und die alte Domain sauber per 301 weitergeleitet werden können –
Details und sichere Reihenfolge in **MIGRATION.md**.

## 2. Branch-Modell (Produktion und Entwicklung)

| Branch | Zweck | Was passiert bei Änderungen? |
|---|---|---|
| `main` | **Produktion** – das, was auf www.orthomitte.de zu sehen ist | Cloudflare baut und veröffentlicht automatisch |
| `develop` | **Entwicklung/Vorschau** | Tests laufen, Cloudflare erstellt eine Vorschau-URL – nichts geht live |
| `feature/…` (optional) | einzelne größere Änderungen | Pull Request nach `develop` |

Ablauf jeder Änderung:

1. Claude Code setzt die Änderung **lokal** um und führt `npm test` aus.
2. Commit + Push auf `develop` (oder Feature-Branch).
3. **GitHub Actions** führt automatisch `npm test` aus (Workflow `.github/workflows/orthomitte-website-ci.yml`).
4. **Cloudflare Workers Builds** lädt eine Vorschau-Version hoch und zeigt die **Vorschau-URL**
   im Cloudflare-Dashboard und als Status am Commit/Pull Request in GitHub.
5. **Sie prüfen die Vorschau** im Browser (auch auf dem Smartphone).
6. Freigabe: Pull Request `develop → main` öffnen und mergen (oder Claude Code bitten:
   „Bitte veröffentliche die freigegebene Version“ – Claude Code mergt **nur** nach Ihrer
   ausdrücklichen Freigabe).
7. Cloudflare veröffentlicht `main` automatisch auf www.orthomitte.de.

### Branchschutz in GitHub einrichten (einmalig, empfohlen)

GitHub → Repository → **Settings → Branches → Add branch ruleset**:
- Ziel: `main`
- „Require a pull request before merging“ ✔
- „Require status checks to pass“ ✔ → Check **„Website orthomitte – Tests / test“** auswählen
- „Block force pushes“ ✔

So kann nichts ungetestet oder ohne Pull Request in die Produktion gelangen.

## 3. Repository vorbereiten

Das Projekt liegt derzeit im Ordner `orthomitte-website/` des Repositorys
`emirharun07-hash/azur-shopify-theme` (Branch `claude/stoic-ptolemy-u6an31`).

**Empfehlung:** Für den Dauerbetrieb ein **eigenes Repository** `orthomitte-website` anlegen
(privat). Das hält die Website sauber von anderen Projekten getrennt. Vorgehen:

```bash
# 1. Auf github.com ein neues, PRIVATES Repository "orthomitte-website" anlegen (ohne README).
# 2. Projektordner mit Historie übertragen:
git clone https://github.com/emirharun07-hash/azur-shopify-theme.git tmp-export
cd tmp-export
git checkout claude/stoic-ptolemy-u6an31
git subtree split --prefix=orthomitte-website -b website-export
git push https://github.com/<IHR-KONTO>/orthomitte-website.git website-export:main
git push https://github.com/<IHR-KONTO>/orthomitte-website.git website-export:develop
```

Danach die Workflow-Datei `.github/workflows/orthomitte-website-ci.yml` in das neue Repository
übernehmen und dort `working-directory`, `paths` und `node-version-file` auf das Wurzelverzeichnis
anpassen (Claude Code kann das übernehmen: „Passe den CI-Workflow für das eigene Repository an“).

Bleibt das Projekt im bestehenden Repository, funktioniert alles ebenso – in Cloudflare wird dann
als **Root directory** `orthomitte-website` eingetragen.

## 4. Cloudflare einrichten (einmalig)

1. Cloudflare-Konto anlegen (https://dash.cloudflare.com/sign-up), Free-Plan genügt.
   Zwei-Faktor-Authentisierung aktivieren (**My Profile → Authentication**).
2. **Workers & Pages → Create → Import a repository** → GitHub verbinden
   (nur Zugriff auf das Website-Repository gewähren).
3. Einstellungen:

   | Feld | Wert |
   |---|---|
   | Project name | `orthomitte-website` (muss zu `name` in `wrangler.jsonc` passen) |
   | Production branch | `main` |
   | Build command | `npm run build:production` (bricht ab, solange Platzhalter „BITTE ERGÄNZEN“ in Impressum/Datenschutz stehen) |
   | Deploy command | `npx wrangler deploy` |
   | Non-production build command | `npm run build` (Vorschau darf Platzhalter enthalten) |
   | Non-production branch deploy command | `npx wrangler versions upload` |
   | Root directory | `/` (eigenes Repo) bzw. `orthomitte-website` (Unterordner) |
   | Builds for non-production branches | **aktiviert** |
   | Umgebungsvariable | `NODE_VERSION` = `22` |

4. Speichern → Cloudflare baut den ersten Stand. Die Website ist danach unter
   `https://orthomitte-website.<ihr-konto>.workers.dev` erreichbar – **das ist Ihre
   Vorschauadresse**; die Hauptdomain ist davon noch nicht betroffen.
5. Vorschau-URLs je Branch: in **Settings → Domains & Routes** ist „Preview URLs“ aktiv
   (in `wrangler.jsonc` mit `"preview_urls": true` vorkonfiguriert). Jede Version aus `develop`
   erhält eine eigene URL der Form `https://<version>-orthomitte-website.<konto>.workers.dev`.
   Alle `workers.dev`-Adressen senden automatisch `X-Robots-Tag: noindex` (siehe `public/_headers`),
   damit Google keine Vorschauen indexiert.
6. Optional: Vorschauen mit **Cloudflare Access** (kostenlos bis 50 Nutzer) schützen:
   *Zero Trust → Access → Applications → Add → Self-hosted*, Domain `*.orthomitte-website.<konto>.workers.dev`,
   Regel „E-Mail endet auf @orthomitte.de“.

> **Stand 28.10.2026 (eingerichtet):** Cloudflare-Projekt `orthomitte-website` ist mit
> `emirharun07-hash/azur-shopify-theme` verbunden. Produktions-Branch vorerst
> `claude/stoic-ptolemy-u6an31` (nach Freigabe auf `main` umstellen), Stammverzeichnis
> `orthomitte-website`, Build `npm run build:production`, Deploy `npx wrangler deploy`,
> Build-Variable `NODE_VERSION=22`. Hinweis: „Build erneut versuchen“ baut immer denselben
> (alten) Commit/Branch – nach Änderung des Branches einen neuen Commit pushen.

## 5. Eigene Domain verbinden (erst NACH Freigabe – siehe MIGRATION.md)

Wenn die Zone `orthomitte.de` in Cloudflare aktiv ist:
Workers → `orthomitte-website` → **Settings → Domains & Routes → Add → Custom domain** →
`www.orthomitte.de`. Cloudflare legt DNS-Eintrag und SSL-Zertifikat automatisch an.
Die Weiterleitungen `orthomitte.de → www.orthomitte.de` und
`orthopaedische-praxis-mitte.de → www.orthomitte.de` werden als **Redirect Rules** eingerichtet
(Anleitung in MIGRATION.md, Abschnitt 5).

## 6. Manuelles Deployment (Notfall, ohne GitHub)

```bash
npx wrangler login                 # einmalig, öffnet Browser-Anmeldung
npm run deploy:preview             # lädt eine Vorschau-Version hoch (geht NICHT live)
npm run deploy:production          # veröffentlicht – nur nach ausdrücklicher Freigabe!
```

## 7. Zurückrollen (Rollback)

Fehlerhafte Version online? Zwei Wege:
- **Cloudflare Dashboard** → Workers → `orthomitte-website` → **Deployments** → frühere Version →
  „Rollback“ (wirkt sofort).
- **Git:** `git revert <commit>` auf `main` → Cloudflare veröffentlicht den korrigierten Stand.

## 8. Laufende Kosten

| Posten | Kosten |
|---|---|
| Cloudflare Workers (Free) inkl. Static Assets, SSL, CDN, DDoS-Schutz | 0 € |
| Cloudflare DNS | 0 € |
| GitHub (privates Repository, Actions-Minuten im Free-Kontingent) | 0 € |
| Domain-Registrierung (bleibt beim bisherigen Anbieter Strato) | unverändert |
| Wix-Abo | kann nach erfolgreicher Umstellung gekündigt werden (Kündigungsfrist beachten) |
