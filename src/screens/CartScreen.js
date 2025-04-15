import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native"
import Header from "../components/Header";
import Title from "../components/Title";
import { useCart } from "../context/CartContext";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useState } from "react";
import colors from "../utils/colors";
import CartCard from "../components/CartCard";
import { formatAmount } from "../utils/utils";

export default function CartScreen({navigation, }){

    const { cart, loading, clearCart, getTotal} = useCart();
    const [loadingCart, setLoadingCart] = useState(false);

    const handleClearCart = () => {
        setLoadingCart(true);
        Alert.alert(
            'Vider le panier',
            'Voulez-vous vraiment vider votre panier ?',
            [
                {text: 'Annuler', style: 'cancel', onPress: ()=> setLoadingCart(false)},
                {text: 'Vider', onPress: () => {
                    clearCart()
                    setLoadingCart(false);
                }}
            ],
            {cancelable: false}
        );
    };

    return(
        <ScrollView style={{flex: 1}}>
            <Header />
            <Title title="Mon panier" />
            <View style={{flex: 1, padding: 15, marginBottom: 20}}>
                { loading ? (
                    <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                    cart.length === 0 ? (
                        <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 150}}>
                            {/* <Image source={require('../../assets/empty_cart.png')} style={{width: 200, height: 200}} /> */}
                            <View style={{margin: 10}}>
                                <TouchableOpacity onPress={()=>navigation.jumpTo('Home')} style={{flexDirection: 'row', width: '60%', backgroundColor: colors.primary, padding:10, alignSelf: 'center', borderRadius: 15, justifyContent: 'center'}}>
                                    <Text style={{fontSize:15, color : 'white'}}>Visiter les produits</Text>
                                    <FontAwesome5 name="hand-point-right" size={18} color='white' style={{marginLeft: 8}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <>
                            {
                                cart.map(product => (
                                    <CartCard 
                                        navigation={navigation}
                                        key={product.token}
                                        product={product}
                                    />
                                ))
                            }
                            <View style={{backgroundColor: 'white', borderRadius: 10, padding: 5, marginTop: 5}}>
                                <View style={{flexDirection: 'row', justifyContent:'space-between', marginBottom: 10, paddingHorizontal: 15, alignItems: 'center', height: 50}}>
                                    <Text style={{color: '#c3c3c3', fontSize: 18}}>Total :</Text>
                                    <Text style={{fontSize: 25, fontWeight: 'bold', color: colors.primary}}> {formatAmount(getTotal() || 0)}</Text>
                                </View>
                                <TouchableOpacity onPress={()=>navigation.navigate('PaymentScreen')} style={{backgroundColor: colors.primary, padding: 12,borderRadius:10, marginBottom: 10 }}>
                                    <Text style={{color: 'white', fontWeight: 'bold',  textAlign: 'center'}}>Valider ma commande</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>handleClearCart()}>
                                    {loadingCart ? (
                                        <ActivityIndicator size="small" color="red" />
                                    ): (
                                        <Text style={{color: 'red', fontWeight: 'bold', textDecorationLine: 'underline', textAlign: 'center'}}>Vider le panier</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </>
                        )
                )}
            </View>
        </ScrollView>
    );
}