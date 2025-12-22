import { useEffect, useState } from "react";
import HeaderLogo from "../components/HeaderLogo";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { Image, Keyboard, KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Title from "../components/Title";
import Btn from "../components/Btn";
import Input from "../components/Input";
import colors from "../utils/colors";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useCart } from "../context/CartContext";
import { formatAmount } from "../utils/utils";
import { useRootContext } from "../context/RootContext";
import SingleDropdownSelect from "../components/SingleDropdownSelect";
import PhoneInput from "react-native-phone-number-input";
import { useRef } from "react";
import { useTranslation } from "../context/LocalizationContext";

export default function OrderStepOne({navigation}) {
    const {t} = useTranslation();
    const { cart, getTotal, productListInCart, currency } = useCart();
    const {auth, countries} = useRootContext();
    const phoneInput = useRef(null);
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [phone, setPhone] = useState(auth?.user?.phone_detail?.number || '');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [countryCode, setCountryCode] = useState(auth?.user?.phone_detail?.slug || 'CI');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');


    useEffect(()=>{
        if(auth.isLoggedIn && auth.user){
            setFirstname(auth?.user?.firstname);
            setLastname(auth?.user?.lastname);
            setEmail(auth.user.email);
            setAddress(auth.user.address);
        }
    },[auth?.user]);

    const handleNext = () => {
        if (phone.trim() === '' || firstname.trim() === '' || lastname.trim() === '' || email.trim() === '' || address.trim() === '') {
            showMessage({
                message: "Veuillez remplir tous les champs",
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }

        const code = phoneInput.current?.getCallingCode();
        
        const completePhone =  `+${code}${phone}`;
        const customer = {
            firstname: firstname,
            lastname: lastname,
            phone: completePhone,
            email: email,
            address: address,
        }

        const datas = {
            customer: customer,
            products: productListInCart,
        };
        
        setLoading(true);
        setTimeout(()=>{
            navigation.navigate('OrderStepTwo', {datas: datas});
            setLoading(false);
        }, 200);

    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: 'white' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{flex: 1}}>
                    <HeaderLogo />
                    <Title title={t('common.step1')} />
                    <ScrollView style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={{ marginTop: 20, marginHorizontal: 15 }}>
                            <View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontSize:15, fontWeight: 'bold', marginBottom: 8, marginRight: 3}}>{t('input.phoneTitle')}</Text>
                                    <Text style={{color: 'red'}}>*</Text>
                                </View>
                            </View>
                            <View>
                                <PhoneInput
                                    ref={phoneInput}
                                    value={phone}
                                    defaultCode={countryCode}
                                    layout="second"
                                    onChangeText={setPhone}
                                    placeholder={t('input.phonePlaceholder')}
                                    containerStyle={{
                                        width: "100%",
                                        borderRadius: 15,
                                        marginBottom: 12,
                                        height: 43,
                                        borderWidth: 1,
                                        borderColor: '#ccc',
                                        paddingLeft: 0,
                                        backgroundColor: '#fff',
                                        flexDirection: "row"
                                    }}

                                    textContainerStyle={{
                                        flex: 0.9,
                                        backgroundColor: '#fff',
                                        paddingVertical: 0,
                                        paddingLeft: 0
                                    }}
                                />
                            </View>
                            <Input
                                label={t('input.firstnameTitle')}
                                isRequired
                                icon="user-tie"
                                placeholder={t('input.firstnamePlaceholder')}
                                value={firstname}
                                onChangeText={setFirstname}
                            />
                            <Input
                                label={t('input.lastnameTitle')}
                                isRequired 
                                icon="user-tie"
                                placeholder={t('input.lastnamePlaceholder')}
                                value={lastname}
                                onChangeText={setLastname}
                            />
                            <Input
                                label={t('input.emailTitle')}
                                isRequired 
                                icon="user-tie"
                                placeholder={t('input.emailPlaceholder')}
                                value={email}
                                onChangeText={setEmail}
                            />
        
                            <Input
                                label={t('input.addressTitle')}
                                icon="map-marker-alt"
                                isRequired
                                placeholder={t('input.addressPlaceholder')}
                                value={address}
                                onChangeText={setAddress}
                            />
                            <View style={{borderWidth: 1 , borderColor: '#ccc', borderRadius: 10, marginTop: 10}}>
                                <TouchableOpacity onPress={toggleExpanded} style={{flexDirection: 'row', justifyContent: 'space-between', padding: 15}}>
                                    <Text style={{color: colors.primary, fontSize: 15}}>{t('common.summarycart')}</Text>
                                    <FontAwesome5 name={isExpanded ? 'chevron-up' : 'chevron-down'} size={15} color="black" style={{}}/>
                                </TouchableOpacity>
                                {isExpanded && (
                                    cart.map(product => (
                                        <View key={product.uniqueKey} style={{flexDirection: 'row', justifyContent:'space-between', marginHorizontal: 15, marginVertical: 10}}>
                                            <View style={{flexDirection: 'row'}}>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <View style={{marginRight: 15, height: 40, width: 40, borderRadius: 45, backgroundColor: 'white', borderWidth: 0.2, justifyContent: 'center', alignItems: 'center'}}>
                                                        <Image source={{uri: product?.main_image}} style={{height: 40, width: 40, borderRadius: 40}}/>
                                                    </View>
                                                    <View style={{borderWidth: 0.1, backgroundColor: '#e5ebfc', height: 18, width: 18, borderRadius:15, justifyContent: 'center', alignItems: 'center',position: 'absolute', top: 4, left: 30 }}>
                                                        <Text style={{fontSize: 11, fontWeight: '500'}}>{product.quantity}</Text>
                                                    </View>
                                                    <View style={{width: '65%',flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                        <Text style={{width: '40%'}} numberOfLines={3}>{product?.name}</Text>
                                                        <Text style={{fontWeight: 'bold', fontSize: 18}}>{formatAmount(product.price * product.quantity)} {product?.currency}</Text>
                                                    </View>
                                                </View>
                                                <Text style={{width: '60%', marginRight: 5}} numberOfLines={2}>{product.name} ({product.quantity})</Text>
                                            </View>
                                            {/* <Text style={{fontWeight: 'bold'}}>{formatAmount(product.price * product.quantity)} {product?.currency}</Text> */}
                                        </View>
                                    ))
                                )}
                                <View style={{flexDirection: 'row', justifyContent:'space-between', marginHorizontal: 15, marginBottom: 10}}>
                                    <Text style={{fontSize: 17, fontWeight: 'bold', marginBottom: 8, marginLeft: 3}}>Total</Text>
                                    <Text style={{color: colors.primary, fontSize: 20, fontWeight: 'bold'}}>{formatAmount(getTotal())} {currency}</Text>
                                </View>
                            </View>
                            <View style={{marginTop: 20}}>
                                <Btn label={t('order.checkout')} loader={loading} disabled={loading} action={handleNext} />
                            </View>
                            <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginTop: 5}}>
                                <Text style={{color: '#ccc', fontWeight: 'bold', textDecorationLine: 'underline', textAlign: 'center'}}>{t('common.cart')}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}