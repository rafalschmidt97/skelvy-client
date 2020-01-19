import { Radio } from '../../shared/form/radio/radio';

export const LanguageConstants = {
  SUPPORTED_LANGUAGES: ['en', 'pl', 'de', 'es'],
  LANGUAGES_REGEX: /en|pl|de|es/,
  DEFAULT_LANGUAGE: 'en',
};

export const LanguageRadio: Radio[] = [
  {
    value: 'pl',
    label: 'Polski',
  },
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'de',
    label: 'Deutsch',
  },
  {
    value: 'es',
    label: 'Español',
  },
];
