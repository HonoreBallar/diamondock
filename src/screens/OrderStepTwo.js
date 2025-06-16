import { useState } from "react";
import { Keyboard, KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import HeaderLogo from "../components/HeaderLogo";
import Title from "../components/Title";
import Input from "../components/Input";
import Btn from "../components/Btn";
import { RadioButton } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useOrders } from "../context/OrderContext";
import FlashMessage, { showMessage } from 'react-native-flash-message';

export default function OrderStepTwo({ navigation, route }) {

    const {modePayment, fetchOrder} = useOrders();
    const {datas} = route.params;
    const [address, setAddress] = useState('');
    const [delivery, setDelivery] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [checked, setChecked] = useState('at_home');
    const [payment, setPayment] = useState('cash');
    const [selectedPayment, setSelectedPayment] = useState();
    const [visible, setVisible] = useState(false);

    const relay_point = "Cocody Riviéra Faya";

    const handleHome = ()=>{
        setChecked('at_home');
    }

    const handleRelayPoint = () => {
        setChecked('relay_point');
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

        const order = {
            ...datas,
            delivery:{
                method: checked,
                address: checked == "relay_point" ? relay_point : delivery,
                // date: selectedDate != '' ? formatDateToEnglish(selectedDate) : null,
                data: '2025-04-19'
            },
            payment_method: {
                method: payment,
                option: selectedPayment
            }
        }
        console.log(order);
        return;
        
        setTimeout(async () => {
            setLoading(true);
            try {
                const response = await fetchOrder(order);
                console.log(response);
                const responseData = response.data;
                // if (responseData.status) {
                //     clearCart();
                //     if (responseData.data.payment_method == 'cash') {
                //         showMessage({
                //             message: "Commande créée avec succès",
                //             type: "success",
                //             icon: { icon: "success", position: "left" },
                //             duration: 2000,
                //         });
                //         clearCart(false);
                //         navigation.navigate('Main');
                //         setLoading(false);
                //     } else {
                //         Linking.openURL(responseData?.data?.payment_url)
                //             .then(() => {
                //                 showMessage({
                //                     message: "Paiement en cours de validation...",
                //                     type: "success",
                //                     icon: { icon: "success", position: "left" },
                //                     duration: 2000,
                //                 });
                //                 navigation.navigate('Main');
                //                 setLoading(false);
                //             })
                //             .catch((error) => {
                //                 console.error('Erreur lors du chargement dans le navigateur', error);
                //                 setLoading(false);
                //             });
                //     }
                // } else {
                //     showMessage({
                //         message: "Une erreur s'est produite",
                //         type: "danger",
                //         icon: { icon: "danger", position: "left" },
                //         duration: 2000,
                //     });
                //     setLoading(false);
                // }
            } catch (error) {
                showMessage({
                    message: "Erreur " + error.message,
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
                        <Title title="Étape 2 : Informations de livraison" />
                        <View style={{ marginTop: 20, marginHorizontal: 15 }}>
                            <Text style={{fontSize:15, fontWeight: 'bold', marginBottom: 8}}>Mode de livraison</Text>
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
                                label="Adresse de livraison"
                                icon="map-marker-alt"
                                placeholder="Entrez votre adresse"
                                value={delivery}
                                onChangeText={setDelivery}
                                isRequired={true}
                            />
                            <Text style={{fontSize:15, fontWeight: 'bold', marginBottom: 8}}>Mode de paiement</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
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
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 18,
                                    marginBottom: 15,
                                    marginTop: 6,
                                    overflow: 'hidden'
                                }}>
                                    <Picker
                                        selectedValue={selectedPayment}
                                        onValueChange={(itemValue, itemIndex) =>
                                            setSelectedPayment(itemValue)
                                        }
                                    >
                                        {modePayment.map((payment, index) => (
                                            <Picker.Item 
                                                key={index}
                                                label={payment} 
                                                value={payment} 
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            )}
                            <Btn
                                label="Suivant"
                                title="Suivant"
                                loading={loading}
                                action={handleSubmit}
                            />
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}