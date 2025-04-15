import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Header from "../components/Header";
import Title from "../components/Title";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from "../utils/colors";
import { RadioButton } from "react-native-paper";
import { useState } from "react";

export default function PaymentScreen(){
    const [checked, setChecked] = useState('at_home');

    const handleHome = ()=>{
        setChecked('at_home');
    }

    const handleRelayPoint = () => {
        setChecked('relay_point');
    }

    return(
        <ScrollView style={{flex:1, backgroundColor: 'white'}}>
            <Header />
            <Title title="Paiement" />
            <View style={{margin: 15}}>
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
                <View style={{marginBottom: 15}}>
                    <View>
                        <View style={{flexDirection: 'row', marginBottom: 15}}>
                            <Text style={{fontWeight: '800', fontSize: 22, marginRight: 10}}>Articles</Text>
                            <View style={{borderWidth: 0.1, backgroundColor: '#e5ebfc', height: 30, width: 30, borderRadius:15, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 22, fontWeight: '700'}}>2</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{marginRight: 15, height: 90, width: 90, borderRadius: 45, backgroundColor: 'white', borderWidth: 0.2, justifyContent: 'center', alignItems: 'center'}}>
                                <Image source={require('../assets/ordinateur.jpg')} style={{height: 80, width: 80, borderRadius: 40}}/>
                            </View>
                            <View style={{borderWidth: 0.1, backgroundColor: '#e5ebfc', height: 25, width: 25, borderRadius:15, justifyContent: 'center', alignItems: 'center',position: 'absolute', top: 10, left: 68 }}>
                                <Text style={{fontSize: 18, fontWeight: '500'}}>1</Text>
                            </View>
                            <View style={{width: '65%',flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text style={{width: '40%'}} numberOfLines={3}>Ordinateur core i9, 256 ssd, 32 rom son processeur est puissant</Text>
                                <Text style={{fontWeight: 'bold', fontSize: 18}}>1 200 000 F CFA</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{marginBottom: 15}}>
                    <Text style={{fontWeight: '800', fontSize: 20, marginBottom: 8}}>Option Livraison</Text>
                    <View style={{marginBottom: 2}}>
                        <TouchableOpacity onPress={handleHome} style={{flexDirection: 'row', backgroundColor: '#e5ebfc', borderRadius: 8, padding: 5, alignItems: 'center', marginBottom: 8}}>
                            <RadioButton
                                value="at_home"
                                status={ checked === 'at_home' ? 'checked' : 'unchecked' }
                                onPress={handleHome}
                            />
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:6, width: '80%'}}>
                                <Text style={{ fontWeight: '500', fontSize: 19}}>Standard</Text>
                                <Text style={{backgroundColor: '#f5f8ff', padding: 5, borderRadius: 5, color: colors.primary}}>5-7 jours</Text>
                                <Text style={{fontWeight: '700', fontSize: 18}}>Gratuit</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleRelayPoint} style={{flexDirection: 'row', backgroundColor: '#f9f9f9', borderRadius: 8, padding: 5, alignItems: 'center'}}>
                            <RadioButton
                                value="relay_point"
                                status={ checked === 'relay_point' ? 'checked' : 'unchecked' }
                                onPress={handleRelayPoint}
                            />
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:6, width: '80%'}}>
                                <Text style={{ fontWeight: '500', fontSize: 19}}>Express</Text>
                                <Text style={{backgroundColor: '#f5f8ff', padding: 5, borderRadius: 5, color: colors.primary}}>1-2 jours</Text>
                                <Text style={{fontWeight: '700', fontSize: 18}}>1 500 F CFA</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{marginBottom: 15}}>
                    <Text style={{fontWeight: '800', fontSize: 20}}>Méthode de paiement</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f9f9f9', padding: 15, marginBottom: 20, borderRadius: 10, alignItems: 'center'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>Total: </Text>
                        <Text style={{fontSize: 18}}>3 000 000 F CFA</Text>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: '#000', padding: 10, borderRadius: 10, width: 90}}>
                        <Text style={{color: 'white', textAlign: 'center'}}>Payer</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </ScrollView>
    )
}