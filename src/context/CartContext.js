import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage, { showMessage } from 'react-native-flash-message';

const CartContext = createContext();

export const CartProvider = ({children}) =>{
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    //Charger les produits du panier depuis AsyncStorage au démarrage
    useEffect(() => {
        async function loadCart() {
            try {
                const cartData = await AsyncStorage.getItem('cart');
                if (cartData) {
                    setCart(JSON.parse(cartData));
                }
                setLoading(false);
            } catch (error) {
                console.log('Error loading cart from AsyncStorage', error);
                setLoading(false);
            }finally{
                setLoading(false);
            }
        }
        loadCart();
    }, []);

    //Ajouter un produit au panier
    const addToCart = (product, nbOfProduct = 1) => {
        const existingProductIndex = cart.findIndex((item) => item.token === product.token);
        let updatedCart;
        
        if (existingProductIndex >= 0) {
            const updatedProduct = {...cart[existingProductIndex], quantity: parseInt(cart[existingProductIndex].quantity) + parseInt(nbOfProduct)};
            updatedCart = [...cart.slice(0, existingProductIndex), updatedProduct,...cart.slice(existingProductIndex + 1)];
        } else {
            updatedCart = [...cart, {...product, quantity: nbOfProduct}];
        }
        setCart(updatedCart);
        saveCartToStorage(updatedCart);
        showMessage({
            message: "Produit ajouté au panier",
            type: "success",
            icon: { icon: "success", position: "left" },
            duration: 2000,
        });
    };

    //Enlever un produit du panier
    const removeFromCart = (productId) => {
        const updatedCart = cart.filter((product) => product.token!== productId);
        setCart(updatedCart);
        saveCartToStorage(updatedCart);
        showMessage({
            message: "Produit supprimé du panier",
            type: "success",
            icon: { icon: "success"},
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
        let _=[];
        setCart(_);
        saveCartToStorage(_);
        if (message) {
            showMessage({
                message: "Votre panier est vide !",
                type: "warning",
                icon: { icon: "success"},
                duration: 2000,
            });
        }
    };

    //Calculer le total du panier
    const getTotal = () => {
        return cart.reduce((total, product) => total + (product.price * product.quantity), 0);
    };

    //Augmentation de la quantité de 1
    const incrementQuantity = (productId) => {
        const updatedCart = cart.map((product) =>
            product.token === productId? {...product, quantity: product.quantity + 1} : product
        );
        setCart(updatedCart);
        saveCartToStorage(updatedCart);
    };

    //Diminution de la quantité de 1
    const decrementQuantity = (productId) => {
        const updatedCart = cart.map((product) =>
            product.token === productId && product.quantity > 1 ? {...product, quantity: product.quantity - 1} : product
        );
        setCart(updatedCart);
        saveCartToStorage(updatedCart);
    };

    const productInCart = ()=>{
        return cart.length ?? 0;
    }

    const productListInCart = cart.map(item=>({
        token: item.token,
        quantity: item.quantity,
        reduction_rate: null
    }))

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, clearCart, getTotal, incrementQuantity, decrementQuantity, productListInCart, productInCart }}>
            {children}
            <FlashMessage
                animated={true}
                position="top"
                style={{ paddingTop: 50}}
             />
        </CartContext.Provider>
    );
}

export const useCart = ()=> useContext(CartContext);