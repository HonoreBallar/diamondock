import { createContext, useContext, useEffect, useState } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import axios from 'axios';
import { getItemFromStorage, setItemInStorage, wait } from "../utils/utils";
import { postRequest } from "../utils/api";

const RootContext = createContext();
export const RootProvider = ({children})=>{
    const [starter, setStarter] = useState({
        is_started: false,
    });
    const [loading, setLoading] = useState(true);
    const [auth, setAuth] = useState({
        isLoggedIn: false,
        user: null
    });

    useEffect(()=>{
        const _ = async()=>{
            const [starter, auth] = await Promise.all([AsyncStorage.getItem('starter'), AsyncStorage.getItem('auth')]);

            if(starter){
                setStarter(JSON.parse(starter));
            }
            if(auth){
                setAuth(JSON.parse(auth));
            }
            console.log(auth, starter);
            await wait(1000);
            setLoading(false);
        }

        _();
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
    };

    const registerUser = async (datas)=>{
        try {
            const response = await postRequest('/client/store', datas);
            if(response?.status === false){
                showMessage({
                    message: response?.message,
                    type: "danger",
                    icon: { icon: "danger"},
                    duration: 2000,
                });
                return;
            }
            await updateStarterState({is_started: true});
            await updateAuthState({isLoggedIn: true, user: response.data});
            showMessage({
                message: "Compte créé avec succès",
                type: "success",
                icon: { icon: "success"},
                duration: 2000,
            });
        } catch (error) {
            showMessage({
                message: "Erreur réseau "+ error.message,
                type: "danger",
                icon: { icon: "danger"},
                duration: 2000,
            });
        }
    }

    const editUser = async (datas={}) => {
        try {
            const response = await postRequest('/client/edit/'+ auth.user._key, datas);
            await updateAuthState({user: response.data});
            showMessage({
                message: "Modification du profil reussie",
                type: "success",
                icon: { icon: "success"},
                duration: 2000,
            });
            return response;
        } catch (error) {
            console.log(error);
            showMessage({
                message: "Erreur réseau "+ error.message,
                type: "danger",
                icon: { icon: "danger"},
                duration: 2000,
            });
        }
    }

    const loginUser = async(datas={})=>{
        try {
            const response = await postRequest('/client/login', datas);
            if(response.status === false){
                showMessage({
                    message: response?.message,
                    type: "danger",
                    icon: { icon: "danger"},
                    duration: 2000,
                });
                return;
            }
            await updateAuthState({isLoggedIn: true, user: response.data});
            showMessage({

                message: "Connexion réussie",
                type: "success",
                icon: { icon: "success"},
                duration: 2000,
            });
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
                message: "Erreur réseau "+ error.message,
                type: "danger",
                icon: { icon: "danger"},
                duration: 2000,
            });
        }

    }

    return (
        <RootContext.Provider value={{starter, auth, loading, updateStarterState, updateAuthState, logout, registerUser, editUser, loginUser}}>
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