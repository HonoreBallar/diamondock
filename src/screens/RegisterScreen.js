import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import HeaderSimple from "../components/HeaderSimple";
import Input from "../components/Input";
import Btn from "../components/Btn";
import { useRef, useState } from "react";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useRootContext } from "../context/RootContext";
import { Picker } from "@react-native-picker/picker";
import SingleDropdownSelect from "../components/SingleDropdownSelect";
import PhoneInput from "react-native-phone-number-input";
import { getIdFromCode } from "../utils/utils";
import { useTranslation } from "../context/LocalizationContext";

export default function RegisterScreen({navigation}){
    const {t} = useTranslation();

    const {registerUser, countries} = useRootContext();

    const phoneInput = useRef(null);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if(!firstname || !lastname || !password || !phone || !address){
            showMessage({
                message: "Veuillez remplir tous les champs obligatoires.",
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }

        const code = phoneInput.current?.getCallingCode();

        const callingCode = phoneInput.current?.getCallingCode();
        
        const country_code_id = getIdFromCode(`+${callingCode}`, countries);

        setTimeout(async () => {
            const datas = {
                firstname: firstname,
                lastname: lastname,
                email: email,
                phone: phone,
                address: address,
                country_id: country_code_id,
                password: password
            }
            setLoading(true);
            try {
                const response = await registerUser(datas);
                if (response?.status) {
                    showMessage({
                        message: "Compte crée avec succès",
                        type: "success",
                        icon: { icon: "success", position: "left" },
                        duration: 2000,
                    });
                    navigation.navigate('LoginScreen');
                } else {
                    showMessage({
                        message: response?.error,
                        type: "danger",
                        icon: { icon: "danger", position: "left" },
                        duration: 4000,
                    });
                    setLoading(false);
                }
            } catch (error) {
                showMessage({
                    message: "Erreur " + error?.message,
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

    }

    return(
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{flex: 1}}>
                <ScrollView style={{flex: 1, backgroundColor: 'white'}}
                contentContainerStyle={{ paddingBottom: 10 }}
                keyboardShouldPersistTaps="handled"
                >
                    <HeaderSimple title={t('auth.registerTitle')} />
                    <View style={{marginTop: 20, marginHorizontal: 15, marginBottom: 40,borderWidth: 1, borderColor: '#ddd', padding: 20, borderRadius: 10, backgroundColor: '#f9f9f9', width: '90%'}}>
                        <Text style={{fontSize: 20, fontWeight: '600', marginBottom: 10}}>{t('auth.welcomeMessage')}</Text>
                        <Text style={{fontSize: 16, fontWeight: '400', marginBottom: 20}}>{t('auth.registerSubtitle')}</Text>
                        
                        <View>
                            <Input
                                label={t('input.firstnameTitle')}
                                icon="user-tie"
                                placeholder={t('input.firstnamePlaceholder')}
                                value={firstname}
                                onChangeText={setFirstname}
                                isRequired={true}
                            />
                            <Input
                                label={t('input.lastnameTitle')}
                                icon="user-tie"
                                placeholder={t('input.lastnamePlaceholder')}
                                value={lastname}
                                onChangeText={setLastname}
                                isRequired={true}
                            />
                            <View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontSize:15, fontWeight: 'bold', marginBottom: 8, marginRight: 3}}>{t('input.phoneTitle')}</Text>
                                    <Text style={{color: 'red'}}>*</Text>
                                </View>
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
                            <Input
                                label={t('input.addressTitle')}
                                icon="map"
                                placeholder={t('input.addressPlaceholder')}
                                value={address}
                                onChangeText={setAddress}
                                isRequired={true}
                            />
                            <Input
                                label={t('input.passwordTitle')}
                                icon="lock"
                                placeholder={t('input.passwordPlaceholder')}
                                value={password}
                                secureTextEntry={true}
                                showEyeIcon={true}
                                onChangeText={setPassword}
                                isRequired={true}
                            />
                        </View>
                        <View style={{marginTop: 20}}>
                            <Btn label={t('buttons.register')} loader={loading} action={handleSubmit} />
                        </View>
                        <View>
                            <Text style={{textAlign: 'center', marginTop: 20, fontSize: 16, fontWeight: '400'}}>
                                {t('auth.alreadyHaveAccount')}
                                <Text onPress={() => navigation.navigate('LoginScreen')} style={{color: 'blue'}}> {t('auth.loginTitle')}</Text>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}