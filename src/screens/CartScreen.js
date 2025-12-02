import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native"
import Header from "../components/Header";
import Title from "../components/Title";
import { useCart } from "../context/CartContext";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useState } from "react";
import colors from "../utils/colors";
import CartCard from "../components/CartCard";
import { formatAmount } from "../utils/utils";
import { useTranslation } from "../context/LocalizationContext";

export default function CartScreen({ navigation, }) {
    const { t } = useTranslation();

    const { cart, loading, clearCart, getTotal, currency } = useCart();
    const [loadingCart, setLoadingCart] = useState(false);

    const handleClearCart = () => {
        setLoadingCart(true);
        Alert.alert(
            t('cart.clearCart'),
            t('cart.clearCartMessage'),
            [
                { text: t('cart.cancel'), style: 'cancel', onPress: () => setLoadingCart(false) },
                {
                    text: t('cart.empty'), onPress: () => {
                        clearCart()
                        setLoadingCart(false);
                    }
                }
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header />
            <ScrollView>
                <Title title={t('cart.cartTitle')} />
                <View style={{ flex: 1, padding: 15, marginBottom: 20 }}>
                    {loading ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                    ) : (
                        cart.length === 0 ? (
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 150 }}>
                                <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'white', elevation: 2, justifyContent: 'center', alignItems: 'center' }}>
                                    <FontAwesome5 name="shopping-bag" size={48} color={colors.primary} />
                                </View>
                                <Text style={{ marginTop: 20, fontSize: 18, color: '#999', fontWeight: '400' }}>{t('cart.emptyCart')}</Text>
                            </View>
                        ) : (
                            <>
                                {
                                    cart.map(product => (
                                        <CartCard
                                            navigation={navigation}
                                            key={product.uniqueKey || product.token}
                                            product={product}
                                        />
                                    ))
                                }
                                <View style={{ backgroundColor: colors.tertiary, borderRadius: 10, padding: 5, marginTop: 5, elevation: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 15, alignItems: 'center', height: 50 }}>
                                        <Text style={{ color: '#c3c3c3', fontSize: 18 }}>Total :</Text>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: colors.primary }}> {formatAmount(getTotal() || 0)} {currency}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => navigation.navigate('OrderStepOne')} style={{ backgroundColor: colors.primary, padding: 12, borderRadius: 10, marginBottom: 10 }}>
                                        <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>{t('buttons.validOrder')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleClearCart()}>
                                        {loadingCart ? (
                                            <ActivityIndicator size="small" color="red" />
                                        ) : (
                                            <Text style={{ color: 'red', fontWeight: '400', textDecorationLine: 'underline', textAlign: 'center' }}>{t('buttons.clearCart')}</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </>
                        )
                    )}
                </View>
            </ScrollView>
        </View>
    );
}