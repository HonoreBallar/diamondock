import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import Header from "../components/Header";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Title from "../components/Title";
import colors from "../utils/colors";
import { useRootContext } from "../context/RootContext";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useState } from "react";
import ProfilLine from "../components/ProfilLine";
import { useTranslation } from "../context/LocalizationContext";

export default function ProfilScreen({navigation}){
    const {t} = useTranslation();
    const {auth} = useRootContext();
    const {logout} = useRootContext();
    const [loading, setLoading] = useState(false);

    if(auth?.isLoggedIn === false){
        navigation.navigate('Main');
    }

    const handleLogout = () => {
        setLoading(true);
        Alert.alert(
            t('alerts.logoutTitle'),
            t('alerts.logoutMessage'),
            [
                {text: t('common.cancel'), style: 'cancel', onPress: ()=> setLoading(false)},
                {text: t('common.logout'), onPress: async () => {
                    await logout();
                    setLoading(false);
                }}
            ],
            {cancelable: false}
        );
    };
    const handleBuild = ()=>{
        showMessage({
            message: "En cours de construction",
            type: "info",
            icon: { icon: "info", position: "left" },
            duration: 2000,
        });
        return;
    }

    return(
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <Header />
            <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
                <Title title={t('common.myAccount')} />
                <View style={{margin: 15}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image source={require('../assets/user.jpeg')} style={{height: 100, width: 100, borderRadius: 50}}/>
                        <Text style={{fontSize: 22, fontWeight: '500', marginLeft: 10, width: '100%'}}>{auth?.user?.firstname} {auth?.user?.lastname}</Text>
                    </View>
                    <View style={{marginTop: 15, backgroundColor: '#f7f8fa', borderRadius: 15, marginBottom: 10, borderWidth: 0.1}}>
                        <ProfilLine icon="user-tie" iconColor={"orange"} title={t('profil.account')} onPress={()=>navigation.navigate('EditProfilScreen')}/>
                        <ProfilLine icon="map-marker-alt" iconColor={"blue"} title={t('profil.address')} onPress={handleBuild}/>
                    </View>
                    <View style={{marginTop: 15, backgroundColor: '#f7f8fa', borderRadius: 15, borderWidth: 0.1}}>
                        <ProfilLine icon="shopping-cart" iconColor={"#8cbdef"} title={t('profil.orders')} onPress={()=>navigation.navigate('OrderScreen')}/>
                        <ProfilLine icon="globe" iconColor={"#bf73ef"} title={t('profil.language')} onPress={()=>navigation.navigate('LanguageScreen')}/>
                        <ProfilLine icon="comment-dots" iconColor={"#43e6e5"} title={t('profil.reviews')} onPress={handleBuild}/>
                    </View>
                    <View style={{marginTop: 15, backgroundColor: '#f7f8fa', borderRadius: 10, borderWidth: 0.1}}>
                        <ProfilLine icon="scroll" iconColor={"#8cbdef"} title={t('profil.terms')} onPress={handleBuild}/>
                        <ProfilLine icon="warehouse" iconColor={"#bf73ef"} title={t('profil.about')} onPress={handleBuild}/>
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={{backgroundColor: colors.primary, padding: 10,borderRadius:10, marginBottom: 10, marginTop: 20 }}>
                        <View style={{flexDirection: 'row',justifyContent: "center", alignItems: 'center'}}>
                            {loading ? 
                            (<ActivityIndicator size={20} color="white" style={{marginTop: 2, marginRight: 5}}/>):
                            (<FontAwesome5 name="sign-out-alt" size={20} color="white" style={{marginTop: 2, marginRight: 5}}/>)
                            }
                            <Text style={{color: 'white', fontWeight: 'bold',  textAlign: 'center'}}>{t('common.logout')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}