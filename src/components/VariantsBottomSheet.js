import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    Animated,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../utils/colors';
import { formatAmount } from '../utils/utils';
import { useTranslation } from '../context/LocalizationContext';

const VariantsBottomSheet = ({
    visible,
    onClose,
    product,
    onAddToCart,
    onGoToCart,
    loading = false,
}) => {
    const { t } = useTranslation();
    const [selectedVariants, setSelectedVariants] = useState({});
    const [itemQuantities, setItemQuantities] = useState({});
    const slideAnim = React.useRef(new Animated.Value(0)).current;

    // Animer l'apparition du bottom sheet
    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, slideAnim]);

    const handleSelectVariant = (groupName, item) => {
        setSelectedVariants((prev) => ({
            ...prev,
            [groupName]: item,
        }));
    };

    const updateItemQuantity = (itemToken, qty) => {
        setItemQuantities((prev) => ({
            ...prev,
            [itemToken]: Math.max(1, qty),
        }));
    };

    const getItemQuantity = (itemToken) => {
        return itemQuantities[itemToken] || 1;
    };

    // Calculer le prix final: somme des variantes sélectionnées (prix × quantité)
    const selectedVariantsList = Object.values(selectedVariants);
    const hasSelectedVariants = selectedVariantsList.length > 0;
    
    const variantsPrice =
        hasSelectedVariants
            ? selectedVariantsList.reduce((total, variant) => {
                const itemQty = getItemQuantity(variant.token);
                return total + ((variant.price || 0) * itemQty);
            }, 0)
            : 0;
    
    // Si des variantes sont sélectionnées: prix des variantes × quantité
    // Sinon: prix du produit
    const finalPrice = hasSelectedVariants ? variantsPrice : (product?.price || 0);

    const handleAddToCart = () => {
        onAddToCart(selectedVariants, 1, itemQuantities);
        handleClose();
    };

    const handleGoToCart = () => {
        onGoToCart(selectedVariants, 1, itemQuantities);
        handleClose();
    };

    const handleClose = () => {
        setSelectedVariants({});
        setItemQuantities({});
        onClose();
    };

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [500, 0],
    });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
        >
            <View style={styles.container}>
                {/* Fond semi-transparent */}
                <TouchableOpacity
                    style={styles.backdrop}
                    onPress={handleClose}
                    activeOpacity={1}
                />

                {/* Bottom Sheet */}
                <Animated.View
                    style={[
                        styles.bottomSheet,
                        {
                            transform: [{ translateY }],
                        },
                    ]}
                >
                    {/* Handle bar */}
                    <View style={styles.handleBar}>
                        <View style={styles.handle} />
                    </View>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{t('common.selectVariants') || 'Sélectionner vos options'}</Text>
                        <TouchableOpacity onPress={handleClose}>
                            <FontAwesome5 name="times" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Contenu scrollable */}
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Affichage du produit */}
                        {/* <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={2}>
                                {product?.name}
                            </Text>
                        </View> */}

                        {/* Variantes */}
                        {product?.variants && product.variants.length > 0 ? (
                            product.variants.map((variantGroup, index) => (
                                <View key={index} style={styles.variantSection}>
                                    <Text style={styles.variantGroupTitle}>
                                        {variantGroup.name}
                                    </Text>
                                    {variantGroup.items.map((item) => {
                                        const isSelected =
                                            selectedVariants[variantGroup.name]?.token ===
                                            item.token;
                                        const itemQty = getItemQuantity(item.token);
                                        return (
                                            <View key={item.token} style={styles.variantRowContainer}>
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        handleSelectVariant(variantGroup.name, item)
                                                    }
                                                    style={[
                                                        styles.variantRow,
                                                        isSelected && styles.variantRowSelected,
                                                    ]}
                                                >
                                                    <View style={styles.variantLeftContent}>
                                                        <Text
                                                            style={[
                                                                styles.variantItemText,
                                                                isSelected &&
                                                                    styles.variantItemTextSelected,
                                                            ]}
                                                        >
                                                            {item.name}
                                                        </Text>
                                                        {item.price > 0 && (
                                                            <Text
                                                                style={[
                                                                    styles.variantPrice,
                                                                    isSelected &&
                                                                        styles.variantPriceSelected,
                                                                ]}
                                                            >
                                                                {formatAmount(item.price)} {product?.currency}
                                                            </Text>
                                                        )}
                                                    </View>
                                                    {isSelected && (
                                                        <View style={styles.quantityControls}>
                                                            <TouchableOpacity
                                                                onPress={() =>
                                                                    updateItemQuantity(
                                                                        item.token,
                                                                        itemQty - 1
                                                                    )
                                                                }
                                                                style={styles.qtyButton}
                                                            >
                                                                <FontAwesome5
                                                                    name="minus"
                                                                    size={12}
                                                                    color="#fff"
                                                                />
                                                            </TouchableOpacity>
                                                            <Text style={styles.qtyText}>
                                                                {itemQty}
                                                            </Text>
                                                            <TouchableOpacity
                                                                onPress={() =>
                                                                    updateItemQuantity(
                                                                        item.token,
                                                                        itemQty + 1
                                                                    )
                                                                }
                                                                style={styles.qtyButton}
                                                            >
                                                                <FontAwesome5
                                                                    name="plus"
                                                                    size={12}
                                                                    color="#fff"
                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    })}
                                </View>
                            ))
                        ) : (
                            <View style={styles.noVariants}>
                                <Text style={styles.noVariantsText}>
                                    {t('common.noVariants') || 'Aucune variante disponible'}
                                </Text>
                            </View>
                        )}

                        <View style={styles.spacer} />
                    </ScrollView>

                    {/* Footer avec Prix, Quantité et Boutons */}
                    <View style={styles.footer}>
                        {/* Affichage du prix */}
                        <View style={styles.priceSection}>
                            <Text style={styles.priceLabel}>
                                {t('common.total') || 'Total'}:
                            </Text>
                            <Text style={styles.priceValue}>
                                {formatAmount(finalPrice)} {product?.currency}
                            </Text>
                        </View>

                        {/* Boutons d'action */}
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                disabled={loading || !hasSelectedVariants}
                                onPress={handleAddToCart}
                                style={[
                                    styles.button,
                                    styles.buttonContinue,
                                    (loading || !hasSelectedVariants) && styles.buttonDisabled,
                                ]}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <>
                                        <FontAwesome5
                                            name="shopping-bag"
                                            size={16}
                                            color="#fff"
                                            style={styles.buttonIcon}
                                        />
                                        <Text style={styles.buttonText}>
                                            {t('buttons.continueShopping') || 'Continuer l\'achat'}
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                disabled={loading || !hasSelectedVariants}
                                onPress={handleGoToCart}
                                style={[
                                    styles.button,
                                    styles.buttonCart,
                                    (loading || !hasSelectedVariants) && styles.buttonDisabled,
                                ]}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <>
                                        <FontAwesome5
                                            name="cart-plus"
                                            size={16}
                                            color="#fff"
                                            style={styles.buttonIcon}
                                        />
                                        <Text style={styles.buttonText}>
                                            {t('buttons.viewCart') || 'Aller au panier'}
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    bottomSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '85%',
        minHeight: '60%',
        flexDirection: 'column',
    },
    handleBar: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 8,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#d0d0d0',
        borderRadius: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 15,
        minHeight: 200,
    },
    productInfo: {
        marginBottom: 20,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    variantSection: {
        marginBottom: 20,
    },
    variantGroupTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    variantRowContainer: {
        marginBottom: 10,
    },
    variantRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    variantRowSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    variantLeftContent: {
        flex: 1,
    },
    variantItemText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000',
    },
    variantItemTextSelected: {
        color: '#fff',
    },
    variantPrice: {
        fontSize: 11,
        fontWeight: '800',
        color: '#666',
        marginTop: 2,
    },
    variantPriceSelected: {
        color: '#fff',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 6,
        paddingHorizontal: 4,
        paddingVertical: 4,
    },
    qtyButton: {
        paddingHorizontal: 6,
        paddingVertical: 4,
    },
    qtyText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
        marginHorizontal: 8,
        minWidth: 20,
        textAlign: 'center',
    },
    noVariants: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    noVariantsText: {
        fontSize: 14,
        color: colors.gray,
    },
    spacer: {
        height: 20,
    },
    footer: {
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingBottom: 20,
    },
    priceSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    priceLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    priceValue: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.primary,
    },
    quantityLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    quantityButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    quantityInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        paddingVertical: 6,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#ddd',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonContinue: {
        backgroundColor: colors.primary,
    },
    buttonCart: {
        backgroundColor: '#000',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonIcon: {
        marginRight: 4,
    },
    buttonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
    },
});

export default VariantsBottomSheet;
