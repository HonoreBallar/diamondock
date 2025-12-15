import { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Linking, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import HeaderLogo from "../components/HeaderLogo";
import Title from "../components/Title";
import Input from "../components/Input";
import Btn from "../components/Btn";
import CustomSelect from "../components/CustomSelect";
import { useOrders } from "../context/OrderContext";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { formatDateToEnglish, formatAmount } from "../utils/utils";
import { useCart } from "../context/CartContext";
import { useTranslation } from "../context/LocalizationContext";
import { useRootContext } from "../context/RootContext";

export default function OrderStepThree({ navigation, route }) {

    const { t } = useTranslation();
    const { modePayment, fetchOrder } = useOrders();
    const { clearCart } = useCart();
    const { datas } = route.params;
    
    const [loading, setLoading] = useState(false);
    const [payment, setPayment] = useState('cash');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);

    const paymentMethods = [
        { id: 'cash', name: 'Paiement à la livraison' },
        { id: 'online', name: 'Paiement en ligne' }
    ];

    const paymentOptions = modePayment || [
        { id: 'stripe', name: 'Stripe' },
        { id: 'paypal', name: 'PayPal' },
        { id: 'momobi', name: 'Mobile Money' }
    ];

    const handleSubmit = () => {
        if (payment === 'online' && !selectedPayment?.id) {
            showMessage({
                message: t('alerts.paymentMethod') || 'Veuillez sélectionner une méthode de paiement',
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }

        const order = {
            ...datas,
            payment: {
                method: payment,
                option: selectedPayment?.id || payment
            }
        };

        setTimeout(async () => {
            setLoading(true);
            try {
                const response = await fetchOrder(order);
                const responseData = response?.data?.data;
                if (response.status) {
                    clearCart();
                    if (responseData?.payment_method == 'cash') {
                        showMessage({
                            message: t('alerts.orderSuccess') || 'Commande créée avec succès',
                            type: "success",
                            icon: { icon: "success", position: "left" },
                            duration: 2000,
                        });
                        clearCart(false);
                        navigation.navigate('Main');
                        setLoading(false);
                    } else {
                        Linking.openURL(responseData?.payment_url)
                            .then(() => {
                                showMessage({
                                    message: t('alerts.paiementWainting') || 'Redirection vers le paiement',
                                    type: "success",
                                    icon: { icon: "success", position: "left" },
                                    duration: 2000,
                                });
                                navigation.navigate('Main');
                                setLoading(false);
                            })
                            .catch((error) => {
                                console.error('Error opening URL:', error);
                                setLoading(false);
                            });
                    }
                } else {
                    showMessage({
                        message: "Error " + response?.message,
                        type: "danger",
                        icon: { icon: "danger", position: "left" },
                        duration: 2000,
                    });
                    setLoading(false);
                }
            } catch (error) {
                showMessage({
                    message: "Error " + error.message,
                    type: "danger",
                    icon: { icon: "danger", position: "left" },
                    duration: 2000,
                });
                setLoading(false);
            }
            finally {
                setLoading(false);
            }
        }, 100);
    };

    return (
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: 'white' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <View style={{ paddingTop: 10 }}>
                        <HeaderLogo />
                        <Title title={t('common.step3') || 'Étape 3 - Paiement'} />
                    </View>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={{ marginTop: 20, marginHorizontal: 15 }}>
                            {/* Méthode de Paiement */}
                            <CustomSelect
                                label={t('common.paymentMethod') || "Méthode de paiement"}
                                data={paymentMethods}
                                value={paymentMethods.find(opt => opt.id === payment)}
                                onChange={(item) => {
                                    setPayment(item.id);
                                    setSelectedPayment(null);
                                }}
                                placeholder="Sélectionner une méthode de paiement"
                                isRequired
                            />

                            {/* Options de paiement si paiement en ligne est sélectionné */}
                            {payment === 'online' && (
                                <CustomSelect
                                    label={t('common.paymentOption') || "Options de paiement"}
                                    data={paymentOptions}
                                    value={selectedPayment}
                                    onChange={setSelectedPayment}
                                    placeholder="Sélectionner une option de paiement"
                                    isRequired
                                />
                            )}

                            {/* Carte de résumé pliable */}
                            <View style={{borderWidth: 0.8, borderColor: '#ccc', borderRadius: 10, marginBottom: 10, marginTop: 5, overflow: 'hidden'}}>
                                <TouchableOpacity 
                                    onPress={() => setIsSummaryExpanded(!isSummaryExpanded)} 
                                    style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#f9f9f9'}}
                                >
                                    <Text style={{color: '#000', fontSize: 15, fontWeight: '600'}}>{t('common.summary') || 'Résumé'}</Text>
                                    <FontAwesome5 name={isSummaryExpanded ? 'chevron-up' : 'chevron-down'} size={15} color="black" />
                                </TouchableOpacity>
                                {isSummaryExpanded && (
                                    <View style={{borderTopWidth: 0.8, borderTopColor: '#ccc', padding: 16, backgroundColor: '#fff'}}>
                                        {/* Sous-total */}
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                                            <Text style={{fontSize: 14, color: '#666'}}>{t('common.subtotal') || 'Sous-total'}</Text>
                                            <Text style={{fontSize: 14, fontWeight: '600', color: '#000'}}>
                                                {formatAmount(datas?.subtotal || 0)} {datas?.currency || 'F CFA'}
                                            </Text>
                                        </View>

                                        {/* Livraison */}
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: '#ddd'}}>
                                            <Text style={{fontSize: 14, color: '#666'}}>{t('common.delivery') || 'Livraison'}</Text>
                                            <Text style={{fontSize: 14, fontWeight: '600', color: '#000'}}>
                                                {formatAmount(datas?.delivery_price || 0)} {datas?.currency || 'F CFA'}
                                            </Text>
                                        </View>

                                        {/* Total */}
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <Text style={{fontSize: 16, fontWeight: '700', color: '#000'}}>{t('common.total') || 'Total'}</Text>
                                            <Text style={{fontSize: 16, fontWeight: '700', color: '#f29f03'}}>
                                                {formatAmount((datas?.subtotal || 0) + (datas?.delivery_price || 0))} {datas?.currency || 'F CFA'}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>

                            {/* Bouton de validation */}
                            <View style={{ marginBottom: 15, marginTop: 15 }}>
                                <Btn
                                    label={payment === 'online' ? (t('common.proceedPayment') || 'Procéder au paiement') : (t('common.confirmOrder') || 'Confirmer la commande')}
                                    loader={loading}
                                    disabled={loading}
                                    action={handleSubmit}
                                />
                            </View>

                            {/* Information supplémentaire */}
                            <View style={{
                                marginTop: 16,
                                padding: 12,
                                backgroundColor: '#eff6ff',
                                borderRadius: 8,
                                borderLeftWidth: 4,
                                borderLeftColor: '#0284c7'
                            }}>
                                <Text style={{
                                    fontSize: 12,
                                    color: '#0c4a6e',
                                    lineHeight: 18
                                }}>
                                    {payment === 'online'
                                        ? t('alerts.paiementInfo') || 'Vous serez redirigé vers la page de paiement sécurisée.'
                                        : t('alerts.cashInfo') || 'Vous paierez à la réception de votre commande.'
                                    }
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
