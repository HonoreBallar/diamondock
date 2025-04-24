import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Header from "../components/Header";
import Title from "../components/Title";
import colors from "../utils/colors";
import { useProducts } from "../context/ProductContext";

export default function DigitalMallScreen({navigation}){
    const {sellers} = useProducts();
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
                    data={sellers}
                    keyExtractor={(item) => item.toString()}
                    numColumns={2}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (
                        <TouchableOpacity style={{margin: 10, backgroundColor: '#f9f9f9', borderRadius: 10, padding: 10, width: '45%'}} onPress={() => navigation.navigate('DetailSellerScreen', {seller: item})}>
                            <Image source={{uri: item?.avatar}} style={{width: '100%', height: 150, borderRadius: 10}}/>
                            <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>{item?.name}</Text>
                            <Text style={{fontSize: 18, fontWeight: '200', textAlign: 'center'}}>produit(s) {item?.nb_products ?? '0'}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </ScrollView>
    );
}