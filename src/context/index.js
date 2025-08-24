import { CategoryProvider } from "./CategoryContext";
import { OrderProvider } from "./OrderContext";
import { ProductProvider } from "./ProductContext";
import { RootProvider } from "./RootContext";
// import { SearchProvider } from "./SearchContext";
import { CartProvider } from "./CartContext";
import { WishlistProvider } from "./WishlistContext";
import { SellerProvider } from "./SellerContext";
import { LocalizationProvider } from "./LocalizationContext";
import { ApiProvider } from "./ApiContext";

export const AppProvider = ({children}) =>{
    return (
        <RootProvider>
            <ApiProvider>
                <LocalizationProvider>
                    <CartProvider>
                        <SellerProvider>
                            <OrderProvider>
                                {/* <SearchProvider> */}
                                    <ProductProvider>
                                        <WishlistProvider>
                                            <CategoryProvider>
                                                {children}
                                            </CategoryProvider>
                                        </WishlistProvider>
                                    </ProductProvider>
                                {/* </SearchProvider> */}
                            </OrderProvider>
                        </SellerProvider>
                    </CartProvider>
                </LocalizationProvider>
            </ApiProvider>
        </RootProvider>
    );
}