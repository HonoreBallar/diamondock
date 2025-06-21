import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import Header from "../components/Header";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Title from "../components/Title";
import colors from "../utils/colors";
import { useRootContext } from "../context/RootContext";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useState } from "react";
import ProfilLine from "../components/ProfilLine";

export default function ProfilScreen({navigation}){
    const {auth} = useRootContext();
    const {logout} = useRootContext();
    const [loading, setLoading] = useState(false);

    if(auth?.isLoggedIn === false){
        navigation.navigate('Main');
    }

    const handleLogout = () => {
        setLoading(true);
        Alert.alert(
            'Se déconnecter',
            'Voulez-vous vraiment vous déconnecter ?',
            [
                {text: 'Annuler', style: 'cancel', onPress: ()=> setLoading(false)},
                {text: 'valider', onPress: async () => {
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
        <View style={{flex: 1}}>
            <Header />
            <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
                <Title title="Mon compte" />
                <View style={{margin: 15}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image source={require('../assets/sneaker.jpg')} style={{height: 100, width: 100, borderRadius: 50}}/>
                        <Text style={{fontSize: 22, fontWeight: '500', marginLeft: 10, width: '100%'}}>Amounan Honoré</Text>
                    </View>
                    <View style={{marginTop: 15, backgroundColor: '#f7f8fa', borderRadius: 15, marginBottom: 10, borderWidth: 0.1}}>
                        <ProfilLine icon="user-tie" iconColor={"orange"} title="Information personnelle" onPress={()=>navigation.navigate('EditProfilScreen')}/>
                        {/* <ProfilLine icon="map-marker-alt" iconColor={"blue"} title="Mes adresses" onPress={()=>navigation.navigate('AddressScreen')}/> */}
                        <ProfilLine icon="map-marker-alt" iconColor={"blue"} title="Mes adresses" onPress={handleBuild}/>
                    </View>
                    <View style={{marginTop: 15, backgroundColor: '#f7f8fa', borderRadius: 15, borderWidth: 0.1}}>
                        <ProfilLine icon="shopping-cart" iconColor={"#8cbdef"} title="Mes commandes" onPress={()=>navigation.navigate('OrderScreen')}/>
                        {/* <ProfilLine icon="wallet" iconColor={"#bf73ef"} title="Methode de paiement" onPress={()=>navigation.navigate('MethodPaymentScreen')}/> */}
                        <ProfilLine icon="wallet" iconColor={"#bf73ef"} title="Methode de paiement" onPress={handleBuild}/>
                        <ProfilLine icon="comment-dots" iconColor={"#43e6e5"} title="Mes avis" onPress={handleBuild}/>
                    </View>
                    <View style={{marginTop: 15, backgroundColor: '#f7f8fa', borderRadius: 10, borderWidth: 0.1}}>
                        <ProfilLine icon="scroll" iconColor={"#8cbdef"} title="Termes et conditions" onPress={handleBuild}/>
                        <ProfilLine icon="warehouse" iconColor={"#bf73ef"} title="A propos de nous" onPress={handleBuild}/>
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={{backgroundColor: colors.primary, padding: 10,borderRadius:10, marginBottom: 10, marginTop: 20 }}>
                        <View style={{flexDirection: 'row',justifyContent: "center", alignItems: 'center'}}>
                            {loading ? 
                            (<ActivityIndicator size={20} color="white" style={{marginTop: 2, marginRight: 5}}/>):
                            (<FontAwesome5 name="sign-out-alt" size={20} color="white" style={{marginTop: 2, marginRight: 5}}/>)
                            }
                            <Text style={{color: 'white', fontWeight: 'bold',  textAlign: 'center'}}>Se déconnecter</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}