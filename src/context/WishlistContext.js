import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage, { showMessage } from 'react-native-flash-message';

const WishlistContext = createContext();

export const WishlistProvider = ({children})=>{
    const [wishlist, setWishlist] = useState([]);

    // Charger les produits de la liste d'envies au démarrage
    useEffect(() => {
        const loadWishlist = async () => {
            try{
                // Récupérer la liste d'envies depuis AsyncStorage ici
                const wishlistData = await AsyncStorage.getItem('wishlist');
                if (wishlistData) {
                    setWishlist(JSON.parse(wishlistData));
                }
            }
            catch (error) {
                console.error('Error loading wishlist from AsyncStorage', error);
            }
            finally{
                //
            }
        }
        loadWishlist();
    }, []);

    // Sauvegarder la liste d'envies dans AsyncStorage
    const saveWishlistToStorage = async (wihslistStore = []) => {
        try {
            await AsyncStorage.setItem('wishlist', JSON.stringify(wihslistStore));
        } catch (error) {
            console.error('Error saving wishlist to AsyncStorage', error);
        }
    };

    // Vider la liste d'envies
    const clearWishlist = () => {
        let _ = [];
        setWishlist(_);
        saveWishlistToStorage(_);
    };

    // Ajouter un produit à la liste d'envies
    const addToWishlist = (product) => {
        const existingProductIndex = wishlist.findIndex((item) => item.token === product.token);
        
        let updatedWishlist;
        if (existingProductIndex >= 0) {
            updatedWishlist = wishlist.filter((item) => item.token !== product.token);
            showMessage({
                message: "Produit supprimé à votre liste d'envies",
                type: "info",
                icon: { icon: "info", position: "left" },
                duration: 2000,
            });
        } else {
            updatedWishlist = [...wishlist, product];
            showMessage({
                message: "Produit ajouté à votre liste d'envies",
                type: "success",
                icon: { icon: "success", position: "left" },
                duration: 2000,
            });
        }
        setWishlist(updatedWishlist);
        saveWishlistToStorage(updatedWishlist);
    };

    // Vérifier si un produit est dans la liste d'envies
    const isProductInWishlist = (productId) => wishlist.some((product) => product.token === productId);

    // Retirer un produit de la liste d'envies
    const removeFromWishlist = (productId) => {
        const updatedWishlist = wishlist.filter((product) => product.token!== productId);
        setWishlist(updatedWishlist);
        saveWishlistToStorage(updatedWishlist);
        showMessage({
            message: "Produit supprimé de votre liste d'envies",
            type: "info",
            icon: { icon: "info" },
            duration: 2000,
        });
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist, isProductInWishlist, clearWishlist }}>
            {children}
            <FlashMessage
                animated={true}
                position="top"
                style={{ paddingTop: 50}}
                />
        </WishlistContext.Provider>
    );
}

export const useWishlist = ()=> useContext(WishlistContext);