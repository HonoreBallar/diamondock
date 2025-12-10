import { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Linking, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import HeaderLogo from "../components/HeaderLogo";
import Title from "../components/Title";
import Input from "../components/Input";
import Btn from "../components/Btn";
import CustomSelect from "../components/CustomSelect";
import { useOrders } from "../context/OrderContext";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { formatDateToEnglish } from "../utils/utils";
import { useCart } from "../context/CartContext";
import SearchableSelect from "../components/SearchableSelect";
import { useTranslation } from "../context/LocalizationContext";
import { useRootContext } from "../context/RootContext";

export default function OrderStepTwo({ navigation, route }) {

    const {t} = useTranslation();
    const {countries, getMunicipalities, getRegions, regions, municipalities, typeDelivery} = useRootContext();

    const {modePayment, fetchOrder} = useOrders();
    const {clearCart} = useCart();
    const {datas} = route.params;
    const [delivery, setDelivery] = useState('');
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState('');
    const [payment, setPayment] = useState('cash');
    const [selectedPayment, setSelectedPayment] = useState('');

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedCommune, setSelectedCommune] = useState(null);
    const [loadingRegions, setLoadingRegions] = useState(false);
    const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);

    // Charger les régions quand le pays change
    useEffect(() => {
        if (selectedCountry) {
            setLoadingRegions(true);
            setSelectedRegion(null);
            setSelectedCommune(null);
            getRegions(selectedCountry.id || selectedCountry).then(() => {
                setLoadingRegions(false);
            }).catch(() => {
                setLoadingRegions(false);
            });
        }
    }, [selectedCountry]);

    // Charger les communes quand la région change
    useEffect(() => {
        if (selectedRegion && selectedCountry) {
            setLoadingMunicipalities(true);
            setSelectedCommune(null);
            getMunicipalities(selectedRegion.id || selectedRegion).then(() => {
                setLoadingMunicipalities(false);
            }).catch(() => {
                setLoadingMunicipalities(false);
            });
        }
    }, [selectedRegion]);

    const handleSubmit = () => {

        if (delivery.trim() === '') {
            showMessage({
                message: t('alerts.deliveryAddress'),
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }
        if (selectedDate === '') {
            showMessage({
                message: t('alerts.deliveryDate'),
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }
        if(payment === 'online' && selectedPayment.trim() === ''){
             showMessage({
                message: t('alerts.paymentMethod'),
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }
        const order = {
            ...datas,
            delivery:{
                method: checked,
                address: checked == "relay_point" ? relay_point : delivery,
                date: selectedDate != '' ? formatDateToEnglish(selectedDate) : null,
            },
            payment: {
                method: payment,
                option: selectedPayment
            }
        }
                
        setTimeout(async () => {
            setLoading(true);
            try {
                const response = await fetchOrder(order);
                const responseData = response?.data?.data;
                if (response.status) {
                    clearCart();
                    if (responseData?.payment_method == 'cash') {
                        showMessage({
                            message: t('alerts.orderSuccess'),
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
                                    message: t('alerts.paiementWainting'),
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
            finally{
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
                        <Title title={t('common.step2')} />
                    </View>
                    <ScrollView style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={{ marginTop: 20, marginHorizontal: 15 }}>
                            <SearchableSelect
                                label="Pays"
                                data={countries}
                                value={selectedCountry}
                                onChange={setSelectedCountry}
                                placeholder="Sélectionner un pays"
                                isRequired
                            />
                            <SearchableSelect
                                label="Région"
                                data={regions}
                                value={selectedRegion}
                                onChange={setSelectedRegion}
                                placeholder="Sélectionner une région"
                                disabled={!selectedCountry || loadingRegions}
                                loading={loadingRegions}
                            />
                            <SearchableSelect
                                label="Commune"
                                data={municipalities}
                                value={selectedCommune}
                                onChange={setSelectedCommune}
                                placeholder="Sélectionner une commune"
                                disabled={!selectedRegion || loadingMunicipalities}
                                loading={loadingMunicipalities}
                            />

                            <CustomSelect
                                label="Type de livraison"
                                data={typeDelivery}
                                value={checked}
                                onChange={setChecked}
                                placeholder="Sélectionner un type de livraison"
                                isRequired
                            />
                            
                            <Input
                                label={t('input.deliveryAddressTitle')}
                                icon="map-marker-alt"
                                placeholder={t('input.deliveryAddressTitle')}
                                value={delivery}
                                onChangeText={setDelivery}
                                isRequired={true}
                            />
                           
                            <View style={{ marginBottom: 15, marginTop: 12 }}>
                                <Btn
                                    label={t('common.save')}
                                    loader={loading}
                                    disabled={loading}
                                    action={handleSubmit}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}