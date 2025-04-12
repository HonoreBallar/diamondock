// import { CartProvider } from "../context/CartContext";
// import { CategoryProvider } from "../context/CategoryContext";
// import { OrderProvider } from "../context/OrderContext";
// import { ProductProvider } from "../context/ProductContext";
// import { WishlistProvider } from "../context/WishlistContext";
import { CartProvider } from "../context/CartContext";
import { CategoryProvider } from "../context/CategoryContext";
import { ProductProvider } from "../context/ProductContext";
import { RootProvider } from "../context/RootContext";
import { WishlistProvider } from "../context/WishlistContext";
import StackNavigator from "./StackNavigator";

export default function RootNavigator(){
    return (
        <RootProvider>
            <WishlistProvider>
                <CartProvider>
                    <ProductProvider>
                        <CategoryProvider>
                            <StackNavigator />
                        </CategoryProvider>
                    </ProductProvider>
                </CartProvider>
            </WishlistProvider>
        </RootProvider>
        // <CartProvider>
        //     <OrderProvider>
        //         <CategoryProvider>
        //             <ProductProvider>
        //                 <WishlistProvider>
        //                 </WishlistProvider>
        //             </ProductProvider>
        //         </CategoryProvider>
        //     </OrderProvider>
        // </CartProvider>
    );
}