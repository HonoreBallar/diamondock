import { createContext, useContext, useEffect, useState } from "react";
import { getRequest } from "../utils/api";
import { useProductContext } from "./ProductContext";

const SearchContext = createContext();


export const SearchProvider = ({children})=>{
    const [searchText, setSearchText] = useState('');
    const {products} = useProductContext();
    const [filteredProducts, setFilteredProducts] = useState(products);

    useEffect(()=>{
        // console.log(products)
    }, []);

    const filterProducts = async (datas) => {
        try{
            const response = await getRequest('/search',datas);
            return;
            setFilteredProducts(response.data);
        }catch(err){
            console.error("Error : "+err.message);
        }

    }



    return (
        <SearchContext.Provider value={{searchText: '', filteredProducts , filterProducts}}>
            {children}
        </SearchContext.Provider>
    );
}

export const useSearchContext = ()=>useContext(SearchContext);