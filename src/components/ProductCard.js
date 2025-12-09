import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import React, { useState, useCallback } from 'react';
import colors from '../utils/colors';
import { formatAmount, ratio } from '../utils/utils';
import { ProgressBar } from 'react-native-paper';
import { useTranslation } from '../context/LocalizationContext';
import VariantsBottomSheet from './VariantsBottomSheet';

const ProductCard = ({ navigation, product }) => {
    const { t } = useTranslation();
    const { addToCart } = useCart();
    const { addToWishlist, isProductInWishlist } = useWishlist();
    const [loading, setLoading] = useState(false);
    const [loadingWishlist, setLoadingWishlist] = useState(false);
    const [showVariantsSheet, setShowVariantsSheet] = useState(false);
    const monRatio = product?.remaining_stock / product?.total_stock;

    const handleAddToCart = useCallback(async (product) => {
        // Si le produit a des variantes, afficher le bottom sheet
        if (product?.variants && product.variants.length > 0) {
            setShowVariantsSheet(true);
            return;
        }

        // Sinon, ajouter directement au panier
        setLoading(true);
        setTimeout(async () => {
            await addToCart(product);
            setLoading(false);
        }, 50);
    }, [addToCart]);

    const handleAddToWishlist = useCallback(async (product) => {
        setLoadingWishlist(true);
        setTimeout(async () => {
            await addToWishlist(product);
            setLoadingWishlist(false);
        }, 10);
    }, [addToWishlist]);

    const handlePress = useCallback(() => {
        navigation.navigate('DetailProductScreen', { product: product })
    }, [navigation, product]);

    const handleVariantsAddToCart = async (selectedVariants, quantity, itemQuantities) => {
        setLoading(true);
        setTimeout(async () => {
            await addToCart(product, quantity, selectedVariants, itemQuantities);
            setLoading(false);
        }, 10);
    };

    const handleVariantsGoToCart = async (selectedVariants, quantity, itemQuantities) => {
        setLoading(true);
        setTimeout(async () => {
            await addToCart(product, quantity, selectedVariants, itemQuantities);
            setLoading(false);
            navigation.navigate('Main', { screen: t('tabs.tab_cart') });
        }, 10);
    };

    return (
        <>
            <TouchableOpacity onPress={handlePress}>
                <View style={{ backgroundColor: '#f7f7f7', width: 150, height: 250, borderRadius: 10, marginRight: 10, padding: 8 }}>
                    <View style={{ alignSelf: 'center', marginTop: 10, height: 120, width: 130, backgroundColor: 'white', borderRadius: 10 }}>
                        <Image source={product?.main_image ? { uri: product?.main_image } : require('../assets/icon.png')} style={{ height: 100, width: 100, alignSelf: 'center', marginTop: 5 }} />
                        <View style={{ marginTop: -115, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            {product?.reduction_rate && product?.reduction_rate != null ? (
                                <View style={{ backgroundColor: "#dd5813", borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 2 }}>
                                    <Text style={{ color: '#fff', fontSize: 12 }}>{product?.reduction_rate} %</Text>
                                </View>
                            ) : (<View style={{ width: 20 }} />)}
                            <View style={{}}>
                                <TouchableOpacity onPress={() => handleAddToWishlist(product)} style={{ backgroundColor: '#fff', borderRadius: 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                                    {loadingWishlist ? (
                                        <ActivityIndicator size="small" color={colors.primary} />
                                    ) : (
                                        isProductInWishlist(product.token) ? (
                                            <Text>❤️</Text>
                                        ) : (
                                            <FontAwesome5 name="heart" size={15} color="red" />
                                        )

                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{ margin: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('DetailProductScreen', { product })}><Text style={{ fontSize: 15, fontWeight: '500', color: colors.gray, marginTop: 1 }} numberOfLines={1}>{product?.name || 'nom produit'}</Text></TouchableOpacity>
                        <Text style={{ fontSize: 15, color: '#000', marginTop: 1, fontWeight: '800', }}>{formatAmount(product?.price || 0)} {product?.currency}</Text>
                        {
                            product?.remaining_stock === 0 ? (
                                <>
                                    <Text style={{ fontSize: 12, color: "red", marginTop: 2, marginBottom: 3 }}>{t('common.outOfStock')}</Text>
                                    <TouchableOpacity disabled={true} style={{ backgroundColor: "#b3b9cb", borderRadius: 5, width: 119, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                                        {loading ? (
                                            <ActivityIndicator size="small" color={colors.border} />
                                        ) : (
                                            <View style={{ flexDirection: 'row' }}>
                                                <FontAwesome5 name="eye" size={15} color="#000" />
                                                <Text style={{ marginLeft: 5 }}>{t('common.view')}</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <View>
                                        <Text style={{ fontSize: 9, color: colors.gray, marginTop: 2 }}>{product?.remaining_stock} {t('common.itemsLeft')}</Text>
                                        <ProgressBar style={{ height: 3, borderRadius: 5, marginTop: 1, marginBottom: 2 }} progress={monRatio} color={colors.primary} />
                                    </View>
                                    <View style={{ marginTop: 3, alignItems: 'center' }}>
                                        <TouchableOpacity disabled={loading} onPress={() => handleAddToCart(product)} style={{ backgroundColor: '#ffa100', borderRadius: 5, width: 119, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                                            {loading ? (
                                                <ActivityIndicator size="small" color={colors.border} />
                                            ) : (
                                                <View style={{ flexDirection: 'row' }}>
                                                    <FontAwesome5 name="cart-plus" size={15} color="#000" />
                                                    <Text style={{ marginLeft: 5 }}>{t('buttons.addToCart')}</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )
                        }
                    </View>
                </View>
            </TouchableOpacity>

            <VariantsBottomSheet
                visible={showVariantsSheet}
                onClose={() => setShowVariantsSheet(false)}
                product={product}
                onAddToCart={handleVariantsAddToCart}
                onGoToCart={handleVariantsGoToCart}
                loading={loading}
            />
        </>
    );
}

export default React.memo(ProductCard);