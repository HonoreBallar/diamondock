import React, { createContext, useState, useEffect, useContext } from 'react';
import { useApiClient } from './ApiContext';

// Créer le contexte
const CategoryContext = createContext();

// Provider CategoryContext
export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const apiClient = useApiClient();

  const fetchCategories = async () => {
      try {
          const dataCategories = await apiClient.get('/category/all');
          setCategories(dataCategories?.data?.data ?? []);
      } catch (error) {
          console.error('Error loading seller products :', error);
      }
  };

  // Récupérer les catégories depuis l'API
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories , fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

// Hook personnalisé pour utiliser CategoryContext
export const useCategories = () => useContext(CategoryContext);