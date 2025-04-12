// import { CartProvider } from "../context/CartContext";
// import { CategoryProvider } from "../context/CategoryContext";
// import { OrderProvider } from "../context/OrderContext";
// import { ProductProvider } from "../context/ProductContext";
// import { WishlistProvider } from "../context/WishlistContext";
import { CartProvider } from "../context/CartContext";
import { RootPovider } from "../context/RootContext";
import StackNavigator from "./StackNavigator";

export default function RootNavigator(){
    return (
        <RootPovider>
            <CartProvider>
                <StackNavigator />
            </CartProvider>
        </RootPovider>
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