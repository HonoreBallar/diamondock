import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import Header from "../components/Header";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from "../utils/colors";
import { useCategories } from "../context/CategoryContext";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";

export default function HomeScreen({navigation}){
    const {categories} = useCategories();
    const {products} = useProducts();

    return(
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
            <Header/>
            <View style={{margin: 15}}>
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{marginBottom: 8, color: colors.primary, fontWeight: 'bold', fontSize: 17}}>Catégories</Text>
                        <TouchableOpacity onPress={()=>navigation.jumpTo('Categories')}>
                            <Text style={{color: '#03045e', textAlign: 'right', fontSize: 12}}>Voir plus</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={categories}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={()=>navigation.navigate('DetailCategoryScreen',{category: item})} style={{marginRight: 10, marginBottom: 10, padding: 5 }}>
                                <View style={{width: 80, height: 80, borderRadius: 40, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: '#ccc'}}>
                                    <Image source={{uri: item.image}} style={{width: 80, height: 80, borderRadius: 40}} resizeMode="cover"/>
                                </View>
                                <Text style={{fontSize: 14, fontWeight: '400',textAlign: 'center'}}>{item.name || 'Categorie'} ({item.nb_products || 0})</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <View style={{margin: 10}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                        <Text style={{marginBottom: 8, color: colors.primary, fontWeight: 'bold',fontSize: 17}}>Nouveautés</Text>
                    </View>
                    <FlatList
                    data={products}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <ProductCard key={item.token} product={item} navigation={navigation}/>
                    )}
                    />
                </View>

                <View style={{margin: 10}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                        <Text style={{marginBottom: 8, color: colors.primary, fontWeight: 'bold',fontSize: 17}}>Offres du moments</Text>
                    </View>
                    <FlatList
                    data={products}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <ProductCard key={item.token} product={item} navigation={navigation}/>
                    )}
                    />
                </View>

                <View style={{margin: 10}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                        <Text style={{marginBottom: 8, color: colors.primary, fontWeight: 'bold',fontSize: 17}}>Meilleurs articles</Text>
                    </View>
                    <FlatList
                    data={products}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <ProductCard key={item.token} product={item} navigation={navigation}/>
                    )}
                    />
                </View>

            </View>
        </ScrollView>
    );
}