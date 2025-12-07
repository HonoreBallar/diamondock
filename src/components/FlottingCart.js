import { Text, TouchableOpacity, View } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useCart } from "../context/CartContext";
import { useTranslation } from "../context/LocalizationContext";

export default function FlottingCart({navigation}){
    const { t } = useTranslation();
    const {productInCart} = useCart();

    return (
        <TouchableOpacity onPress={()=>navigation.navigate('Main',{screen: t('tabs.tab_cart')})}>
            <FontAwesome5 name="shopping-cart" size={23} color="#03045e" />
            {productInCart() > 0 &&(
                <View style={{position: 'absolute', top: -8, right: 0, backgroundColor: '#f29f03', width: 15, height: 15, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 11}}>{productInCart()}</Text>
                </View>
            )}
        </TouchableOpacity>
    )
}