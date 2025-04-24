import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Header from "../components/Header";
import Title from "../components/Title";
import colors from "../utils/colors";

export default function DigitalMallScreen({navigation}){
    return(
        <ScrollView style={{flex: 1, paddingTop: 40}}>
            <View style={{padding: 15, backgroundColor: '#f9f9f9', borderBottomRightRadius: 25, borderBottomLeftRadius: 25, elevation: 1}}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <FontAwesome5 name="chevron-circle-left" size={28} color="#000" style={{marginTop: 15}}/>
                </TouchableOpacity>
                <Text style={{fontSize: 25, fontWeight: 'bold', color: colors.primary, marginTop: 15, textAlign: 'center'}}>Digitall Mall</Text>
            </View>
            <View style={{margin: 10, marginTop: 5, marginBottom: 20}}>
                <Title title="Nos Vendeurs" />
                <FlatList
                    data={[{id: 1, title: 'Ordinateur'}, {id: 2, title: 'Téléphone'}, {id: 3, title: 'Tablette'}, {id: 4, title: 'Montre'}, {id: 4, title: 'Montre'}]}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (
                        <TouchableOpacity style={{margin: 10, backgroundColor: '#f9f9f9', borderRadius: 10, padding: 10, width: '45%'}} onPress={() => navigation.navigate('DetailSellerScreen', {productId: item.id})}>
                            <Image source={require('../assets/ordinateur.jpg')} style={{width: '100%', height: 150, borderRadius: 10}}/>
                            <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>{item.title}</Text>
                            <Text style={{fontSize: 18, fontWeight: '200', textAlign: 'center'}}>produit(s) 5</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </ScrollView>
    );
}