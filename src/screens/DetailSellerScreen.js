import { ActivityIndicator, FlatList, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from "../utils/colors";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import FlottingCart from "../components/FlottingCart";
import { getRequest } from "../utils/api";

export default function DetailSellerScreen({route, navigation}){

    const {seller} = route.params;
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSellers = async () => {
        setLoading(true);
        try {
            // Simulate an API call to fetch products based on the category
            const response = await getRequest(`/seller/${seller.token}`);
            setSellers(response?.data?.products ?? []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async() => {
        setRefreshing(true);
        await fetchSellers();
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    }

    useEffect(() => {
        fetchSellers();
    }, [seller]);

    return (
        <ScrollView 
            style={{flex: 1,backgroundColor: 'white'}}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[colors.black]}
                    progressBackgroundColor={'white'}
                    progressViewOffset={100}
                />
            }

        >
            <View style={{flexDirection:'row', justifyContent: 'space-between', padding: 15, height: 55, backgroundColor: 'white', marginTop: 40}}>
                <View style={{flexDirection: "row", alignItems: 'center'}}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <FontAwesome5 name="arrow-left" size={20} color={colors.primary} style={{marginTop: 4, marginLeft: 5}}/>
                    </TouchableOpacity>
                    {/* <Text style={{marginLeft: 10, fontSize: 18, color: colors.primary, width: '80%'}} numberOfLines={1}>Categorie {category.name ?? 'N/A'}</Text> */}
                    <Text style={{marginLeft: 10, fontSize: 18, color: colors.primary, width: '80%'}} numberOfLines={1}>Vendeur {seller?.name ?? 'N/A'}</Text>
                </View>
                <FlottingCart navigation={navigation}/>
            </View>
            <ScrollView>
                <View style={{marginBottom: 40}}>
                    <View>
                        <Image source={{uri: seller?.avatar}} style={{height: 300, width:'100%', resizeMode: 'cover'}}/>
                    </View>
                    <View style={{margin: 10}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                            <Text style={{fontSize: 25}}>💼 </Text>
                            <Text style={{fontSize: 22, fontWeight: 'bold',marginTop: 5, color: colors.primary}}>{seller?.name ?? 'Vendeur'}</Text>
                        </View>
                        
                        <Text style={{color: '#555555'}}>{seller?.nb_products ?? '0'} produit(s) disponible</Text>
                    </View>
                    <View style={{margin: 10}}>
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.primary} />
                        ):
                        (
                            <View>
                                <FlatList
                                    data={sellers}
                                    keyExtractor={(item, index) => index.toString()}
                                    numColumns={2}
                                    contentContainerStyle={{paddingHorizontal: 15}}
                                    scrollEnabled={false}
                                    renderItem={({ item, index }) => (
                                        <ProductCard key={index.toString()} product={item} navigation={navigation}/>
                                    )}
                                    columnWrapperStyle={{marginBottom: 15}}
                                    ListEmptyComponent={()=>{
                                        return(
                                            <View style={{backgroundColor: 'white', borderRadius: 10}}>
                                                <Text style={{textAlign: 'center', padding: 20, color: 'red'}}>Aucun produit disponible pour cette catégorie.</Text>
                                            </View>
                                        )
                                    }}

                                />
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </ScrollView>
    );
}