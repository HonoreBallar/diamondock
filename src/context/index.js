import { CategoryProvider } from "./CategoryContext";
// import { OrderProvider } from "./OrderContext";
import { ProductProvider } from "./ProductContext";
import { RootProvider } from "./RootContext";
// import { SearchProvider } from "./SearchContext";
import { CartProvider } from "./CartContext";
import { WishlistProvider } from "./WishlistContext";

export const AppProvider = ({children}) =>{
    return (
        <RootProvider>
            <CartProvider>
                {/* <OrderProvider> */}
                    {/* <SearchProvider> */}
                        <ProductProvider>
                            <WishlistProvider>
                                <CategoryProvider>
                                    {children}
                                </CategoryProvider>
                            </WishlistProvider>
                        </ProductProvider>
                    {/* </SearchProvider> */}
                {/* </OrderProvider> */}
            </CartProvider>
        </RootProvider>
    );
}