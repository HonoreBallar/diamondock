import { createContext, useContext, useEffect, useState } from "react";
import { useApiClient } from "./ApiContext";

const SellerContext = createContext();

export const SellerProvider = ({children})=>{
    const [sellers, setSellers] = useState([]);
    const apiClient = useApiClient();

    const fetchSellers = async () => {
        try {
            const dataSeller = await apiClient.get('/seller/all');
            setSellers(dataSeller?.data?.data ?? []);
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