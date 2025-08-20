// src/context/LocalizationContext.js
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translate } from '../locales/i18n'; // Importe la fonction de traduction
import { getLocales } from 'expo-localization';
import { useRootContext } from './RootContext';

const LocalizationContext = createContext(undefined);

/**
 * Fournisseur de contexte pour la gestion de la localisation.
 * Rend la langue actuelle et la fonction de traduction disponibles pour tous les composants enfants.
 * @param {Object} props - Les propriétés du composant.
 * @param {React.ReactNode} props.children - Les éléments enfants à rendre.
 * @returns {JSX.Element} Le fournisseur de contexte de localisation.
 */
export const LocalizationProvider = ({ children }) => {
  const { appLanguage, appCurrency } = useRootContext();
  // const deviceLanguage = appLanguage || 'fr';
  const [currentLanguage, setCurrentLanguage] = useState(appLanguage || 'fr'); // Langue par défaut

  useEffect(() => {
    if (appLanguage) {
      setCurrentLanguage(appLanguage);
    }
  }, [appLanguage]);

  // si elle est passée comme prop.
  const t = useCallback((key, params) => {
    // Ici, nous préfixons la clé avec la langue actuelle pour appeler la fonction translate.
    // Cela permet à translate de ne pas avoir à deviner la langue si on veut supporter plusieurs
    // langues chargées dynamiquement ou basculer facilement.
    return translate(`${currentLanguage}.${key}`, params);
  }, [currentLanguage]);

  const setLanguage = (lang) => {
    // Dans une application plus complexe, vous pourriez charger dynamiquement les fichiers de langue ici.
    setCurrentLanguage(lang);
  };

  return (
    <LocalizationContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

/**
 * Hook personnalisé pour utiliser le contexte de localisation.
 * @returns {{ currentLanguage: string, setLanguage: (lang: string) => void, t: (key: string, params?: Object.<string, string|number>) => string }}
 * @throws {Error} Si le hook est utilisé en dehors d'un LocalizationProvider.
 */
export const useTranslation = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LocalizationProvider');
  }
  return context;
};