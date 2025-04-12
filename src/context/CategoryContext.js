import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Créer le contexte
const CategoryContext = createContext();

// Provider CategoryContext
export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([
    {
      name: 'Sneaker',
      nb_products: 5,
      image: '../assets/chaussure.jpg'
    },
    {
      name: 'Chaines',
      nb_products: 2,
      image: '../assets/chaussure.jpg'
    },
    {
      name: 'Hommes',
      nb_products: 2,
      image: '../assets/chaussure.jpg'
    },
    {
      name: 'Femmes',
      nb_products: 122,
      image: '../assets/chaussure.jpg'
    },
  ]);
  const [loading, setLoading] = useState(true);

  // Récupérer les catégories depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // const response = await axios.get('');
        // setCategories(response.status ? response.data.data : []);
        // setCategories();
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loading }}>
      {children}
    </CategoryContext.Provider>
  );
};

// Hook personnalisé pour utiliser CategoryContext
export const useCategories = () => useContext(CategoryContext);