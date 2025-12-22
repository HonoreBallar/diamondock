import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useTranslation } from "../context/LocalizationContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { t } = useTranslation();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState(null);

    //Charger les produits du panier depuis AsyncStorage au démarrage
    useEffect(() => {
        async function loadCart() {
            try {
                const cartData = await AsyncStorage.getItem('cart');
                if (cartData) {
                    const _ = JSON.parse(cartData);
                    setCart(_);
                    if (_.length > 0) {
                        setCurrency(_[0]?.currency);
                    }
                }
                setLoading(false);
            } catch (error) {
                console.log('Error loading cart from AsyncStorage', error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }
        loadCart();
    }, []);


    //Ajouter un produit au panier
    const addToCart = (product, nbOfProduct = 1, selectedVariants = {}) => {
        if (currency && product?.currency !== currency) {
            showMessage({
                message: t('alerts.addProductToSameCurrency'),
                type: "danger",
                icon: { icon: "danger" },
                duration: 2000,
            });
            return;
        }

        if (!currency) setCurrency(product?.currency);

        // Créer un identifiant unique pour le produit selon ses variantes
        const variantTokenString = Object.values(selectedVariants)
            .map(v => v.token)
            .sort()
            .join('-');

        const productKey = product.token + (variantTokenString ? `-${variantTokenString}` : '');

        const existingProductIndex = cart.findIndex((item) => item.uniqueKey === productKey);
        let updatedCart;

        if (existingProductIndex >= 0) {
            const updatedProduct = {
                ...cart[existingProductIndex],
                quantity: parseInt(cart[existingProductIndex].quantity) + parseInt(nbOfProduct)
            };
            updatedCart = [
                ...cart.slice(0, existingProductIndex),
                updatedProduct,
                ...cart.slice(existingProductIndex + 1)
            ];
        } else {
            // Calcul du prix en fonction des variants
            let finalPrice = product.price;
            const selectedVariantsList = Object.values(selectedVariants);
            if (selectedVariantsList.length > 0) {
                finalPrice = selectedVariantsList.reduce((total, variant) => total + (variant.price || 0), 0);
            }

            updatedCart = [
                ...cart,
                {
                    ...product,
                    price: finalPrice,
                    quantity: nbOfProduct,
                    selectedVariants: selectedVariants,
                    uniqueKey: productKey // clé unique pour identifier le produit + variantes
                }
            ];
        }

        setCart(updatedCart);
        saveCartToStorage(updatedCart);

        showMessage({
            message: t('alerts.productAddedToCart'),
            type: "success",
            icon: { icon: "success", position: "left" },
            duration: 2000,
        });
    };


    //Enlever un produit du panier
    const removeFromCart = (productKey) => {
        const updatedCart = cart.filter((product) => product.uniqueKey !== productKey);
        setCart(updatedCart);
        saveCartToStorage(updatedCart);
        if (updatedCart.length === 0) {
            setCurrency(null);
        }
        showMessage({
            message: t('alerts.productRemovedToCart'),
            type: "success",
            icon: { icon: "success" },
            duration: 2000,
        });
    };

    //Sauvegarder le panier dans AsyncStorage
    const saveCartToStorage = async (cartStore = []) => {
        try {
            await AsyncStorage.setItem('cart', JSON.stringify(cartStore));
        } catch (error) {
            console.log('Error saving cart to AsyncStorage', error);
        }
    };

    //Vider le panier
    const clearCart = (message = true) => {
        let _ = [];
        setCart(_);
        saveCartToStorage(_);
        setCurrency(null);
        if (message) {
            showMessage({
                message: t('alerts.emptyCart'),
                type: "warning",
                icon: { icon: "success" },
                duration: 2000,
            });
        }
    };

    //Calculer le total du panier
    const getTotal = () => {
        return cart.reduce((total, product) => total + (product.price * product.quantity), 0);
    };

    //Augmentation de la quantité de 1
    const incrementQuantity = (productKey) => {
        const updatedCart = cart.map((product) =>
            product.uniqueKey === productKey ? { ...product, quantity: product.quantity + 1 } : product
        );
        setCart(updatedCart);
        saveCartToStorage(updatedCart);
    };

    //Diminution de la quantité de 1
    const decrementQuantity = (productKey) => {
        const updatedCart = cart.map((product) =>
            product.uniqueKey === productKey && product.quantity > 1 ? { ...product, quantity: product.quantity - 1 } : product
        );
        setCart(updatedCart);
        saveCartToStorage(updatedCart);
    };

    const productInCart = () => {
        return cart.length ?? 0;
    }

    const productListInCart = cart.map(item => {
        const variants = Object.values(item.selectedVariants || []).map(v => ({
            token: v.parentToken,
            value: v.name,
            parentToken: v.parentToken
        }));
        
        const product = {
            quantity: item.quantity,
            token: item.token
        };
        
        if (variants.length > 0) {
            product.variants = variants;
        }
        
        return product;
    });

    return (
        <CartContext.Provider value={{ cart, currency, addToCart, removeFromCart, clearCart, getTotal, incrementQuantity, decrementQuantity, productListInCart, productInCart }}>
            {children}
            <FlashMessage
                animated={true}
                position="top"
                style={{ paddingTop: 50 }}
            />
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);