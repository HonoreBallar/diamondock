import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { useRootContext } from './RootContext';

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const { appLanguage, appCurrency } = useRootContext();

  // Crée une instance Axios
  const apiClient = axios.create({
    // baseURL: 'https://api.diamondock.com/api',
    baseURL: 'https://api-diamondock.nkouadio.com/api',
    timeout: 5000,
    headers: {
      'X-App-Key': '019523f4-174a-7005-a126-366e48e46dcc',
    },
  });

  // Interceptor pour headers dynamiques
  apiClient.interceptors.request.use((config) => {
    config.headers['X-HLang'] = appLanguage || 'fr';
    config.headers['X-Devise'] = appCurrency || 'EUR';
    return config;
  });

  return (
    <ApiContext.Provider value={{ apiClient }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApiClient = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApiClient must be used within an ApiProvider');
  }
  return context.apiClient;
};