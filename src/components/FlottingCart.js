import { Text, TouchableOpacity, View } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useCart } from "../context/CartContext";

export default function FlottingCart({navigation}){
    
    const {productInCart} = useCart();

    return (
        <TouchableOpacity onPress={()=>navigation.navigate('Main',{screen: 'Panier'})}>
            <FontAwesome5 name="shopping-cart" size={23} color="#03045e" />
            <View style={{position: 'absolute', top: -8, right: 0, backgroundColor: '#f29f03', width: 15, height: 15, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 11}}>{productInCart()}</Text>
            </View>
        </TouchableOpacity>
    )
}