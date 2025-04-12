import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';

const ProductContext = createContext();

export const ProductProvider = ({children})=>{
    const [products, setProducts] = useState([
        {
            token: '5255533',
            name: 'sneaker'
        }
    ]);
    const [loading, setLoading] = useState(true);

    // Charger les produits depuis l'API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // const response = await axios.get('');
                // setProducts(response.data.data ?? []);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors du chargement des produits:', error);
                setLoading(false);
            }finally{
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider value={{ products, loading }}>
            {children}
        </ProductContext.Provider>
    );
}

export const useProducts = ()=> useContext(ProductContext);