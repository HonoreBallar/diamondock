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
      image: 'https://images.augustman.com/wp-content/uploads/sites/3/2022/09/23154503/untitled-design-38.jpeg'
    },
    {
      name: 'Chaines',
      nb_products: 2,
      image: 'https://www.cdiscount.com/pdt2/7/3/9/1/700x700/auc2009798206739/rw/chaine-figaro-collier-homme-plaque-or-24-carats-so.jpg'
    },
    {
      name: 'Hommes',
      nb_products: 2,
      image: 'https://assets.devred.com/media/catalog/product/cache/61a2edd6ccaebfacf96d2d13faad9703/c/h/chemise-homme-ville-unie-extra-slim-5164020_01_1.jpg'
    },
    {
      name: 'Femmes',
      nb_products: 122,
      image: 'https://www.romyboutique.fr/13430/chemise-oversize-.jpg'
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