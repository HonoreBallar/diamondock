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

export default function RegisterScreen({navigation}){

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
                    <HeaderSimple title="Inscription" />
                    <View style={{marginTop: 20, marginHorizontal: 15, marginBottom: 40,borderWidth: 1, borderColor: '#ddd', padding: 20, borderRadius: 10, backgroundColor: '#f9f9f9'}}>
                        <Text style={{fontSize: 20, fontWeight: '600', marginBottom: 10}}>Bienvenue sur notre application</Text>
                        <Text style={{fontSize: 16, fontWeight: '400', marginBottom: 20}}>Veuillez vous inscrire pour continuer</Text>
                        
                        <View>
                            <Input
                                label="Nom"
                                icon="user-tie"
                                placeholder="Entrez votre nom"
                                value={firstname}
                                onChangeText={setFirstname}
                                isRequired={true}
                            />
                            <Input
                                label="Prénoms"
                                icon="user-tie"
                                placeholder="Entrez votre nom"
                                value={lastname}
                                onChangeText={setLastname}
                                isRequired={true}
                            />
                            <View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontSize:15, fontWeight: 'bold', marginBottom: 8, marginRight: 3}}>Téléphone</Text>
                                    <Text style={{color: 'red'}}>*</Text>
                                </View>
                                <PhoneInput
                                    ref={phoneInput}
                                    value={phone}
                                    defaultCode="CI"
                                    layout="second"
                                    onChangeText={setPhone}
                                    placeholder="Entrez votre numéro"
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
                                {/* <SingleDropdownSelect items={countries} onSelectHandler={(_)=>setCountry(_?.code)}/> */}
                            </View>
                            {/* <Input
                                label="Téléphone"
                                icon="phone"
                                placeholder="Entrez votre téléphone"
                                keyboardType="numeric"
                                value={phone}
                                maxLength={10}
                                onChangeText={setPhone}
                                isRequired={true}
                            /> */}
                            <Input
                                label="Adresse"
                                icon="map"
                                placeholder="Entrez votre adresse"
                                value={address}
                                onChangeText={setAddress}
                                isRequired={true}
                            />
                            {/* <Input
                                label="Email"
                                icon="envelope"
                                placeholder="Entrez votre email"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                            /> */}
                            <Input
                                label="Mot de passe"
                                icon="lock"
                                placeholder="Entrez votre mot de passe"
                                value={password}
                                // secureTextEntry={true}
                                onChangeText={setPassword}
                                isRequired={true}
                            />
                        </View>
                        <View style={{marginTop: 20}}>
                            <Btn label={"S'inscrire"} loader={loading} action={handleSubmit} />
                        </View>
                        <View>
                            <Text style={{textAlign: 'center', marginTop: 20, fontSize: 16, fontWeight: '400'}}>
                                Vous avez déjà un compte ? 
                                <Text onPress={() => navigation.navigate('LoginScreen')} style={{color: 'blue'}}> Connectez-vous</Text>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}