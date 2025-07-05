import { useState } from "react";
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import FlottingCart from "../components/FlottingCart";

export default function SearchScreen({ navigation }) {
  const {products} = useProducts();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleSearchChange = (text) => {
    setSearchText(text);
    if (text.length > 0) {
      const filtered = products.filter(item => 
        item?.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleSearch = () => {
    setSearchText("");
    setFilteredProducts([]);
  }
  
  return (
    <View style={{ flex: 1, marginHorizontal: 5, backgroundColor: "#fff"  }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginHorizontal: 10}}>
        <View style={{flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{marginRight: 10}}>
            <FontAwesome5 name="arrow-left" size={20} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            Recherche
          </Text>
        </View>
        <FlottingCart navigation={navigation} />
      </View>
      <View style={{marginVertical: 15}}>
          <View style={{flexDirection: 'row',borderWidth: 0.1, marginHorizontal: 10, borderRadius: 5, backgroundColor: '#f4f4f4', height: 45, alignItems: 'center'}}>
            <FontAwesome5 name="search" size={18} color="#000" style={{marginTop: 3, marginLeft: 15}}/>
            <TextInput autoFocus={true} keyboardType="default" placeholder="Rechercher un produit ..." value={searchText} maxLength={10} onChangeText={(text)=>handleSearchChange(text)}   style={{width: '78%', padding: 10}}/>
            {searchText.length > 0 && (
              <TouchableOpacity onPress={handleSearch} style={{}}>
                <FontAwesome5 name="times" size={18} color="#000" style={{marginTop: 5, marginLeft: 15}}/>
              </TouchableOpacity>
            )
            }
          </View>
      </View>
      <View style={{marginTop: 1, flex: 1}}>
        {filteredProducts.length === 0 && searchText.length === 0 && (
          <View style={{alignItems: 'center', marginTop: 190}}>
            <FontAwesome5 name="search" size={30} color="gray" />
            <Text style={{fontSize: 16, color: 'gray'}}>Rechercher un produit ...</Text>
          </View>
        )}
        {filteredProducts.length === 0 && searchText.length > 0 && (
          <View style={{alignItems: 'center', marginTop: 190}}>
            <FontAwesome5 name="grin-beam-sweat" size={30} color="gray" />
            <Text style={{fontSize: 16, color: 'gray'}}>Aucun produit trouvé pour "{searchText}"</Text>
          </View>
        )}
        {filteredProducts.length > 0 && searchText.length > 0 && (
           <ScrollView style={{marginBottom: 20}}>
              <FlatList
                  data={filteredProducts}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={2}
                  contentContainerStyle={{paddingHorizontal: 19}}
                  scrollEnabled={false}
                  renderItem={({ item, index }) => (
                      <ProductCard key={index.toString()} product={item} navigation={navigation}/>
                  )}
                  columnWrapperStyle={{marginBottom: 15}}
              />
            </ScrollView>
        )}
      </View>
    </View>
  );
}