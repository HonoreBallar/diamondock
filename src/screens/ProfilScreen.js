import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import Header from "../components/Header";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Title from "../components/Title";
import colors from "../utils/colors";

export default function ProfilScreen({navigation}){
    return(
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
            <Header />
            <Title title="Mon compte" />
            <View style={{margin: 15}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={require('../assets/sneaker.jpg')} style={{height: 100, width: 100, borderRadius: 50}}/>
                    <Text style={{fontSize: 22, fontWeight: '500', marginLeft: 10}}>Amounan Honoré</Text>
                </View>
                <View style={{marginTop: 15, backgroundColor: '#f7f8fa', borderRadius: 15, marginBottom: 10, borderWidth: 0.1}}>
                    <TouchableOpacity onPress={()=>alert('')}  style={{padding: 15, marginBottom: 5}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row'}}>
                                <FontAwesome5 name={"user-tie"} size={19} color="orange" style={{marginTop: 2}}/>
                                <Text style={{fontSize: 20, marginLeft: 5,}}>Information personnelle</Text>
                            </View>
                            <FontAwesome5 name="angle-right" size={22} color="#000"/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>alert('')}  style={{padding: 15, marginBottom: 10}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row'}}>
                                <FontAwesome5 name={"map-marker-alt"} size={20} color="blue" style={{marginTop: 2}}/>
                                <Text style={{fontSize: 20, marginLeft: 5,}}>Mes adresses</Text>
                            </View>
                            <FontAwesome5 name="angle-right" size={22} color="#000" />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{marginTop: 15, backgroundColor: '#f7f8fa', borderRadius: 15, borderWidth: 0.1}}>
                    <TouchableOpacity onPress={()=>navigation.navigate('OrderScreen')}  style={{padding: 15, marginBottom: 5}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row'}}>
                                <FontAwesome5 name={"shopping-cart"} size={20} color="#8cbdef" style={{marginTop: 2}}/>
                                <Text style={{fontSize: 20, marginLeft: 5,}}>Mes commandes</Text>
                            </View>
                            <FontAwesome5 name="angle-right" size={22} color="#000"/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>alert('')}  style={{padding: 15, marginBottom: 5}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row'}}>
                                <FontAwesome5 name={"wallet"} size={20} color="#bf73ef" style={{marginTop: 2}}/>
                                <Text style={{fontSize: 20, marginLeft: 5,}}>Methode de paiement</Text>
                            </View>
                            <FontAwesome5 name="angle-right" size={22} color="#000"/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>alert('')}  style={{padding: 15, marginBottom: 10}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row'}}>
                                <FontAwesome5 name={"comment-dots"} size={20} color="#43e6e5" style={{marginTop: 2}}/>
                                <Text style={{fontSize: 20, marginLeft: 5,}}>Mes avis</Text>
                            </View>
                            <FontAwesome5 name="angle-right" size={22} color="#000"/>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={()=>alert('Déconnexion')} style={{backgroundColor: colors.primary, padding: 12,borderRadius:10, marginBottom: 10, marginTop: 20 }}>
                    <Text style={{color: 'white', fontWeight: 'bold',  textAlign: 'center'}}>Se déconnecter</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}