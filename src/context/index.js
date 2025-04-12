import { Text } from "react-native";
import { CategoryProvider } from "./CategoryContext";
import { OrderProvider } from "./OrderContext";
import { ProductProvider } from "./ProductContext";
import { RootPovider } from "./RootContext";
// import { SearchProvider } from "./SearchContext";

export const AppProvider = ({children}) =>{
    return (
        <RootPovider>
            <OrderProvider>
                <ProductProvider>
                    <SearchProvider>
                        <CategoryProvider>
                            {children}
                        </CategoryProvider>
                    </SearchProvider>
                </ProductProvider>
            </OrderProvider>
        </RootPovider>
    );
}