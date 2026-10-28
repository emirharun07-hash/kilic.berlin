/**
 * Sprechzeiten
 * ------------
 * Änderungen an den regulären Sprechzeiten NUR hier vornehmen.
 * Jede Zeile = ein Wochentag. `zeiten` enthält 0–n Zeitfenster ("08:00–12:00").
 * Ein leeres Array bedeutet "geschlossen".
 *
 * `schemaOrg` wird automatisch für die strukturierten Daten (Google) erzeugt –
 * es genügt, die Zeiten unten zu pflegen.
 */

export interface Sprechzeit {
  tag: string;
  kurz: string;
  /** schema.org-Wochentag, nicht ändern */
  schemaTag: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  zeiten: string[];
}

export const sprechzeiten: Sprechzeit[] = [
  { tag: 'Montag', kurz: 'Mo', schemaTag: 'Monday', zeiten: ['08:00–12:00', '14:00–18:00'] },
  { tag: 'Dienstag', kurz: 'Di', schemaTag: 'Tuesday', zeiten: ['08:00–12:00', '14:00–18:00'] },
  { tag: 'Mittwoch', kurz: 'Mi', schemaTag: 'Wednesday', zeiten: ['08:00–12:00', '14:00–18:00'] },
  { tag: 'Donnerstag', kurz: 'Do', schemaTag: 'Thursday', zeiten: ['08:00–12:00', '14:00–18:00'] },
  { tag: 'Freitag', kurz: 'Fr', schemaTag: 'Friday', zeiten: ['08:00–12:00'] },
];

/** Kurzer Hinweis unter der Tabelle (optional, leer lassen = kein Hinweis) */
export const sprechzeitenHinweis = 'Wir arbeiten mit Terminvergabe. Akuttermine nur telefonisch am selben Tag.';

/**
 * Sprechzeiten in den Schulferien (Seite /feriensprechzeiten).
 * Stand: bisherige Website, Oktober 2026.
 */
export const feriensprechzeiten: Sprechzeit[] = [
  { tag: 'Montag', kurz: 'Mo', schemaTag: 'Monday', zeiten: ['09:00–12:00', '14:00–17:00'] },
  { tag: 'Dienstag', kurz: 'Di', schemaTag: 'Tuesday', zeiten: ['08:00–12:00', '14:00–16:00'] },
  { tag: 'Mittwoch', kurz: 'Mi', schemaTag: 'Wednesday', zeiten: ['08:00–12:00', '14:00–17:00'] },
  { tag: 'Donnerstag', kurz: 'Do', schemaTag: 'Thursday', zeiten: ['08:00–12:00', '14:00–15:00'] },
  { tag: 'Freitag', kurz: 'Fr', schemaTag: 'Friday', zeiten: [] },
];

/** Erzeugt openingHoursSpecification für schema.org */
export function sprechzeitenSchema() {
  return sprechzeiten.flatMap((s) =>
    s.zeiten.map((z) => {
      const [opens, closes] = z.split('–');
      return { '@type': 'OpeningHoursSpecification', dayOfWeek: s.schemaTag, opens, closes };
    }),
  );
}
