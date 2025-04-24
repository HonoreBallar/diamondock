import { Text, TouchableOpacity, View } from "react-native";
import HeaderSimple from "../components/HeaderSimple";
import Title from "../components/Title";

export default function AddressScreen({navigation}){
    return(
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <HeaderSimple title="Mes adresses" />
            <View style={{margin: 15}}>
                <View style={{marginTop: 20}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold', marginBottom: 8}}>Adresse de livraison</Text>
                    <Text style={{fontSize: 15, color: '#666'}}>Aucune adresse de livraison enregistrée</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('EditProfilScreen')} style={{backgroundColor: '#f0f0f0', padding: 10, borderRadius: 10, marginTop: 20}}>
                    <Text style={{textAlign: 'center', fontSize: 15, fontWeight: 'bold'}}>Ajouter une adresse de livraison</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}