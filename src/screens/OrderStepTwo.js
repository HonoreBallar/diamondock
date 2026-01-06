import { useEffect, useState } from "react";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Linking, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import HeaderLogo from "../components/HeaderLogo";
import Title from "../components/Title";
import Input from "../components/Input";
import CustomSelect from "../components/CustomSelect";
import { useOrders } from "../context/OrderContext";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { formatAmount, formatDateToEnglish } from "../utils/utils";
import { useCart } from "../context/CartContext";
import { useApiClient } from "../context/ApiContext";
import SearchableSelect from "../components/SearchableSelect";
import { useTranslation } from "../context/LocalizationContext";
import { useRootContext } from "../context/RootContext";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from "../utils/colors";


export default function OrderStepTwo({ navigation, route }) {

    const {t} = useTranslation();
    const apiClient = useApiClient();
    const {countries, getMunicipalities, getRegions, regions, municipalities, typeDelivery} = useRootContext();

    const {modePayment, fetchOrder, getDeliveryPrice} = useOrders();
    const {clearCart, productListInCart} = useCart();
    const {datas} = route.params;
    const [delivery, setDelivery] = useState('');
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState('');
    const [payment, setPayment] = useState('cash');
    const [selectedPayment, setSelectedPayment] = useState('');

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedCommune, setSelectedCommune] = useState(null);
    const [selectedDeliveryType, setSelectedDeliveryType] = useState(null);
    const [loadingRegions, setLoadingRegions] = useState(false);
    const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
    const [loadingDeliveryPrice, setLoadingDeliveryPrice] = useState(false);
    const [productDeliveryPrice, setProductDeliveryPrice] = useState([]);

    // Charger les régions quand le pays change
    useEffect(() => {
        if (selectedCountry) {
            setLoadingRegions(true);
            setSelectedRegion(null);
            setSelectedCommune(null);
            setSelectedDeliveryType(null);
            setLoadingDeliveryPrice(false);
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
            setSelectedDeliveryType(null);
            setLoadingDeliveryPrice(false);
            getMunicipalities(selectedRegion.id || selectedRegion).then(() => {
                setLoadingMunicipalities(false);
            }).catch(() => {
                setLoadingMunicipalities(false);
            });
        }
    }, [selectedRegion]);

    //Choisir le type de livraison quand la commune change
    useEffect(() => {
        if (selectedCommune) {
            setSelectedDeliveryType(null);
            setLoadingDeliveryPrice(false);
        }
    }, [selectedCommune]);

    // Charger le prix quand le mode de paiement change
    const handleChange = async() => {

        if(!selectedDeliveryType.token && !selectedCountry) {
            return;
        }

        setLoadingDeliveryPrice(true);

        const requestData = {
            delivery: {
                country_id: selectedCountry?.id, 
                municipality_id: selectedCommune?.id || '', 
                address: "Cocody", 
                date: "2025-09-17", 
                method: "at_home", 
                type: selectedDeliveryType?.token
            },
            products: productListInCart
        };

        try {
            const response = await getDeliveryPrice(requestData);
            
            if (response?.status === false) {
                setProductDeliveryPrice([]);
            } else {
                setProductDeliveryPrice(response?.data?.data || []);
            }
        } catch (error) {
            console.error('Error fetching delivery price:', error);
            setProductDeliveryPrice([]);
        } finally {
            setLoadingDeliveryPrice(false);
        }
    }

    // Exécuter handleChange quand selectedDeliveryType change
    useEffect(() => {
        if (selectedDeliveryType) {
            handleChange();
        }
    }, [selectedDeliveryType]);

    const handleSubmit = () => {

        if (selectedCountry == null) {
            showMessage({
                message: t('alerts.selectCountry'),
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }

        // if (selectedRegion == null) {
        //     showMessage({
        //         message: t('alerts.selectRegion'),
        //         type: "danger",
        //         icon: { icon: "danger", position: "left" },
        //         duration: 2000,
        //     });
        //     return;
        // }

        // if (selectedCommune == null) {
        //     showMessage({
        //         message: t('alerts.selectMunicipality'),
        //         type: "danger",
        //         icon: { icon: "danger", position: "left" },
        //         duration: 2000,
        //     });
        //     return;
        // }

        if(typeDelivery == null){
            showMessage({
                message: t('alerts.deliveryMode'),
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }

        if (delivery.trim() === '') {
            showMessage({
                message: t('alerts.deliveryAddress'),
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
        const _datas = {
            ...datas,
            delivery: {
                country_id: selectedCountry?.id, 
                municipality_id: selectedCommune?.id || '', 
                address: delivery, 
                date: "2025-09-17", 
                method: "at_home", 
                type: selectedDeliveryType?.token
            },
            reduction: {
                code: "", 
                amount: ""
            },
            productDeliveryPrice : productDeliveryPrice,
        }

        setLoading(true);
        setTimeout(()=>{
            navigation.navigate('OrderStepThree', {datas: _datas});
            setLoading(false);
        }, 200);
        
        
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
                                label={t('input.countryTitle') || "Pays"}
                                data={countries}
                                value={selectedCountry}
                                onChange={setSelectedCountry}
                                placeholder={t('input.countryPlaceholder') || "Sélectionner un pays"}
                                isRequired
                            />
                            <SearchableSelect
                                label={t('input.regionTitle') || "Région"}
                                data={regions}
                                value={selectedRegion}
                                onChange={setSelectedRegion}
                                placeholder={t('input.regionPlaceholder') || "Sélectionner une région"}
                                disabled={!selectedCountry || loadingRegions}
                                loading={loadingRegions}
                            />
                            <SearchableSelect
                                label={t('input.municipalityTitle') || "Commune"}
                                data={municipalities}
                                value={selectedCommune}
                                onChange={setSelectedCommune}
                                placeholder={t('input.municipalityPlaceholder') || "Sélectionner une commune"}
                                disabled={!selectedRegion || loadingMunicipalities}
                                loading={loadingMunicipalities}
                            />

                            <CustomSelect
                                label={t('input.deliveryModeTitle') || "Type de livraison"}
                                data={typeDelivery}
                                value={selectedDeliveryType}
                                onChange={setSelectedDeliveryType}
                                placeholder="Sélectionner un type de livraison"
                                isRequired
                                labelKey="name"
                                valueKey="token"
                                disabled={!selectedCountry}
                            />

                            {loadingDeliveryPrice ? (
                                <View style={{
                                    marginTop: 5,
                                    padding: 12,
                                    backgroundColor: '#eff6ff',
                                    borderRadius: 8,
                                    borderLeftWidth: 4,
                                    borderLeftColor: '#0284c7',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <ActivityIndicator size="large" color="#0284c7" />
                                    <Text style={{
                                        fontSize: 12,
                                        color: '#0c4a6e',
                                        marginTop: 3
                                    }}>
                                        {t('input.deliveryFeesCalculating') || 'Calcul des frais de livraison...'}
                                    </Text>
                                </View>
                            ) : selectedDeliveryType?.token ? (
                                <View style={{
                                    marginTop: 1,
                                    marginBottom: 10,
                                    padding: 12,
                                    backgroundColor: '#eff6ff',
                                    borderRadius: 8,
                                    borderLeftWidth: 4,
                                    borderLeftColor: '#0284c7'
                                }}>

                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        <Text style={{
                                            fontSize: 12,
                                            color: '#0c4a6e',
                                            lineHeight: 18
                                        }}>
                                            {t('input.deliveryAmount') || 'Le montant de la livraison est de :'}{' '}
                                        </Text>
                                        <Text style={{
                                            fontSize: 12,
                                            color: '#0c4a6e',
                                            lineHeight: 18,
                                            fontWeight: 'bold'
                                        }}>
                                            {formatAmount(productDeliveryPrice?.delivery_charges || 0)} {productDeliveryPrice?.currency || 'F CFA'}
                                        </Text>
                                    </View>
                                </View>
                            ) : null}

                            <Input
                                label={t('input.deliveryAddressTitle')}
                                icon="map-marker-alt"
                                placeholder={t('input.deliveryAddressTitle')}
                                value={delivery}
                                onChangeText={setDelivery}
                                isRequired={true}
                            />
                           
                            <View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 15}}>
                                <TouchableOpacity onPress={()=>navigation.goBack()} style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.primary}}>
                                    <FontAwesome5 name="arrow-left" size={16} color={colors.primary} />
                                    <Text style={{color: colors.primary, fontWeight: 'bold', marginLeft: 8, fontSize: 14}}>{t('common.delivery')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSubmit} disabled={selectedDeliveryType == null || loadingDeliveryPrice || loading} style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10, backgroundColor: colors.primary, opacity: (selectedDeliveryType == null || loadingDeliveryPrice || loading) ? 0.6 : 1}}>
                                    {loading && <ActivityIndicator size="small" color="white" style={{marginRight: 8}} />}
                                    <Text style={{color: 'white', fontWeight: 'bold', marginRight: 8, fontSize: 14}}>{t('input.paymentTitle') || 'Paiement'}</Text>
                                    <FontAwesome5 name="arrow-right" size={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}