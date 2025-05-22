import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { getRequest } from "../utils/api";

const ProductContext = createContext();

export const ProductProvider = ({children})=>{
    const [sellers, setSellers] = useState([]);
    const [products, setProducts] = useState([
        // {
        //     token: '5255533',
        //     name: 'sneaker',
        //     price: 15000,
        //     image: 'https://m.media-amazon.com/images/I/61CxWzwFziL._AC_SR920,736_.jpg'
        // },
        // {
        //     token: '58621233',
        //     name: 'Iphone x',
        //     price: 155000,
        //     image: 'https://sm.pcmag.com/t/pcmag_uk/review/a/apple-ipho/apple-iphone-11-review_d1kr.1200.jpg'
        // },
        // {
        //     token: '6686666',
        //     name: 'Ordinateur mac 13 2021 12 RAM 128 SSD',
        //     price: 635000,
        //     image: 'https://c0.lestechnophiles.com/www.numerama.com/wp-content/uploads/2021/05/asus-chromebook-flip-c433-4-1024x577.jpg?resize=1024,577&key=b5e96d9a'
        // }

    ]);

    const fetchSellers = async () => {
        try {
            const dataSeller = await getRequest('/seller/all');
            setSellers(dataSeller?.data ?? []);
        } catch (error) {
            console.error('Erreur lors du chargement des produits des vendeurs :', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const dataProduct = await getRequest('/product/all');
            setProducts(dataProduct?.data ?? []);
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
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