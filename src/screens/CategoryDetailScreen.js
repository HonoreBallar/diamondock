import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from "../utils/colors";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import FlottingCart from "../components/FlottingCart";
import { getRequest } from "../utils/api";
import { useTranslation } from "../context/LocalizationContext";

export default function CategoryDetailScreen({route, navigation}){

    const {t} = useTranslation();

    const {category} = route.params;
    // const {products} = useProducts();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Simulate an API call to fetch products based on the category
                const response = await getRequest(`/category/${category.token}`);
                setProducts(response.data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

    }, [category]);

    return (
        <ScrollView style={{flex: 1,backgroundColor: 'white'}}>
            <View style={{flexDirection:'row', justifyContent: 'space-between', padding: 15, height: 55, backgroundColor: 'white'}}>
                <View style={{flexDirection: "row", alignItems: 'center'}}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <FontAwesome5 name="arrow-left" size={20} color={colors.primary} style={{marginTop: 4, marginLeft: 5}}/>
                    </TouchableOpacity>
                    <Text style={{marginLeft: 10, fontSize: 18, color: colors.primary, width: '80%'}} numberOfLines={1}>{t('common.category')} {category?.name ?? 'category'}</Text>
                </View>
                <FlottingCart navigation={navigation}/>
            </View>
            <ScrollView>
                <View style={{marginBottom: 40}}>
                    <View>
                        <Image source={{uri: category?.image}} style={{height: 300, width:'100%', resizeMode: 'cover'}}/>
                    </View>
                    <View style={{margin: 10}}>
                        <Text style={{fontSize: 22, fontWeight: 'bold',marginBottom: 5, color: colors.primary}}>{t('common.category')} : {category?.name ?? 'Category'}</Text>
                        <Text style={{color: '#555555'}}>{category?.nb_products ?? '0'} {t('common.productAvailable')}</Text>
                    </View>
                    <View style={{margin: 10}}>
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.primary} />
                        ):
                        (products.length > 0 ? (
                            <View>
                                <FlatList
                                    data={products}
                                    keyExtractor={(item, index) => index.toString()}
                                    numColumns={2}
                                    contentContainerStyle={{paddingHorizontal: 15}}
                                    scrollEnabled={false}
                                    renderItem={({ item, index }) => (
                                        <ProductCard key={index.toString()} product={item} navigation={navigation}/>
                                    )}
                                    columnWrapperStyle={{marginBottom: 15}}
                                />
                            </View>
                        ): (
                            <View style={{backgroundColor: 'white', borderRadius: 10}}>
                                <Text style={{textAlign: 'center', padding: 20, color: 'red'}}>{t('common.noProducts')}</Text>
                            </View>

                        ))}
                    </View>
                </View>
            </ScrollView>
        </ScrollView>
    );
}