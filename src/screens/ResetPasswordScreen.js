import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import HeaderSimple from '../components/HeaderSimple';
import Input from "../components/Input";
import Btn from "../components/Btn";
import { useRootContext } from "../context/RootContext";
import { useEffect, useState } from "react";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { wait } from "../utils/utils";
import { useTranslation } from "../context/LocalizationContext";

export default function ResetPasswordScreen({navigation}){
    const {t} = useTranslation();

    const [email, setEmail] = useState('');
    const {auth, resetPassword} = useRootContext();
    const [loading, setLoading] = useState(false);

    // Vérifier si l'utilisateur est déjà connecté
    useEffect(() => {
        if(auth.isLoggedIn){
            navigation.navigate('Main');
        }
    }, [auth.isLoggedIn]);

    const handleResetpassword = async () => {
        if(email === ''){
            showMessage({
                message: t('common.fillFileds'),
                type: "danger",
            });
            return;
        }
        setLoading(true);
        await wait(200);

        const response = await resetPassword(email);

        if(response.status === false){
            showMessage({
                message: response?.error,
                type: "danger",
                icon: { icon: "danger"},
                duration: 2000,
            });
        }else{
            showMessage({
                message: t('alerts.emailsent'),
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
                    <HeaderSimple  title={t('common.forgetPasswordTitle')}/>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{marginHorizontal: 15, borderWidth: 1, borderColor: '#ddd', padding: 20, borderRadius: 10, backgroundColor: '#f9f9f9', width: '85%'}}>
                            <Text style={{fontSize: 20, fontWeight: '600', marginBottom: 10}}>{t('common.forgetPassword')}</Text>
                            <Text style={{fontSize: 16, fontWeight: '400', marginBottom: 15, fontStyle: 'italic'}}>{t('common.forgetPasswordSubtitle')}</Text>
                            
                            <View>
                                <Input
                                    label={t('input.emailTitle')}
                                    icon="envelope"
                                    placeholder={t('input.emailPlaceholder')}
                                    value={email}
                                    isRequired={true}
                                    onChangeText={setEmail}
                                />
                            </View>
                            <View style={{marginTop: 20}}>
                                <Btn label={t('common.send')} loader={loading? true : false} disabled={loading ? true: false} action={handleResetpassword} />
                            </View>
                            <View>
                                <Text style={{textAlign: 'center', marginTop: 20, fontSize: 16, fontWeight: '400'}}>
                                    {t('common.alreadyHaveAccount')}
                                    <Text onPress={() => navigation.goBack()} style={{color: 'blue'}}> {t('auth.loginTitle')}</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}