/**
 * Inhaltssammlungen (Content Collections)
 * ---------------------------------------
 * Jede Markdown-Datei in den folgenden Ordnern wird automatisch zu einer eigenen Unterseite:
 *
 *   src/content/leistungen/*.md   -> medizinische Leistungen / Behandlungen
 *   src/content/team/*.md         -> Ärztinnen, Ärzte und Mitarbeitende (Profilseiten)
 *   src/content/seiten/*.md       -> allgemeine Info-Seiten (z. B. Rückenschmerzen, Vitamin D)
 *
 * Die URL einer Seite steht im Feld `url` (ohne führenden Schrägstrich), damit die
 * bisherigen Wix-Adressen exakt erhalten bleiben. Das Schema unten prüft beim Build,
 * dass alle Pflichtfelder gesetzt sind – fehlerhafte Dateien brechen den Build ab.
 */
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const seo = z
  .object({
    /** Seitentitel für Google (ca. 50–60 Zeichen). Ohne Praxisname – der wird automatisch angehängt. */
    title: z.string().optional(),
    /** Meta-Description (ca. 120–160 Zeichen). */
    description: z.string().optional(),
    /** true = Seite nicht in Suchmaschinen aufnehmen */
    noindex: z.boolean().default(false),
  })
  .default({ noindex: false });

const urlField = z
  .string()
  .regex(/^[^/].*[^/]$|^[^/]$/, 'url ohne führenden oder abschließenden Schrägstrich angeben, z. B. "akupunktur"');

const leistungen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/leistungen' }),
  schema: ({ image }) =>
    z.object({
      titel: z.string(),
      url: urlField,
      /** Kassen-/Orthopädie-Bereich oder Privatpraxis für Funktionelle Medizin */
      bereich: z.enum(['orthopaedie', 'funktionelle-medizin']),
      /** Gruppierung auf den Übersichtsseiten – Werte siehe src/data/leistungsbereiche.ts */
      kategorie: z.string(),
      kurzbeschreibung: z.string(),
      bild: image().optional(),
      bildAlt: z.string().optional(),
      reihenfolge: z.number().default(100),
      /** false = Seite existiert, wird aber nicht in Übersichten angezeigt */
      inUebersicht: z.boolean().default(true),
      /**
       * true = Methode der Komplementär-/Erfahrungsmedizin bzw. ohne gesicherten Wirksamkeitsnachweis
       * für alle genannten Anwendungsgebiete. Blendet einen Pflichthinweis ein (§ 3 HWG, Irreführungsschutz).
       */
      komplementaer: z.boolean().default(false),
      seo,
    }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      /** z. B. "Facharzt für Orthopädie und Unfallchirurgie" – nur belegte Angaben eintragen */
      rolle: z.string(),
      gruppe: z.enum(['aerzte', 'therapie', 'team']),
      url: urlField.optional(),
      foto: image().optional(),
      fotoAlt: z.string().optional(),
      /** Kurzer Einleitungssatz für Übersichten (optional) */
      kurzprofil: z.string().optional(),
      email: z.email().optional(),
      schwerpunkte: z.array(z.string()).default([]),
      reihenfolge: z.number().default(100),
      /** true = erscheint in der Teamleiste auf der Startseite */
      zeigeAufStartseite: z.boolean().default(false),
      seo,
    }),
});

const seiten = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/seiten' }),
  schema: ({ image }) =>
    z.object({
      titel: z.string(),
      url: urlField,
      einleitung: z.string().optional(),
      /** Autorenzeile über dem Artikel, z. B. "Dr. Bülent Kılıç · Facharzt für Orthopädie und Unfallchirurgie" (optional) */
      autor: z.string().optional(),
      bild: image().optional(),
      bildAlt: z.string().optional(),
      /** Kleines Bild für die Karte auf der Übersicht /infoseite (optional, sonst wird `bild` verwendet) */
      vorschaubild: image().optional(),
      vorschaubildAlt: z.string().optional(),
      /** Rubrik für Brotkrumen-Navigation, z. B. "Patienteninformationen" */
      rubrik: z.enum(['Patienteninformationen', 'Praxis', 'Privatpraxis', 'Rechtliches']).default('Patienteninformationen'),
      verwandteLeistungen: z.array(reference('leistungen')).default([]),
      /**
       * true = Methode der Komplementär-/Erfahrungsmedizin bzw. ohne gesicherten Wirksamkeitsnachweis
       * für alle genannten Anwendungsgebiete. Blendet einen Pflichthinweis ein (§ 3 HWG, Irreführungsschutz).
       */
      komplementaer: z.boolean().default(false),
      seo,
    }),
});

export const collections = { leistungen, team, seiten };
