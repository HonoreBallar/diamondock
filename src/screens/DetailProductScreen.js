import { Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Header from "../components/Header";
import Title from "../components/Title";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Swiper from "react-native-swiper";
import colors from "../utils/colors";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import MyBottomSheet from "../components/MyBottomSheet";

export default function DetailProductScreen({navigation}){

    const bottomSheetRef = useRef(null);

    // Définir les points d'accroche spécifiques à cet écran
    const snapPoints = ['25%', '60%', '90%'];

    const openBottomSheet = () => {
        bottomSheetRef.current?.snapToIndex(1); // Ouvre au deuxième point d'accroche (60%)
    };

    const closeBottomSheet = () => {
        bottomSheetRef.current?.close(); // Ferme le bottom sheet
    }

    const [quantity, setQuantity] = useState('1');
    const photos = [
        'https://britannia-jewellery.co.uk/wp-content/uploads/C11257-B-scaled.jpg',
        'https://assets.hermes.com/is/image/hermesproduct/escape-sneaker--221932ZHI2-worn-1-0-0-1000-1000_g.jpg',
        'https://th.bing.com/th/id/OIP.us5WsxB02ZjayYeO-SFxkwHaLG?w=1203&h=1803&rs=1&pid=ImgDetMain',
        
    ]
    return(
        <View style={{flex: 1}}>
            <StatusBar translucent backgroundColor="transparent" />
            <ScrollView style={{flex: 1, marginBottom: 80}}>
                <View>
                    <Swiper
                        style={{height: 350}}
                        showsButtons={false}
                        autoplay={true}
                        loop={false}
                        activeDotColor={colors.primary}
                        dotStyle={styles.dot}
                        activeDotStyle={styles.activeDot}
                    >

                        {photos.map((image, index) => (
                            <View key={index} style={styles.slide}>
                                <Image
                                    source={{uri: image}}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            </View>
                        ))}
                    </Swiper>
                    <View style={{paddingTop: 50, position: 'absolute',paddingHorizontal: 15}}>
                        <TouchableOpacity onPress={()=>navigation.goBack()}>
                            <FontAwesome5 name="arrow-left" size={20} color="white"/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{margin: 13}}>
                    <Text style={{fontSize: 17, marginBottom: 8}} numberOfLines={2}>Aprilla colliers chaine pour Homme Femme  60 cm</Text>
                    <Text style={{fontWeight: 'bold', fontSize: 25, marginBottom: 8}}>12 000 FCFA</Text>
                    <Text style={{fontSize: 14, marginBottom: 8, lineHeight: 22}}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel odio id dui fermentum laoreet.
                        Integer vitae tortor id lectus tincidunt sodales. Vestibulum
                        tincidunt nisl in ex malesuada, eget ullamcorper orci facilisis. Curabitur ac purus lorem. Nullam in orci nunc. Maecenas dictum, ex sed lobortis tincidunt, turpis risus consequat sapien, a congue mauris ex et libero.
                    </Text>
                    <Text style={{fontWeight: '600', fontSize: 25}}>Détails</Text>
                    <Text style={{fontSize: 14, marginBottom: 8, lineHeight: 22}}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel odio id dui fermentum laoreet.
                        Integer vitae tortor id lectus tincidunt sodales. Vestibulum
                        tincidunt nisl in ex malesuada, eget ullamcorper orci facilisis. Curabitur ac purus lorem. Nullam in orci nunc. Maecenas dictum, ex sed lobortis tincidunt, turpis risus consequat sapien, a congue mauris ex et libero.
                    </Text>
                    <Text style={{fontWeight: '600', fontSize: 25, marginBottom: 5}}>Livraison</Text>
                    <View>
                        <View  style={{flexDirection: 'row', backgroundColor: '#f9f9f9', borderRadius: 8, padding: 5, alignItems: 'center', borderWidth: 0.5, borderColor: colors.primary, marginBottom: 10}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:6, width: '100%'}}>
                                <Text style={{ fontWeight: '500', fontSize: 19}}>Standard</Text>
                                <Text style={{backgroundColor: '#f5f8ff', padding: 5, borderRadius: 5, color: colors.primary}}>5-7 jours</Text>
                                <Text style={{fontWeight: '700', fontSize: 18}}>1 500 F CFA</Text>
                            </View>
                        </View>
                        <View  style={{flexDirection: 'row', backgroundColor: '#f9f9f9', borderRadius: 8, padding: 5, alignItems: 'center', borderWidth: 0.5, borderColor: colors.primary, marginBottom: 10}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:6, width: '100%'}}>
                                <Text style={{ fontWeight: '500', fontSize: 19}}>Express</Text>
                                <Text style={{backgroundColor: '#f5f8ff', padding: 5, borderRadius: 5, color: colors.primary}}>1-2 jours</Text>
                                <Text style={{fontWeight: '700', fontSize: 18}}>8 00 F CFA</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={{fontWeight: '600', fontSize: 25, marginBottom: 5}}>Avis clients</Text>
                    <TouchableOpacity onPress={openBottomSheet} style={{borderTopWidth: 0.3, borderTopColor: '#999', padding: 8, marginBottom: 10}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 20, marginBottom: 3}}>⭐</Text>
                                {/* <FontAwesome5 name="star" size={20} color="#fec727"/> */}
                                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 5}}>
                                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>4.8</Text>
                                    <Text style={{fontSize: 15, color: colors.gray, fontWeight: '400', marginLeft: 5}}>(900 avi(s))</Text>
                                </View>
                            </View>
                            <FontAwesome5 name="chevron-right" size={20} color="#000"/>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <MyBottomSheet
                bottomSheetRef={bottomSheetRef}
                snapPoints={snapPoints}
                initialIndex={1} // Commence fermé (-1) ou 0 pour le premier snapPoint
            >
                {/* Contenu spécifique à afficher dans le BottomSheet */}
                <Text style={styles.bottomSheetTitle}>Contenu Personnalisé</Text>
                <Text>Ceci est le contenu affiché dans le BottomSheet.</Text>
                <Button title="Action 1" onPress={() => console.log('Action 1')} />
                <Button title="Fermer" onPress={closeBottomSheet} /> 
            </MyBottomSheet>
            <View style={{position: 'absolute', bottom: 0, left: 0, borderWidth: 0.2, height: 85 ,width: '100%', backgroundColor: '#f9f9f9', padding: 15, elevation: 8}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TouchableOpacity>
                        <FontAwesome5 name="heart" size={25} color="#000"/>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', width: "50%", borderRadius: 5, padding: 5}}>
                        <TouchableOpacity 
                        onPress={() => setQuantity((prev) => (parseInt(prev) > 1 ? `${parseInt(prev) - 1}` : prev))}
                        style={{borderWidth: 0.5, width: '25%', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center'}}>
                            <FontAwesome5 name="minus" size={18} color="#000"/>
                        </TouchableOpacity>
                        <TextInput value={quantity} onChangeText={(text)=>setQuantity(text)} keyboardType="numeric" style={{borderWidth: 0.5, width:'50%', fontSize: 19, borderColor: '#ddd', fontWeight: '600'}} textAlign="center"/>
                        <TouchableOpacity
                        onPress={() => setQuantity((prev) => `${parseInt(prev) + 1}`)}
                        style={{borderWidth: 0.5, width: '25%', borderTopRightRadius: 5, borderBottomRightRadius: 5, borderColor: '#ddd',justifyContent: 'center', alignItems: 'center'}}>
                            <FontAwesome5 name="plus" size={18} color="#000"/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{flexDirection: 'row', backgroundColor: "#000", padding: 9, borderRadius: 8, alignItems: 'center'}}>
                        <FontAwesome5 name="cart-plus" size={20} color="white"/>
                        <Text style={{color: 'white', marginLeft: 5}}>Ajouter au panier</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    slide: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    }
});