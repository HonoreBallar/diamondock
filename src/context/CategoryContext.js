import React, { createContext, useState, useEffect, useContext } from 'react';
import { useApiClient } from './ApiContext';
import { useRootContext } from './RootContext';

// Créer le contexte
const CategoryContext = createContext();

// Provider CategoryContext
export const CategoryProvider = ({ children }) => {

  const {appLanguage} = useRootContext();
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiClient = useApiClient();

  // Fonction pour obtenir N catégories aléatoires avec nb_products > 1
  const getRandomCategories = (count = 10) => {
    // Filtrer les catégories qui ont nb_products > 1
    const filtered = categories.filter(cat => cat.nb_products >= 1);
    // Créer une copie du tableau filtré et le mélanger
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    // Retourner les N premiers éléments
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  const fetchCategories = async () => {
      try {
          setLoading(true);
          const dataCategories = await apiClient.get('/category/all');
          setCategories(dataCategories?.data?.data ?? []);
          const dataDepartments = await apiClient.get('/department/all');
          setDepartments(dataDepartments?.data?.data ?? []);
      } catch (error) {
          console.error('Error loading seller products :', error);
      } finally {
          setLoading(false);
      }
  };

  // Récupérer les catégories depuis l'API
  useEffect(() => {
    fetchCategories();
  }, [appLanguage]);

  return (
    <CategoryContext.Provider value={{ categories, fetchCategories, departments, loading, getRandomCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

// Hook personnalisé pour utiliser CategoryContext
export const useCategories = () => useContext(CategoryContext);