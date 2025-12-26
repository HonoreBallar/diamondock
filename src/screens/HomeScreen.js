import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native"
import Header from "../components/Header";
import colors from "../utils/colors";
import { useCategories } from "../context/CategoryContext";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import { useEffect, useState, useMemo } from "react";
import CategoryItem from "../components/CategoryItem";
import { useTranslation } from "../context/LocalizationContext";
import SkeletonCategoryItem from "../components/SkeletonCategoryItem";
import SkeletonProductCard from "../components/SkeletonProductCard";

export default function HomeScreen({navigation}){
    const { t } = useTranslation();
    const {getRandomCategories, categories} = useCategories();
    const {getRandomProducts, products} = useProducts();
    const [loading, setLoading] = useState(true);

    // Mémoriser les catégories aléatoires pour éviter les changements constants
    const randomCategories = useMemo(() => {
        return getRandomCategories();
    }, [categories]);

    // Mémoriser les produits aléatoires pour chaque section
    const newProducts = useMemo(() => {
        return getRandomProducts(10);
    }, [products]);

    const limitedTimeProducts = useMemo(() => {
        return getRandomProducts(10);
    }, [products]);

    const bestArticlesProducts = useMemo(() => {
        return getRandomProducts(10);
    }, [products]);

    useEffect(() => {
        setTimeout(() => {
            if (products && randomCategories.length > 0) {
                setLoading(false);
            }
        }, 100);
    }, [products, randomCategories]);

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
                            <FlatList
                                data={[1, 2, 3, 4]}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={() => <SkeletonCategoryItem />}
                                scrollEnabled={false}
                            />
                        ) : (
                            <FlatList
                                data={randomCategories}
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
                        {loading ? (
                            <FlatList
                                data={[1, 2]}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={() => <SkeletonProductCard />}
                                scrollEnabled={false}
                            />
                        ) : (
                            <FlatList
                                data={newProducts}
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
                        )}
                    </View>

                    <View style={{margin: 10}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                            <Text style={{marginBottom: 8, color: colors.primary, fontWeight: 'bold',fontSize: 17}}>{t('home.limitedTimeOffer')}</Text>
                        </View>
                        {loading ? (
                            <FlatList
                                data={[1, 2]}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={() => <SkeletonProductCard />}
                                scrollEnabled={false}
                            />
                        ) : (
                            <FlatList
                                data={limitedTimeProducts}
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
                        )}
                    </View>

                    <View style={{margin: 10}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                            <Text style={{marginBottom: 8, color: colors.primary, fontWeight: 'bold',fontSize: 17}}>{t('home.bestArticles')}</Text>
                        </View>
                        {loading ? (
                            <FlatList
                                data={[1, 2]}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={() => <SkeletonProductCard />}
                                scrollEnabled={false}
                            />
                        ) : (
                            <FlatList
                                data={bestArticlesProducts}
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
                        )}
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}