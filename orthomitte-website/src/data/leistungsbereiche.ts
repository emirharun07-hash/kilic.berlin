/**
 * Leistungsbereiche (Gruppierung der Leistungen)
 * ----------------------------------------------
 * Jede Leistung in src/content/leistungen/*.md hat ein Feld `kategorie`,
 * das einer `id` unten entsprechen muss. Die Texte stammen von der bisherigen Startseite.
 */
import type { IconName } from '@/components/ui/Icon.astro';

export interface Leistungsbereich {
  id: string;
  titel: string;
  icon: IconName;
  text: string;
}

export const leistungsbereiche: Leistungsbereich[] = [
  {
    id: 'diagnose',
    titel: 'Diagnose & Analyse',
    icon: 'stethoscope',
    text: 'Mit der Manuellen Medizin ertasten wir Funktionsstörungen des Bewegungsapparates, die Stoßwellentherapie hilft bei der Lokalisierung und Behandlung schmerzhafter Strukturen, und durch Applied Kinesiology/IRT analysieren wir muskuläre und neurologische Dysbalancen. So erhalten wir eine präzise Grundlage für Ihre individuelle Therapie.',
  },
  {
    id: 'therapie',
    titel: 'Therapeutische & funktionelle Behandlung',
    icon: 'hands',
    text: 'In der Therapie setzen wir unter anderem auf das Fasziendistorsionsmodell (FDM), sensomotorische Einlagen, Akupunktur und Neuraltherapie. Ziel dieser Methoden ist es, die Beweglichkeit zu verbessern, Verspannungen zu lösen, die Körperstatik zu unterstützen und Schmerzen zu lindern.',
  },
  {
    id: 'regeneration',
    titel: 'Regeneration & Prävention',
    icon: 'leaf',
    text: 'Zur Unterstützung der Regeneration und Gesundheitsvorsorge setzen wir auf Infusionstherapie, Vitamin-D-Therapie, Orthomolekulare Medizin und Tapen. Diese Maßnahmen können – etwa bei einem Nährstoffmangel – Regeneration und Muskulatur unterstützen.',
  },
  {
    id: 'spezial',
    titel: 'Spezielle Behandlungsmethoden',
    icon: 'sparkle',
    text: 'Wir bieten gezielte Verfahren wie Dry Needling, Neuraltherapie, Hyaluronsäurebehandlungen und FDM, mit dem Ziel, chronische Schmerzen zu lindern und die Funktion betroffener Gewebe und Gelenke zu verbessern.',
  },
];

/** Kategorien der Privatpraxis für Funktionelle Medizin (Feld `kategorie` bei bereich: funktionelle-medizin) */
export const privatpraxisBereiche: Leistungsbereich[] = [
  {
    id: 'grundlagen',
    titel: 'Funktionelle Medizin, Hormone & Chelattherapie',
    icon: 'leaf',
    text: 'Ursachenorientierte Diagnostik und Therapie chronischer Beschwerden – von der funktionellmedizinischen Anamnese über die individuelle Hormontherapie bis zur Chelattherapie.',
  },
  {
    id: 'infusionen',
    titel: 'Infusionstherapien',
    icon: 'drop',
    text: 'Individuell abgestimmte Infusionen mit Vitaminen, Mineralstoffen, Aminosäuren und Antioxidantien.',
  },
];
