import { createContext, useContext, useEffect, useState } from "react";
import { useRootContext } from "./RootContext";
import { useApiClient } from "./ApiContext";

const ProductContext = createContext();

export const ProductProvider = ({children})=>{
    const {appLanguage, appCurrency} = useRootContext();
    const apiClient = useApiClient();
    const [sellers, setSellers] = useState([]);
    const [products, setProducts] = useState([]);

    const fetchSellers = async () => {
        try {
            const dataSeller = await apiClient.get('/seller/all');
            setSellers(dataSeller?.data?.data ?? []);
        } catch (error) {
            console.error('Error loading seller products :', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const dataProduct = await apiClient.get('/product/all');
            setProducts(dataProduct?.data?.data ?? []);
        } catch (error) {
            console.error('Error loading products list:', error);
        }
    };

    // Fonction pour obtenir N produits aléatoires
    const getRandomProducts = (count = 10) => {
        // Filtrer les produits qui ont remaining_stock > 0
        const filtered = products.filter(prod => prod.remaining_stock > 0);
        // Créer une copie du tableau filtré et le mélanger
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        // Retourner les N premiers éléments
        return shuffled.slice(0, Math.min(count, shuffled.length));
    };

    // Charger les produits depuis l'API
    useEffect(() => {
        fetchSellers();
        fetchProducts();
    }, [appLanguage, appCurrency]);

    return (
        <ProductContext.Provider value={{ products, sellers, fetchProducts, fetchSellers, getRandomProducts }}>
            {children}
        </ProductContext.Provider>
    );
}

export const useProducts = ()=> useContext(ProductContext);