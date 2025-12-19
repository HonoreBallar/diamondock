import { Image, Keyboard, KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Header from '../components/Header';
import Title from '../components/Title';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Input from '../components/Input';
import HeaderSimple from '../components/HeaderSimple';
import Btn from '../components/Btn';
import { useRootContext } from '../context/RootContext';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useEffect, useRef, useState } from 'react';
import PhoneInput from 'react-native-phone-number-input';
import { useTranslation } from '../context/LocalizationContext';

export default function EditProfilScreen({navigation}){
    const {t} = useTranslation();

    const {editUser} = useRootContext();
    const {auth} = useRootContext();

    const phoneInput = useRef(null);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState(auth?.user?.phone_detail?.number || '');
    const [countryCode, setCountryCode] = useState(auth?.user?.phone_detail?.slug || 'CI');

    if(!auth?.isLoggedIn){
        navigation.navigate('LoginScreen');
    }

    useEffect(()=>{
        if(auth?.isLoggedIn){
            const _=auth?.user?.phone;
            
            setFirstname(auth.user.firstname);
            setLastname(auth.user.lastname);
            setEmail(auth.user.email);
            setAddress(auth.user.address);
        }
    },[]);

    const handleUpdate = async () =>{
        setLoading(true);
        try {
            const code = phoneInput.current?.getCallingCode();
        
            const completePhone =  `+${code}${phone}`;

            const datas = {
                token: auth?.user?.token,
                firstname: firstname,
                lastname: lastname,
                email: email,
                address: address,
                phone: completePhone,
            }
            const response = await editUser(datas);
            if(response.status === false){
                showMessage({
                    message: response?.error,
                    type: "danger",
                    icon: { icon: "danger"},
                    duration: 2000,
                });
                navigation.goBack();
            }

            if(response?.status){
                showMessage({
                    message: t('alerts.editProfile'),
                    type: "success",
                    icon: { icon: "success"},
                    duration: 2000,
                });
                navigation.goBack();
            }
        }catch (error) {
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
    }



    return(
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: 'white' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{flex: 1}}>
                    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
                        <HeaderSimple title={t('profil.editProfile')} />
                        <View style={{margin: 15}}>
                            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                                <Image source={require('../assets/user.jpeg')} style={{height: 100, width: 100, borderRadius: 50}}/>
                            </View>
                            <View>
                                <Input label={t('input.firstnameTitle')} icon="user-tie" placeholder={t('input.firstnamePlaceholder')} value={firstname} onChangeText={setFirstname} isRequired={true}/>
                                <Input label={t('input.lastnameTitle')} icon="user-tie" placeholder={t('input.lastnamePlaceholder')} value={lastname} onChangeText={setLastname} isRequired={true}/>
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
                                <Input label={t('input.addressTitle')} icon="map" placeholder={t('input.addressPlaceholder')} keyboardType="text" value={address} onChangeText={setAddress}/>
                                <Input label={t('input.emailTitle')} icon="envelope" placeholder={t('input.emailPlaceholder')} keyboardType="email-address" value={email} onChangeText={setEmail}/>
                            </View>
                            <View style={{marginTop: 30}}>
                                <Btn label={t('buttons.save')} loader={loading} disabled={loading} action={handleUpdate}/>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}