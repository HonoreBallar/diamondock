import { ScrollView, Text, View } from "react-native";
import HeaderSimple from '../components/HeaderSimple';
import Input from "../components/Input";
import Btn from "../components/Btn";
import { useRootContext } from "../context/RootContext";
import { useEffect, useState } from "react";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { wait } from "../utils/utils";

export default function LoginScreen({navigation}){

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
                message: "Veuillez remplir tous les champs",
                type: "danger",
            });
            return;
        }
        setLoading(true);
        await wait(1000);
        const datas ={
            identify: '+225' +phone,
            password: password,
            role: 'customer'
        }
        await loginUser(datas);
        navigation.navigate('Main');
        setLoading(false);
    }



    return(
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
            <HeaderSimple  title='Connexion'/>
            
            <View style={{marginTop: 20, marginHorizontal: 15}}>
                <Text style={{fontSize: 20, fontWeight: '600', marginBottom: 10}}>Bienvenue sur notre application</Text>
                <Text style={{fontSize: 16, fontWeight: '400', marginBottom: 20}}>Veuillez vous connecter pour continuer</Text>
                
                <View>
                    <Input
                        label="Téléphone"
                        icon="phone"
                        placeholder="Entrez votre téléphone"
                        keyboardType="numeric"
                        value={phone}
                        onChangeText={setPhone}
                    />
                    <Input
                        label="Mot de passe"
                        icon="lock"
                        placeholder="Entrez votre mot de passe"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                <View style={{marginTop: 20}}>
                    <Btn label={"Connexion"} loader={loading === true ? true : false} action={handleLoginUser} />
                </View>
                <View>
                    <Text style={{textAlign: 'center', marginTop: 20, fontSize: 16, fontWeight: '400'}}>
                        Vous n'avez pas de compte ? 
                        <Text onPress={() => navigation.navigate('RegisterScreen')} style={{color: 'blue'}}> Inscrivez-vous</Text>
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}