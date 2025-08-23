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
            console.error('Error loading seller products :', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const dataProduct = await getRequest('/product/all');
            setProducts(dataProduct?.data ?? []);
        } catch (error) {
            console.error('Error loading products list:', error);
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