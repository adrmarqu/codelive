import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend) // Carga los archivos JSON
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Conecta con React
  .init({
    fallbackLng: 'es', // Idioma por defecto si no encuentra otro
    interpolation: {
      escapeValue: false, // React ya protege contra XSS
    },
  });

export default i18n;