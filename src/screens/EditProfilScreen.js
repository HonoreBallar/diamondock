import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import Title from '../components/Title';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Input from '../components/Input';
import HeaderSimple from '../components/HeaderSimple';
import Btn from '../components/Btn';
import { useRootContext } from '../context/RootContext';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useState } from 'react';

export default function EditProfilScreen({navigation}){

    const {editUser} = useRootContext();

    const {auth} = useRootContext();
    const [firstname, setFistname] = useState(auth?.user?.firstname);
    const [lastname, setLastname] = useState(auth?.user?.lastname);
    const [email, setEmail] = useState(auth?.user?.email);
    const [address, setAddress] = useState(auth?.user?.address);
    const _ =auth?.user?.phone.replace('+225', '');
    const [phone, setPhone] = useState('_');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () =>{
        setLoading(true);
        try {
            const response = await editUser({firstname, lastname, email, address, phone});
            if(response.status){
                navigation.goBack();
            }

        }catch (error) {
            showMessage({
                message: "Erreur " + error.message,
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
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
            <HeaderSimple title="Modifier mon profil" />
            <View style={{margin: 15}}>
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                    <Image source={require('../assets/sneaker.jpg')} style={{height: 100, width: 100, borderRadius: 50}}/>
                </View>
                <View>
                    <Input label={"Nom"} icon="user-tie" placeholder="Nom" value={firstname} setFistname={setFistname} isRequired={true}/>
                    <Input label={"Prénoms"} icon="user-tie" placeholder="Prénoms" value={lastname} setFistname={setLastname} isRequired={true}/>
                    <Input label={"Téléphone"} icon="phone" placeholder="Téléphone" keyboardType="numeric" value={phone} setFistname={setPhone} isRequired={true}/>
                    <Input label={"Adresse"} icon="map" placeholder="Adresse" keyboardType="text" value={address} setFistname={setAddress}/>
                    <Input label={"Email"} icon="envelope" placeholder="Email" keyboardType="email-address" value={email} setFistname={setEmail}/>
                </View>
                <View style={{marginTop: 30}}>
                    <Btn label="Enregistrer" loader={loading} action={handleUpdate}/>
                </View>
            </View>
        </ScrollView>
    );
}