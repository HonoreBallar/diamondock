import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import HeaderSimple from '../components/HeaderSimple';
import Input from "../components/Input";
import Btn from "../components/Btn";
import { useRootContext } from "../context/RootContext";
import { useEffect, useRef, useState } from "react";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { wait } from "../utils/utils";
import PhoneInput from "react-native-phone-number-input";
import { useTranslation } from "../context/LocalizationContext";

export default function LoginScreen({navigation}){
    const {t} = useTranslation();

    const {countries} = useRootContext();

    const phoneInput = useRef(null);
    const [country, setCountry] = useState('');
    const {auth, loginUser} = useRootContext();
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    // Vérifier si l'utilisateur est déjà connecté
    useEffect(() => {
        if(auth.isLoggedIn){
            navigation.navigate('Main');
        }
    }, [auth.isLoggedIn]);

    const handleLoginUser = async () => {
        if(phone === '' || password === ''){
            showMessage({
                message: t('common.fillFileds'),
                type: "danger",
            });
            return;
        }
        setLoading(true);
        await wait(200);

        const code = phoneInput.current?.getCallingCode();
        
        const completePhone =  `+${code}${phone}`;

        const datas ={
            identify: completePhone,
            password: password,
            role: 'customer'
        }
        const response = await loginUser(datas);
        if(response.status === false){
            showMessage({
                message: response?.error,
                type: "danger",
                icon: { icon: "danger"},
                duration: 2000,
            });
        }else{
            showMessage({
                message: t('alerts.connexionSuccess'),
                type: "success",
                icon: { icon: "success"},
                duration: 2000,
            });
            navigation.navigate('Main');
        }
        setLoading(false);
    }



    return(
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{flex: 1}}>
                <ScrollView style={{flex: 1, backgroundColor: 'white'}}
                contentContainerStyle={{ flexGrow: 1 }}
                >
                    <HeaderSimple  title={t('auth.loginTitle')}/>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{marginHorizontal: 15, borderWidth: 1, borderColor: '#ddd', padding: 20, borderRadius: 10, backgroundColor: '#f9f9f9', width: '85%'}}>
                            <Text style={{fontSize: 20, fontWeight: '600', marginBottom: 10}}>{t('auth.welcomeMessage')}</Text>
                            <Text style={{fontSize: 16, fontWeight: '400', marginBottom: 20}}>{t('auth.welcomeSubtitle')}</Text>
                            
                            <View>
                                <View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{fontSize:15, fontWeight: 'bold', marginBottom: 8, marginRight: 3}}>{t('input.phoneTitle')}</Text>
                                        <Text style={{color: 'red'}}>*</Text>
                                    </View>
                                    <View>
                                        <PhoneInput
                                            ref={phoneInput}
                                            value={phone}
                                            defaultCode="CI"
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
                                </View>
                                <Input
                                    label={t('input.passwordTitle')}
                                    icon="lock"
                                    placeholder={t('input.passwordPlaceholder')}
                                    secureTextEntry={true}
                                    value={password}
                                    isRequired={true}
                                    onChangeText={setPassword}
                                    showEyeIcon={true}
                                />
                            </View>
                            <View>
                                <Text style={{textAlign: 'right', marginTop: 5, fontSize: 16, fontWeight: '400'}}>
                                    <Text onPress={() => navigation.navigate('ResetPasswordScreen')} style={{color: 'blue', textDecorationLine: 'underline'}}> {t('common.forgetPassword')}</Text>
                                </Text>
                            </View>
                            <View style={{marginTop: 10}}>
                                <Btn label={t('buttons.login')} loader={loading? true : false} disabled={loading ? true: false} action={handleLoginUser} />
                            </View>
                            <View>
                                <Text style={{textAlign: 'center', marginTop: 20, fontSize: 16, fontWeight: '400'}}>
                                    {t('auth.noAccount')}
                                    <Text onPress={() => navigation.navigate('RegisterScreen')} style={{color: 'blue'}}> {t('auth.registerTitle')}</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}