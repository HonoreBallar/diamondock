import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { getRequest, postRequest } from "../utils/api";

const OrderContext = createContext();

export const OrderProvider = ({children})=>{
    const [modePayment, setModePayment] = useState([]);

    const fetchMode = async () => {
        try {
            const dataMode = await getRequest('/setting/payment-methods');
            setModePayment(dataMode?.data.online_payment_options ?? []);
        } catch (error) {
            console.error('Erreur lors du chargement des produits des vendeurs :', error);
        }
    };

    const fetchOrder = async (datas)=>{
        try {
            const response = await postRequest('/order/create', datas);
            return response;
        } catch (error) {
            console.error('Erreur lors :', error);
        }
    }

    // Charger les produits depuis l'API
    useEffect(() => {
        fetchMode();
    }, []);

    return (
        <OrderContext.Provider value={{modePayment, fetchOrder }}>
            {children}
        </OrderContext.Provider>
    );
}

export const useOrders = ()=> useContext(OrderContext);