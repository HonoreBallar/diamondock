import { use, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Linking, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import HeaderLogo from "../components/HeaderLogo";
import Title from "../components/Title";
import Input from "../components/Input";
import Btn from "../components/Btn";
import { useOrders } from "../context/OrderContext";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { formatDateToEnglish } from "../utils/utils";
import { useCart } from "../context/CartContext";
import SearchableSelect from "../components/SearchableSelect";
import { useTranslation } from "../context/LocalizationContext";
import { useRootContext } from "../context/RootContext";

export default function OrderStepTwo({ navigation, route }) {

    const {t} = useTranslation();
    const {countries} = useRootContext();

    const {modePayment, fetchOrder} = useOrders();
    const {clearCart} = useCart();
    const {datas} = route.params;
    const [delivery, setDelivery] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [checked, setChecked] = useState('at_home');
    const [payment, setPayment] = useState('cash');
    const [selectedPayment, setSelectedPayment] = useState('');
    const [visible, setVisible] = useState(false);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedCommune, setSelectedCommune] = useState(null);


    // Données exemple
    const countriesData = [
        { token: '1', name: 'Côte d\'Ivoire' },
        { token: '2', name: 'Sénégal' },
        { token: '3', name: 'Mali' },
        { token: '4', name: 'Burkina Faso' },
        { token: '5', name: 'Ghana' },
        { token: '6', name: 'Nigeria' },
        { token: '7', name: 'Togo' },
        { token: '8', name: 'Bénin' },
        { token: '9', name: 'Guinée' },
        { token: '10', name: 'Libéria' },
    ];

    const regionsData = [
        { token: '1', name: 'Abidjan' },
        { token: '2', name: 'Yamoussoukro' },
        { token: '3', name: 'Gagnoa' },
        { token: '4', name: 'Korhogo' },
        { token: '5', name: 'Bouaké' },
    ];

    const communesData = [
        { token: '1', name: 'Cocody' },
        { token: '2', name: 'Plateau' },
        { token: '3', name: 'Treichville' },
        { token: '4', name: 'Marcory' },
        { token: '5', name: 'Yopougon' },
    ];



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
                    <ScrollView style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <HeaderLogo />
                        <Title title={t('common.step2')} />
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
                                data={regionsData}
                                value={selectedRegion}
                                onChange={setSelectedRegion}
                                placeholder="Sélectionner une région"
                                isRequired
                            />
                            <SearchableSelect
                                label="Commune"
                                data={communesData}
                                value={selectedCommune}
                                onChange={setSelectedCommune}
                                placeholder="Sélectionner une commune"
                                isRequired
                            />
                            
                            <Input
                                label={t('input.deliveryAddressTitle')}
                                icon="map-marker-alt"
                                placeholder={t('input.deliveryAddressTitle')}
                                value={delivery}
                                onChangeText={setDelivery}
                                isRequired={true}
                                editable={checked == 'at_home'  ? true : false}
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