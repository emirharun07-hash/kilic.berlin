/**
 * Inhalte der Startseite
 * ----------------------
 * Alle Texte und Bilder der Startseite stehen hier. Die Gestaltung liegt in
 * src/pages/index.astro bzw. den Komponenten unter src/components/home/.
 *
 * Bild austauschen: neue Datei nach src/assets/images/praxis/ kopieren und den
 * Import unten anpassen. Format/Größe werden beim Build automatisch optimiert.
 *
 * Texte stammen von der bisherigen Website (Stand Oktober 2026) und wurden nur
 * sprachlich geglättet (Rechtschreibung/Zeichensetzung), nicht inhaltlich verändert.
 */
import heroBild from '@/assets/images/praxis/aerzte-arbeitsplatz-hero.jpg';
import empfang from '@/assets/images/praxis/empfang.jpg';
import wartebereich from '@/assets/images/praxis/wartebereich.jpg';
import behandlungsraum1 from '@/assets/images/praxis/behandlungsraum-1.jpg';
import behandlungsraum3 from '@/assets/images/praxis/behandlungsraum-3.jpg';
import manuelleMedizin from '@/assets/images/leistungen/manuelle-medizin.jpg';
import type { IconName } from '@/components/ui/Icon.astro';

export const hero = {
  dachzeile: 'Gesundheit, Fürsorge und Mobilität',
  titel: 'Ihr Spezialist für Orthopädie in Berlin',
  text: 'Mit Leidenschaft und Expertise suchen wir gemeinsam mit Ihnen nach der passenden Behandlung für Ihre Beschwerden – mit dem Ziel, Ihre Gesundheit und Beweglichkeit im Alltag zu fördern.',
  bild: heroBild,
  bildAlt: 'Arne Schlichting und Dr. Bülent Kılıç besprechen einen Befund am Arbeitsplatz der Praxis',
  zweiterButton: { label: 'Unsere Informationsseite', href: '/infoseite' },
};

/** Kennzahlen unter dem Hero (Angaben der bisherigen Website) */
export const kennzahlen = [
  { wert: '20+', label: 'Jahre Erfahrung' },
  { wert: '15+', label: 'Therapien' },
  { wert: '11', label: 'Mitarbeitende' },
];

export const privatpraxisHinweis = {
  text: 'Neu: Unsere Privatpraxis für Funktionelle Medizin in Berlin-Mitte',
  linkLabel: 'Mehr zur Privatpraxis',
  href: '/privatpraxis',
};

export const ueberUns = {
  dachzeile: 'Was uns ausmacht',
  titel: 'Wir sind da – für Ihre Gesundheit',
  text: 'In unserer orthopädischen Praxis setzen wir auf moderne Therapien, langjährige Erfahrung und eine individuelle Betreuung. Unser Ziel ist es, Ihre Beschwerden wirksam zu lindern und Ihre Lebensqualität zu verbessern.',
  terminHinweis: {
    titel: 'Bitte vereinbaren Sie nach Möglichkeit einen Termin für Ihren Besuch',
    text: 'Unser Anliegen ist es, unsere Patientinnen und Patienten möglichst ohne Wartezeit angemessen zu untersuchen und zu behandeln. Wir arbeiten deshalb mit Terminvergabe.',
  },
};

export const saeulen: { icon: IconName; titel: string; text: string }[] = [
  {
    icon: 'hands',
    titel: 'Ganzheitliche Behandlung',
    text: 'Wir betrachten jeden Patienten ganzheitlich und kombinieren klassische orthopädische Methoden mit innovativen Verfahren wie Manueller Medizin, Osteopathie und Körperakupunktur. So entwickeln wir individuelle Behandlungskonzepte, die auf Ihre Situation abgestimmt sind.',
  },
  {
    icon: 'stethoscope',
    titel: 'Moderne Diagnoseverfahren',
    text: 'Eine gründliche körperliche Untersuchung, Ultraschall und manualmedizinische Diagnostik bilden die Grundlage unserer Behandlung. Bei Bedarf veranlassen wir weiterführende Untersuchungen wie MRT, CT oder Laboranalysen. Ergänzend bieten wir Verfahren der Erfahrungsmedizin wie die Applied Kinesiology an.',
  },
  {
    icon: 'spine',
    titel: 'Vielseitige Therapieansätze',
    text: 'Wir bieten eine Vielzahl bewährter Behandlungsmethoden, die individuell auf Ihre Beschwerden abgestimmt sind – von klassischen orthopädischen Therapien bis hin zu spezialisierten Ansätzen wie Dry Needling, FDM und Applied Kinesiology. So lindern wir gezielt Schmerzen und verbessern Ihre Mobilität nachhaltig, bei akuten wie auch chronischen Beschwerden.',
  },
  {
    icon: 'people',
    titel: 'Erfahrenes & engagiertes Team',
    text: 'Unsere Praxis wird von zwei erfahrenen Fachärzten für Orthopädie und Unfallchirurgie geleitet und von gut ausgebildeten Assistentinnen und Assistenten unterstützt, die sich ständig weiterbilden. So gewährleisten wir Ihnen eine erstklassige Betreuung und individuelle Behandlung.',
  },
];

/** Bildergalerie "Einblicke in die Praxis" */
export const praxisBilder = [
  { bild: empfang, alt: 'Empfangstresen der Orthopädischen Praxis Mitte vor orangefarbener Wand' },
  { bild: behandlungsraum1, alt: 'Heller Behandlungsraum mit orangefarbener Behandlungsliege' },
  { bild: wartebereich, alt: 'Ruhiger, lichtdurchfluteter Wartebereich' },
  { bild: behandlungsraum3, alt: 'Behandlungsraum mit Liege und anatomischen Lehrtafeln' },
];

export const leistungsTeaser = {
  dachzeile: 'Unsere Leistungen',
  titel: 'Was wir behandeln',
  bild: manuelleMedizin,
  bildAlt: 'Arzt der Orthopädischen Praxis Mitte bei einer manualmedizinischen Behandlung des Rückens',
};
