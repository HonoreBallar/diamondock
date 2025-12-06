import { use, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Linking, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import HeaderLogo from "../components/HeaderLogo";
import Title from "../components/Title";
import Input from "../components/Input";
import Btn from "../components/Btn";
import { Picker } from "@react-native-picker/picker";
import { useOrders } from "../context/OrderContext";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDateToEnglish } from "../utils/utils";
import { useCart } from "../context/CartContext";
import SingleDropdownSelect from "../components/SingleDropdownSelect";
import SearchableSelect from "../components/SearchableSelect";
import { useTranslation } from "../context/LocalizationContext";
import { useApiClient } from "../context/ApiContext";

export default function OrderStepTwo({ navigation, route }) {

    const {t} = useTranslation();

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

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setSelectedDate(date.toLocaleDateString('fr-FR')); // Format date to DD/MM/YYYY
        hideDatePicker();
    };

    const getDateOneDaysLater = () => {
        const today = new Date();
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + 1);
        return nextDay;
    }

    const relay_point = "Cocody Angré Djorobité";

    const handleHome = ()=>{
        setChecked('at_home');
        setDelivery('')
    }

    const handleRelayPoint = () => {
        setChecked('relay_point');
        setDelivery(relay_point)
    }

    const handleCash = ()=>{
        setPayment('cash');
        setVisible(false);
    }

    const handleOnline = ()=> {
        setPayment('online');
        setVisible(true);
    }


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

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
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
                                data={countriesData}
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