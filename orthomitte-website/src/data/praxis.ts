/**
 * Stammdaten der Praxis
 * ---------------------
 * Name, Adresse, Telefon, E-Mail und Terminbuchung werden NUR hier gepflegt.
 * Header, Footer, Kontaktseite, Anfahrt und die strukturierten Daten für Google
 * lesen ihre Angaben automatisch aus dieser Datei.
 */

export const praxis = {
  name: 'Orthopädische Praxis Mitte',
  kurzname: 'Ortho Praxis Mitte',
  untertitel: 'Orthopädie · Unfallchirurgie · Funktionelle Medizin',
  adresse: {
    strasse: 'Dorotheenstraße 56',
    zusatz: '2. OG',
    plz: '10117',
    ort: 'Berlin',
    bezirk: 'Berlin-Mitte',
    land: 'DE',
  },
  /** Koordinaten für Kartenlinks und strukturierte Daten */
  geo: { lat: 52.5184, lng: 13.3875 },
  telefon: {
    anzeige: '030 2292958',
    link: '+49302292958',
  },
  fax: '030 20671604',
  email: 'mail@orthomitte.de',
  /** Externe Terminbuchung (Doctolib). Wird überall über <BookingButton> verlinkt. */
  terminbuchung: {
    anbieter: 'Doctolib',
    url: 'https://www.doctolib.de/gemeinschaftspraxis/berlin/orthopaedische-praxis-mitte-buelent-kilic',
    /** Nachricht an die Praxis über Doctolib (ersetzt ein eigenes Kontaktformular) */
    nachrichtUrl: 'https://www.doctolib.de/gemeinschaftspraxis/berlin/orthopaedische-praxis-mitte-buelent-kilic/patient-request',
  },
  /**
   * Akuttermine über den Terminservice der Kassenärztlichen Vereinigung (116117).
   * Der Link führt zum "Patienten-Navi" mit der Praxis-Kennung (aus dem bisherigen Wix-Widget).
   */
  akuttermin: {
    telefonAnzeige: '116117',
    telefonLink: '116117',
    patientenNavi: 'https://patientennavi.116117.de/api/meinarzt/686fce00-d8ea-48bd-9f7c-c34340573b80',
  },
  /** Digitaler Anamnesebogen (externer Anbieter SM-Clinic) */
  anamnesebogen: {
    anbieter: 'SM-Clinic',
    url: 'https://www.sm-clinic.de/app/orthomitte/index.php?cl_name=orthomitte&lang=DE',
  },
  /**
   * Öffentliche Verkehrsmittel (Haltestelle Friedrichstraße).
   * Quelle: Startseite der bisherigen Website. Die alte Anfahrt-Seite nannte teils andere
   * Linien (siehe CONTENT-INVENTORY.md) – bitte bei Gelegenheit prüfen.
   */
  verkehr: [
    { art: 'U-Bahn', linien: 'U6', farbe: '#115d91' },
    { art: 'S-Bahn', linien: 'S1, S2, S3, S5, S7, S9, S25, S26', farbe: '#2a7a3b' },
    { art: 'Regionalverkehr', linien: 'RB10, RB14, RB23, RE1, RE2, RE7', farbe: '#b22222' },
    { art: 'Tram', linien: 'M1, 12', farbe: '#c2441a' },
    { art: 'Bus', linien: '147, 245, N5, N6', farbe: '#7a2e83' },
  ],
  karten: {
    google: 'https://www.google.com/maps/search/?api=1&query=Orthop%C3%A4dische+Praxis+Mitte+Dorotheenstra%C3%9Fe+56+10117+Berlin',
    apple: 'https://maps.apple.com/?q=Orthop%C3%A4dische+Praxis+Mitte&address=Dorotheenstra%C3%9Fe+56,10117+Berlin',
    osmEmbed:
      'https://www.openstreetmap.org/export/embed.html?bbox=13.3815%2C52.5158%2C13.3935%2C52.5210&layer=mapnik&marker=52.5184%2C13.3875',
  },
} as const;

export type Praxis = typeof praxis;
