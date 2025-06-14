import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { getRequest } from "../utils/api";

const ProductContext = createContext();

export const ProductProvider = ({children})=>{
    const [sellers, setSellers] = useState([]);
    const [products, setProducts] = useState([]);

    const fetchSellers = async () => {
        try {
            const dataSeller = await getRequest('/seller/all');
            setSellers(dataSeller?.data ?? []);
        } catch (error) {
            console.error('Erreur lors du chargement des produits des vendeurs :', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const dataProduct = await getRequest('/product/all');
            setProducts(dataProduct?.data ?? []);
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
        }
    };

    // Charger les produits depuis l'API
    useEffect(() => {
        fetchSellers();
        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider value={{ products, sellers, fetchProducts, fetchSellers }}>
            {children}
        </ProductContext.Provider>
    );
}

export const useProducts = ()=> useContext(ProductContext);