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
            <View>
                <TouchableOpacity onPress={()=>alert('menu')} style={{flexDirection: 'row',borderWidth: 0.1, marginHorizontal: 10, borderRadius: 5, backgroundColor: '#f4f4f4', height: 45, alignItems: 'center'}}>
                    <FontAwesome5 name="search" size={18} color="#000" style={{marginTop: 5, marginLeft: 15}}/>
                    <Text style={{marginLeft: 8, fontSize: 16, marginTop: 4,}}>Rechercher un article ...</Text>
                </TouchableOpacity>
            </View>
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
                                <View style={{width: 80, height: 80, borderRadius: 40, backgroundColor: 'white', elevation: 3, justifyContent: 'center', alignItems: 'center'}}>
                                    <Image source={require('../assets/chaussure.jpg')} style={{width: 60, height: 60}} resizeMode="contain"/>
                                </View>
                                <Text style={{fontSize: 14, fontWeight: '400',}}>{item.name || 'Categorie'} ({item.nb_products || 0})</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <View style={{margin: 10}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                        <Text style={{marginBottom: 8, color: colors.primary, fontWeight: 'bold',fontSize: 17}}>Nouvel arrivage</Text>
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