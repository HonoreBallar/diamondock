import { CategoryProvider } from "./CategoryContext";
// import { OrderProvider } from "./OrderContext";
import { ProductProvider } from "./ProductContext";
import { RootProvider } from "./RootContext";
// import { SearchProvider } from "./SearchContext";
import { CartProvider } from "./CartContext";
import { WishlistProvider } from "./WishlistContext";
import { SellerProvider } from "./SellerContext";

export const AppProvider = ({children}) =>{
    return (
        <RootProvider>
            <CartProvider>
                <SellerProvider>
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
                </SellerProvider>
            </CartProvider>
        </RootProvider>
    );
}