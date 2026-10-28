/** Rubriken für Info-Seiten (Feld `rubrik` in src/content/seiten/*.md) – steuert Dachzeile und Brotkrumen. */
export const rubriken = {
  Patienteninformationen: { name: 'Patienteninformationen', href: '/infoseite' },
  Praxis: { name: 'Praxis', href: '/überuns' },
  Privatpraxis: { name: 'Privatpraxis Funktionelle Medizin', href: '/privatpraxis' },
  Rechtliches: { name: 'Rechtliches', href: '' },
} as const;
