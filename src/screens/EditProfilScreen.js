import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import Title from '../components/Title';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Input from '../components/Input';
import HeaderSimple from '../components/HeaderSimple';
import Btn from '../components/Btn';
import { useRootContext } from '../context/RootContext';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useEffect, useState } from 'react';

export default function EditProfilScreen({navigation}){

    const {editUser} = useRootContext();
    const {auth} = useRootContext();

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    if(!auth?.isLoggedIn){
        navigation.navigate('LoginScreen');
    }

    useEffect(()=>{
        if(auth?.isLoggedIn){
            const _=auth?.user?.phone;
            
            setPhone(_.replace('+225',''));
            setFirstname(auth.user.firstname);
            setLastname(auth.user.lastname);
            setEmail(auth.user.email);
            setAddress(auth.user.address);
        }
    },[]);

    const handleUpdate = async () =>{
        setLoading(true);
        try {
            const datas = {
                token: auth?.user?.token,
                firstname: firstname,
                lastname: lastname,
                email: email,
                address: address,
                phone: '+225' + phone,
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
                    message: "Modification du profil reussie",
                    type: "success",
                    icon: { icon: "success"},
                    duration: 2000,
                });
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
                    <Image source={require('../assets/user.jpeg')} style={{height: 100, width: 100, borderRadius: 50}}/>
                </View>
                <View>
                    <Input label={"Nom"} icon="user-tie" placeholder="Nom" value={firstname} onChangeText={setFirstname} isRequired={true}/>
                    <Input label={"Prénoms"} icon="user-tie" placeholder="Prénoms" value={lastname} onChangeText={setLastname} isRequired={true}/>
                    <Input label={"Téléphone"} icon="phone" placeholder="Téléphone" keyboardType="numeric" value={phone} onChangeText={setPhone} isRequired={true}/>
                    <Input label={"Adresse"} icon="map" placeholder="Adresse" keyboardType="text" value={address} onChangeText={setAddress}/>
                    <Input label={"Email"} icon="envelope" placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail}/>
                </View>
                <View style={{marginTop: 30}}>
                    <Btn label="Enregistrer" loader={loading} action={handleUpdate}/>
                </View>
            </View>
        </ScrollView>
    );
}