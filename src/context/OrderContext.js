import { createContext, useContext, useEffect, useState } from "react";
import { useApiClient } from "./ApiContext";

const OrderContext = createContext();

export const OrderProvider = ({children})=>{
    const [modePayment, setModePayment] = useState([]);
    const apiClient = useApiClient();

    const fetchMode = async () => {
        try {
            const dataMode = await apiClient.get('/setting/payment-methods');
            setModePayment(dataMode?.data?.online_payment_options ?? []);
        } catch (error) {
            console.error('Error loading seller products :', error);
        }
    };

    const fetchOrder = async (datas)=>{
        try {
            const response = await apiClient.post('/order/create', datas);
            return response;
        } catch (error) {
            console.error('Error :', error);
            console.log('Order Creation Error Response:', error?.response?.data || error?.message || error);
        }
    }

    const getDeliveryPrice = async (datas)=>{
        try {
            const response = await apiClient.post('/order/amount-payable', datas);
            return response;
        } catch (error) {
            console.error('Error fetching delivery price:', error?.response?.data || error?.message || error);
        }
    }

    // Charger les produits depuis l'API
    useEffect(() => {
        fetchMode();
    }, []);

    return (
        <OrderContext.Provider value={{modePayment, fetchOrder, fetchMode, getDeliveryPrice}}>
            {children}
        </OrderContext.Provider>
    );
}

export const useOrders = ()=> useContext(OrderContext);