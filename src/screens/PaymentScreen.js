import { Image, ScrollView, Text, View } from "react-native";
import Header from "../components/Header";
import Title from "../components/Title";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from "../utils/colors";

export default function PaymentScreen(){
    return(
        <ScrollView style={{flex:1, backgroundColor: 'white'}}>
            <Header />
            <Title title="Paiement" />
            <View style={{margin: 10}}>
                <View style={{backgroundColor: '#f9f9f9',borderWidth:0.1, height: 80, padding: 10, borderRadius: 8, marginBottom: 15}}>
                    <Text style={{fontWeight: '700', fontSize: 17}}>Adresse de livraison</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text>26,Duong So2, Thao</Text>
                        <FontAwesome5 name="edit" size={18} color={colors.primary} style={{marginLeft: 8}}/>
                    </View>
                </View>
                <View style={{backgroundColor: '#f9f9f9',borderWidth:0.1, height: 80, padding: 10, borderRadius: 8, marginBottom: 15}}>
                    <Text style={{fontWeight: '700', fontSize: 17}}>Information client</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text>+225 01 42 21 63 84</Text>
                        <FontAwesome5 name="user-edit" size={18} color={colors.primary} style={{marginLeft: 8}}/>
                    </View>
                </View>
                <View>
                    <View>
                        <Text style={{fontWeight: '800', fontSize: 20}}>Articles</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{marginRight: 10, height: 90, width: 90, borderRadius: 45, backgroundColor: 'white', borderWidth: 0.2, justifyContent: 'center', alignItems: 'center'}}>
                                <Image source={require('../assets/ordinateur.jpg')} style={{height: 80, width: 80, borderRadius: 40}}/>
                            </View>
                            <View style={{width: '70%',flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text>Title</Text>
                                <Text style={{fontWeight: 'bold', fontSize: 16}}>12.000 F CFA</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View>
                    <Text style={{fontWeight: '800', fontSize: 20}}>Option Livraison</Text>
                </View>
                <View>
                    <Text style={{fontWeight: '800', fontSize: 20}}>Méthode de paiement</Text>
                </View>
            </View>

        </ScrollView>
    )
}