import fr from './fr.json'; // Importe directement le fichier JSON français
import en from './en.json'; // Importe le fichier JSON anglais (assurez-vous de l'avoir créé)

const translations = {
  fr: fr,
  en: en, // Ajoutez d'autres langues ici si nécessaire
};

/**
 * Fonction de traduction.
 * Gère les clés imbriquées (ex: 'home.welcomeTitle') et les interpolations (ex: '{{appName}}').
 * @param {string} key - La clé de traduction (ex: 'common.appName' ou 'en.common.appName').
 * @param {Object.<string, string|number>} [params] - Les paramètres pour l'interpolation.
 * @returns {string} La chaîne de caractères traduite.
 */
export const translate = (key, params) => {
  const parts = key.split('.');
  let currentLanguageCode = 'fr'; // Langue par défaut
  let actualKeyParts = parts;

  // Vérifie si la première partie de la clé est un code de langue reconnu
  if (translations[parts[0]]) {
    currentLanguageCode = parts[0];
    actualKeyParts = parts.slice(1);
  }

  let value = translations[currentLanguageCode];

  for (const part of actualKeyParts) {
    if (typeof value === 'object' && value !== null && part in value) {
      value = value[part];
    } else {
      console.warn(`Translation key '${key}' not found or path invalid. Missing part: '${part}' for language '${currentLanguageCode}'.`);
      return key; // Retourne la clé si non trouvée pour faciliter le débogage
    }
  }

  let translatedString = typeof value === 'string' ? value : key;

  // Interpolation des paramètres
  if (params && typeof translatedString === 'string') {
    for (const paramKey in params) {
      translatedString = translatedString.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(params[paramKey]));
    }
  }

  return translatedString;
};