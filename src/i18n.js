import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// import languages json files
import arabic from "./data/languages/ar.json"
import english from "./data/languages/en.json"
import hindi from "./data/languages/hi.json"
import urdu  from "./data/languages/ur.json"
import turkish from "./data/languages/tr.json"
import russian from "./data/languages/ru.json"


i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
    resources: {
      en: { translation: english },
      ar: { translation: arabic },
      tr: { translation: turkish },
      ru: { translation: russian },
      hi: { translation: hindi },
      ur: { translation: urdu }

    }
  });

export default i18n;