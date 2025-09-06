import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import Header from "../components/Header";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from "../utils/colors";
import { useCategories } from "../context/CategoryContext";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import CategoryItem from "../components/CategoryItem";
import { useTranslation } from "../context/LocalizationContext";

export default function HomeScreen({navigation}){
    const { t } = useTranslation();
    const {categories} = useCategories();
    const {products} = useProducts();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (products && categories) {
            setLoading(false);
        }
    }, 
    [products, categories]);

    return(
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <Header/>
            <ScrollView>
                <View style={{margin: 15}}>
                    <View style={{margin: 10}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{marginBottom: 8, color: colors.primary, fontWeight: 'bold', fontSize: 17}}>{t('home.categoriesTitle')}</Text>
                            <TouchableOpacity onPress={()=>navigation.jumpTo(t('tabs.tab_categories'))}>
                                <Text style={{color: '#03045e', textAlign: 'right', fontSize: 12}}>{t('common.seeMore')}</Text>
                            </TouchableOpacity>
                        </View>
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.primary} style={{marginTop: 20}} />
                        ) : (
                            <FlatList
                                data={categories}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <CategoryItem key={item?.token} category={item} navigation={navigation} />
                                )}
                                initialNumToRender={2}
                                maxToRenderPerBatch={2}
                                ListEmptyComponent={() => (
                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                                        <Text style={{textAlign: 'center'}}>{t('common.noCategories')}</Text>
                                    </View>
                                )}
                            />
                        )}
                    </View>
                    <View style={{margin: 10}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                            <Text style={{marginBottom: 8, color: colors.primary, fontWeight: 'bold',fontSize: 17}}>{t('home.new')}</Text>
                        </View>
                        <FlatList
                            data={products}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <ProductCard key={item.token} product={item} navigation={navigation}/>
                            )}
                            initialNumToRender={1}
                            maxToRenderPerBatch={2}
                            ListEmptyComponent={() => (
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                                    <Text style={{textAlign: 'center'}}>{t('common.noProducts')}</Text>
                                </View>
                            )}
                        />
                    </View>

                    <View style={{margin: 10}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                            <Text style={{marginBottom: 8, color: colors.primary, fontWeight: 'bold',fontSize: 17}}>{t('home.limitedTimeOffer')}</Text>
                        </View>
                        <FlatList
                            data={products}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <ProductCard key={item.token} product={item} navigation={navigation}/>
                            )}
                            initialNumToRender={1}
                            maxToRenderPerBatch={2}
                            ListEmptyComponent={() => (
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                                    <Text style={{textAlign: 'center'}}>{t('common.noProducts')}</Text>
                                </View>
                            )}
                        />
                    </View>

                    <View style={{margin: 10}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                            <Text style={{marginBottom: 8, color: colors.primary, fontWeight: 'bold',fontSize: 17}}>{t('home.bestArticles')}</Text>
                        </View>
                        <FlatList
                            data={products}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <ProductCard key={item.token} product={item} navigation={navigation}/>
                            )}
                            initialNumToRender={1}
                            maxToRenderPerBatch={2}
                            ListEmptyComponent={() => (
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                                    <Text style={{textAlign: 'center'}}>{t('common.noProducts')}</Text>
                                </View>
                            )}
                        />
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}