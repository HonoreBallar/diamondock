import { ScrollView, Text, View } from "react-native";
import HeaderSimple from '../components/HeaderSimple';
import Input from "../components/Input";
import Btn from "../components/Btn";
import { useRootContext } from "../context/RootContext";
import { useEffect, useState } from "react";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { wait } from "../utils/utils";
import SingleDropdownSelect from "../components/SingleDropdownSelect";

export default function LoginScreen({navigation}){

    const {countries} = useRootContext();

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
        if(phone === '' || password === '' || country === ''){
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
                message: "Connexion réussie avec succès!",
                type: "success",
                icon: { icon: "success"},
                duration: 2000,
            });
            navigation.navigate('Main');
        }
        setLoading(false);
    }



    return(
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}
        contentContainerStyle={{ flexGrow: 1 }}
        >
            <HeaderSimple  title='Connexion'/>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{marginTop: 20, marginHorizontal: 15, borderWidth: 1, borderColor: '#ddd', padding: 20, borderRadius: 10, backgroundColor: '#f9f9f9'}}>
                    <Text style={{fontSize: 20, fontWeight: '600', marginBottom: 10}}>Bienvenue sur notre application</Text>
                    <Text style={{fontSize: 16, fontWeight: '400', marginBottom: 20}}>Veuillez vous connecter pour continuer</Text>
                    
                    <View>
                        <View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize:15, fontWeight: 'bold', marginBottom: 8, marginRight: 3}}>Pays</Text>
                                <Text style={{color: 'red'}}>*</Text>
                            </View>
                            <SingleDropdownSelect items={countries} onSelectHandler={(_)=>setCountry(_?.code)}/>
                        </View>
                        <Input
                            label="Téléphone"
                            icon="phone"
                            placeholder="Entrez votre téléphone"
                            keyboardType="numeric"
                            value={phone}
                            isRequired={true}
                            onChangeText={setPhone}
                        />
                        <Input
                            label="Mot de passe"
                            icon="lock"
                            placeholder="Entrez votre mot de passe"
                            secureTextEntry={true}
                            value={password}
                            isRequired={true}
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
            </View>
        </ScrollView>
    );
}