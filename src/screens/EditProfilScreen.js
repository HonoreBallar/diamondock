import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import Title from '../components/Title';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Input from '../components/Input';
import HeaderSimple from '../components/HeaderSimple';
import Btn from '../components/Btn';

export default function EditProfilScreen({navigation}){
    return(
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
            <HeaderSimple title="Modifier mon profil" />
            <View style={{margin: 15}}>
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
                    <Image source={require('../assets/sneaker.jpg')} style={{height: 100, width: 100, borderRadius: 50}}/>
                </View>
                <View>
                    <Input label={"Nom"} icon="user-tie" placeholder="Nom" />
                    <Input label={"Email"} icon="envelope" placeholder="Email" keyboardType="email-address"/>
                    <Input label={"Téléphone"} icon="phone" placeholder="Téléphone" keyboardType="phone-pad"/>
                </View>
                <View style={{marginTop: 30}}>
                    <Btn label="Enregistrer" loader={false} />
                </View>
            </View>
        </ScrollView>
    );
}