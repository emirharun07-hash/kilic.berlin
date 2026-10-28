/**
 * Praxisteam ohne eigene Profilseite (Vornamen, wie auf der bisherigen Website).
 * ---------------------------------------------------------------------------
 * Ärztinnen, Ärzte und Therapeuten mit Profil stehen als Markdown-Dateien in src/content/team/.
 * Neue Mitarbeiterin ohne Profil: Namen einfach in die passende Liste eintragen.
 * Stand: Seite "Über uns" der bisherigen Website (Oktober 2026).
 */
export const praxisteam: { gruppe: string; rolle?: string; namen: string[] }[] = [
  { gruppe: 'Arzthelferinnen / MFA', rolle: 'Arzthelferin', namen: ['Rebecca', 'Stefanie', 'Sharona'] },
  { gruppe: 'Auszubildende zur MFA', namen: ['Ejona'] },
  { gruppe: '(Studentische) Aushilfskräfte', namen: ['Abdul', 'Jolina', 'Fabio', 'Furkan', 'Hamza', 'Manja'] },
];
