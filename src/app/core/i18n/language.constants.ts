import { Radio } from '../../shared/form/radio/radio';

export const LanguageConstants = {
  SUPPORTED_LANGUAGES: ['en', 'pl', 'de', 'es', 'fr', 'it', 'ru', 'fi'],
  LANGUAGES_REGEX: /en|pl|de|es|fr|it|ru|fi/,
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
  {
    value: 'fr',
    label: 'Français',
  },
  {
    value: 'it',
    label: 'Italiano',
  },
  {
    value: 'ru',
    label: 'Русский',
  },
  {
    value: 'fi',
    label: 'Suomen',
  },
];
