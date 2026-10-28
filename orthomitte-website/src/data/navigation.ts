/**
 * Navigation
 * ----------
 * Hauptmenü (Kopfzeile), Footer-Spalten und rechtliche Links.
 * Neue Unterseite ins Menü aufnehmen = hier einen Eintrag ergänzen.
 * `href` immer als interner Pfad ohne Domain und ohne abschließenden Schrägstrich.
 */

export interface NavLink {
  label: string;
  href: string;
  beschreibung?: string;
}
export interface NavEintrag extends NavLink {
  kinder?: NavLink[];
}

export const hauptmenue: NavEintrag[] = [
  {
    label: 'Praxis',
    href: '/überuns',
    kinder: [
      { label: 'Über uns', href: '/überuns', beschreibung: 'Unsere Praxis, unser Ansatz und unser Team' },
      { label: 'Ärztinnen & Ärzte', href: '/aerzte', beschreibung: 'Profile und Lebensläufe' },
      { label: 'Anfahrt', href: '/anfahrt', beschreibung: 'Dorotheenstraße 56, nahe Bahnhof Friedrichstraße' },
    ],
  },
  {
    label: 'Leistungen',
    href: '/leistungen',
    kinder: [
      { label: 'Orthopädie & Unfallchirurgie', href: '/leistungen', beschreibung: 'Diagnostik und Therapie des Bewegungsapparates' },
      { label: 'Privatpraxis Funktionelle Medizin', href: '/privatpraxis', beschreibung: 'Ganzheitliche, funktionelle Medizin' },
    ],
  },
  {
    label: 'Patienteninfo',
    href: '/infoseite',
    kinder: [
      { label: 'Informationsseite', href: '/infoseite', beschreibung: 'Wissenswertes für Patientinnen und Patienten' },
      { label: 'Anamnesebogen', href: '/anamnese', beschreibung: 'Vor dem ersten Termin online ausfüllen' },
      { label: 'Termine', href: '/termine', beschreibung: 'Terminvereinbarung und Hinweise' },
    ],
  },
  { label: 'Kontakt', href: '/kontaktformular' },
];

export const footerSpalten: { titel: string; links: NavLink[] }[] = [
  {
    titel: 'Praxis',
    links: [
      { label: 'Über uns', href: '/überuns' },
      { label: 'Ärztinnen & Ärzte', href: '/aerzte' },
      { label: 'Leistungen', href: '/leistungen' },
      { label: 'Privatpraxis', href: '/privatpraxis' },
    ],
  },
  {
    titel: 'Service',
    links: [
      { label: 'Informationsseite', href: '/infoseite' },
      { label: 'Anamnesebogen', href: '/anamnese' },
      { label: 'Anfahrt', href: '/anfahrt' },
      { label: 'Kontakt', href: '/kontaktformular' },
    ],
  },
];

export const rechtlicheLinks: NavLink[] = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
];
