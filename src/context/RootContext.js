import { createContext, useContext, useEffect, useState } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import axios from 'axios';
import { getItemFromStorage, setItemInStorage, wait } from "../utils/utils";
import { getRequest, postRequest } from "../utils/api";

const RootContext = createContext();
export const RootProvider = ({children})=>{
    const [starter, setStarter] = useState({
        is_started: false,
    });
    const [loading, setLoading] = useState(true);
    const [countries, setCountries] = useState([]);
    const [appLanguage, setAppLanguage] = useState('');
    const [appCurrency, setAppCurrency] = useState('');
    const [currencies, setCurrencies] = useState([]);
    const [regions, setRegions] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [typeDelivery, setTypeDelivery] = useState([]);
    const [auth, setAuth] = useState({
        isLoggedIn: false,
        user: null
    });

    useEffect(()=>{
        const _ = async()=>{
            const [starter, auth, _appLanguage, _appCurrency] = await Promise.all([
                AsyncStorage.getItem('starter'),
                AsyncStorage.getItem('auth'),
                getItemFromStorage('@app_language'),
                getItemFromStorage('@app_currency'),
            ]);

            if(_appLanguage){
                setAppLanguage(_appLanguage);
            }
            if(_appCurrency){
                setAppCurrency(_appCurrency);
            }
            
            if(starter){
                setStarter(JSON.parse(starter));
            }
            if(auth){
                setAuth(JSON.parse(auth));
            }
            // console.log(auth)
            await wait(2000);
            setLoading(false);
        }

        _();
        getCountries();
        getCurrencies();
        getTypeDelivery();
    },[]);

    const updateStarterState = async (payload = {})=>{
        const _={
            ...starter,
            ...payload
        }
        setStarter(_);
        await AsyncStorage.setItem('starter', JSON.stringify(_));
    }

    const updateAuthState = async (payload = {})=>{
        const _={
            ...auth,
           ...payload
        }
        setAuth(_);
        await AsyncStorage.setItem('auth', JSON.stringify(_));
    }

    const logout = async ()=>{
        await updateAuthState({isLoggedIn: false, user: null});
        showMessage({
            message: t('alerts.logout'),
            type: "info",
            icon: { icon: "info"},
            duration: 2000,
        });
    };

    const registerUser = async (datas)=>{
        try {
            const response = await postRequest('/customer/register', datas);
            
            return response;
        } catch (error) {
            showMessage({
                message: "Error "+ error.message,
                type: "danger",
                icon: { icon: "danger"},
                duration: 2000,
            });
        }
    }

    const editUser = async (datas={}) => {
        try {
            const response = await postRequest('/account/update', datas);
            if(response?.status){
                await updateAuthState({user: response?.data});
            }
            return response;
        } catch (error) {
            showMessage({
                message: "Error "+ error.message,
                type: "danger",
                icon: { icon: "danger"},
                duration: 2000,
            });
        }
    }

    const loginUser = async (datas={})=>{
        try {
            const response = await postRequest('/auth/login', datas);
            if(response.status){
                await updateAuthState({isLoggedIn: true, user: response.data});
            }
            return response;
        } catch (error) {
            if(error.response){
                showMessage({
                    message: error.response.data.message,
                    type: "danger",
                    icon: { icon: "danger"},
                    duration: 2000,
                });
                return;
            }
            showMessage({
                message: "Error "+ error.message,
                type: "danger",
                icon: { icon: "danger"},
                duration: 2000,
            });
        }

    }

    const resetPassword = async(datas)=>{
        try {
            const response = await postRequest('/auth/reset',{"role": "customer", "email": datas});
            
            if(response?.status === false){
                showMessage({
                    message: response?.message,
                    type: "danger",
                    icon: { icon: "danger"},
                    duration: 2000,
                });
            }
            return response;
        } catch (error) {
            showMessage({
                message: "Error "+ error.message,
                type: "danger",
                icon: { icon: "danger"},
                duration: 2000,
            });
        }
    }

    const getCountries = async()=>{
        try {
            const response = await getRequest('/setting/countries');
            
            if(response?.status === false){
                showMessage({
                    message: response?.message,
                    type: "danger",
                    icon: { icon: "danger"},
                    duration: 2000,
                });
            }
            setCountries(response?.data);
        } catch (error) {
            showMessage({
                message: "Error "+ error.message,
                type: "danger",
                icon: { icon: "danger"},
                duration: 2000,
            });
        }
    }

    const getCurrencies = async()=>{
        try {
            const response = await getRequest('/setting/currencies');
            if(response?.status === false){
                showMessage({
                    message: response?.message,
                    type: "danger",
                    icon: { icon: "danger"},
                    duration: 2000,
                });
            }
            setCurrencies(response?.data);
        } catch (error) {
            showMessage({
                message: "Error "+ error.message,
                type: "danger",
                icon: { icon: "danger"},
                duration: 2000,
            });
        }
    }

    const getRegions = async(country)=>{
        try {
            const response = await getRequest('/setting/regions?country='+country);
            if(response?.status === false){
                showMessage({
                    message: response?.message,
                    type: "danger",
                    icon: { icon: "danger"},
                    duration: 2000,
                });
            }
            setRegions(response?.data);
        } catch (error) {
            showMessage({
                message: "Error "+ error.message,
                type: "danger",
                icon: { icon: "danger"},
                duration: 2000,
            });
        }
    }

    const getMunicipalities = async(region)=>{
        try {
            const response = await getRequest('/setting/municipalities?region='+region);
            if(response?.status === false){
                showMessage({
                    message: response?.message,
                    type: "danger",
                    icon: { icon: "danger"},
                    duration: 2000,
                });
            }
            setMunicipalities(response?.data);
        } catch (error) {
            showMessage({
                message: "Error "+ error.message,
                type: "danger",
                icon: { icon: "danger"},
                duration: 2000,
            });
        }
    }

    const getTypeDelivery = async()=>{
        try {
            const response = await getRequest('/delivery/category/all');
            if(response?.status === false){
                showMessage({
                    message: response?.message,
                    type: "danger",
                    icon: { icon: "danger"},
                    duration: 2000,
                });
            }
            setTypeDelivery(response?.data);
        } catch (error) {
            showMessage({
                message: "Error "+ error.message,
                type: "danger",
                icon: { icon: "danger"},
                duration: 2000,
            });
        }
    }


    return (
        <RootContext.Provider value={{starter, auth, loading, countries, municipalities, currencies, regions, appLanguage, appCurrency, typeDelivery, updateStarterState, updateAuthState, logout, registerUser, editUser, loginUser, getCountries, setAppLanguage, setAppCurrency, resetPassword, getRegions, getMunicipalities, getTypeDelivery}}>
            {children}
            <FlashMessage
                animated={true}
                position="top"
                style={{ paddingTop: 50}}
             />
        </RootContext.Provider>
    );
}

export const useRootContext = ()=>useContext(RootContext);