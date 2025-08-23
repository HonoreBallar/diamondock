import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { getRequest } from "../utils/api";

const SellerContext = createContext();

export const SellerProvider = ({children})=>{
    const [sellers, setSellers] = useState([]);

    const fetchSellers = async () => {
        try {
            const dataSeller = await getRequest('/seller/all');
            setSellers(dataSeller?.data ?? []);
        } catch (error) {
            console.error('Error fetching sellers :', error);
        }
    };

    // Charger les produits depuis l'API
    useEffect(() => {
        fetchSellers();
    }, []);

    return (
        <SellerContext.Provider value={{ sellers, fetchSellers }}>
            {children}
        </SellerContext.Provider>
    );
}

export const useSellers = ()=> useContext(SellerContext);