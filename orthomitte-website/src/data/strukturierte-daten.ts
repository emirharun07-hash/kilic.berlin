/**
 * Strukturierte Daten (schema.org / JSON-LD) für Google.
 * Werden automatisch aus praxis.ts und oeffnungszeiten.ts erzeugt.
 * Hier keine Bewertungen, Preise oder medizinischen Versprechen ergänzen.
 */
import { praxis } from './praxis';
import { sprechzeitenSchema } from './oeffnungszeiten';

const SITE = 'https://www.orthomitte.de';

export function praxisSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': `${SITE}/#praxis`,
    name: praxis.name,
    url: `${SITE}/`,
    logo: `${SITE}/logo.png`,
    image: `${SITE}/og-praxis.jpg`,
    telephone: praxis.telefon.link,
    email: praxis.email,
    medicalSpecialty: ['Musculoskeletal'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${praxis.adresse.strasse} (${praxis.adresse.zusatz})`,
      postalCode: praxis.adresse.plz,
      addressLocality: praxis.adresse.ort,
      addressRegion: 'Berlin',
      addressCountry: praxis.adresse.land,
    },
    geo: { '@type': 'GeoCoordinates', latitude: praxis.geo.lat, longitude: praxis.geo.lng },
    openingHoursSpecification: sprechzeitenSchema(),
    areaServed: { '@type': 'City', name: 'Berlin' },
  };
}

/** Brotkrumen-Navigation für Unterseiten */
export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.href, SITE).href,
    })),
  };
}

/** Profilseite einer Ärztin / eines Arztes – nur belegte Angaben */
export function personSchema(p: { name: string; rolle: string; url: string; bild?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.name,
    jobTitle: p.rolle,
    url: new URL(p.url, SITE).href,
    ...(p.bild ? { image: new URL(p.bild, SITE).href } : {}),
    worksFor: { '@id': `${SITE}/#praxis` },
  };
}
