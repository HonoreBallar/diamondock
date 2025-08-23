import { use, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Linking, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import HeaderLogo from "../components/HeaderLogo";
import Title from "../components/Title";
import Input from "../components/Input";
import Btn from "../components/Btn";
import { RadioButton } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useOrders } from "../context/OrderContext";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDateToEnglish } from "../utils/utils";
import { useCart } from "../context/CartContext";
import SingleDropdownSelect from "../components/SingleDropdownSelect";
import { useTranslation } from "../context/LocalizationContext";

export default function OrderStepTwo({ navigation, route }) {

    const {t} = useTranslation();

    const {modePayment, fetchOrder} = useOrders();
    const {clearCart} = useCart();
    const {datas} = route.params;
    const [address, setAddress] = useState('');
    const [delivery, setDelivery] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [checked, setChecked] = useState('at_home');
    const [payment, setPayment] = useState('cash');
    const [selectedPayment, setSelectedPayment] = useState('');
    const [visible, setVisible] = useState(false);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

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
                message: "Veuillez entrer une adresse de livraison",
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }
        if (selectedDate === '') {
            showMessage({
                message: "Veuillez sélectionner une date de livraison",
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }
        if(payment === 'online' && selectedPayment.trim() === ''){
             showMessage({
                message: "Veuillez sélectionner un moyen de paiement",
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
                const responseData = response?.data;
                if (response.status) {
                    clearCart();
                    if (responseData?.payment_method == 'cash') {
                        showMessage({
                            message: "Commande créée avec succès",
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
                                    message: "Paiement en cours de validation...",
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
                            <Text style={{fontSize:15, fontWeight: 'bold', marginBottom: 8}}>{t('input.deliveryModeTitle')}</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2}}>
                                <TouchableOpacity onPress={handleHome} style={{flexDirection: 'row'}}>
                                    <RadioButton
                                        value="at_home"
                                        color="#03045e"
                                        status={ checked === 'at_home' ? 'checked' : 'unchecked' }
                                        onPress={handleHome}
                                    />
                                    <Text style={{marginTop:7, fontWeight: '500'}}>Livraison à domicile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleRelayPoint} style={{flexDirection: 'row'}}>
                                    <RadioButton
                                        value="relay_point"
                                        color="#03045e"
                                        status={ checked === 'relay_point' ? 'checked' : 'unchecked' }
                                        onPress={handleRelayPoint}
                                    />
                                    <Text style={{marginTop:7, fontWeight: "500"}}>Point relais</Text>
                                </TouchableOpacity>
                            </View>
                            <Input
                                label={t('input.deliveryAddressTitle')}
                                icon="map-marker-alt"
                                placeholder={t('input.deliveryAddressTitle')}
                                value={delivery}
                                onChangeText={setDelivery}
                                isRequired={true}
                                editable={checked == 'at_home'  ? true : false}
                            />
                             <View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontSize: 15,marginBottom: 8,fontWeight: 'bold',}}>{t('input.deliveryDateTitle')}</Text>
                                    {visible && <Text style={{color: 'red'}}> *</Text>}
                                </View>
                                <TouchableOpacity onPress={showDatePicker} style={{borderWidth: 1, borderColor: "#c5c5c5", padding: 13, borderRadius: 15, marginBottom: 10}}>
                                    <View style={{flexDirection: 'row', justifyContent: ''}}>
                                        <FontAwesome5 name="calendar" size={18} color="black" style={{fontSize: 18, marginRight: 5,}} />
                                        <Text style={{}}>{selectedDate != '' ? selectedDate.toLocaleString() : t('input.deliveryDateTitle')}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <Text style={{fontSize:15, fontWeight: 'bold', marginBottom: 8}}>{t('input.paymentModeTitle')}</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                                <TouchableOpacity onPress={handleCash} style={{flexDirection: 'row'}}>
                                    <RadioButton
                                        value="cash"
                                        color="#03045e"
                                        status={ payment === 'cash' ? 'checked' : 'unchecked' }
                                        onPress={handleCash}
                                    />
                                    <Text style={{marginTop:7, fontWeight: '500'}}>Cash à la livraison</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleOnline} style={{flexDirection: 'row'}}>
                                    <RadioButton
                                        value="online"
                                        color="#03045e"
                                        status={ payment === 'online' ? 'checked' : 'unchecked' }
                                        onPress={handleOnline}
                                    />
                                    <Text style={{marginTop:7, fontWeight: "500"}}>Paiement en ligne</Text>
                                </TouchableOpacity>
                            </View>
                            {visible && (
                                <View style={{
                                    borderColor: '#ccc',
                                    marginBottom: 15,
                                }}>
                                    <View>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={{fontSize:15, fontWeight: 'bold', marginBottom: 8, marginRight: 3}}>{t('input.system')}</Text>
                                            <Text style={{color: 'red'}}>*</Text>
                                        </View>
                                        <SingleDropdownSelect items={modePayment} iconSelect="wallet" onSelectHandler={(_)=>setSelectedPayment(_?.name)}/>
                                    </View>
                                </View>
                            )}
                            <Btn
                                label={t('common.save')}
                                loader={loading}
                                disabled={loading}
                                action={handleSubmit}
                            />
                        </View>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            format="DD-MM-YYYY"
                            placeholder="Selectionner une date"
                            minimumDate={getDateOneDaysLater()}
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}