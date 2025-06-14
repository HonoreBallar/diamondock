import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { getRequest } from '../utils/api';

// Créer le contexte
const CategoryContext = createContext();

// Provider CategoryContext
export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
      try {
          const dataCategories = await getRequest('/category/all');
          setCategories(dataCategories?.data ?? []);
      } catch (error) {
          console.error('Erreur lors du chargement des produits des vendeurs :', error);
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