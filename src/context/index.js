import { CategoryProvider } from "./CategoryContext";
import { OrderProvider } from "./OrderContext";
import { ProductProvider } from "./ProductContext";
import { RootProvider } from "./RootContext";
import { SearchProvider } from "./SearchContext";
import { CartProvider } from "./CartContext";

export const AppProvider = ({children}) =>{
    return (
        <RootProvider>
            <CartProvider>
                <OrderProvider>
                    <SearchProvider>
                        <ProductProvider>
                            <CategoryProvider>
                                {children}
                            </CategoryProvider>
                        </ProductProvider>
                    </SearchProvider>
                </OrderProvider>
            </CartProvider>
        </RootProvider>
    );
}