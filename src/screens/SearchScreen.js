import { useMemo, useState } from "react";
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import FlottingCart from "../components/FlottingCart";
import { useTranslation } from "../context/LocalizationContext";
import { useRootContext } from "../context/RootContext";
import FilterModal from "../components/FilterModal";

export default function SearchScreen({ navigation }) {
  const { t } = useTranslation();
  const {products} = useProducts();
  const {countries} = useRootContext();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  // const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // États des filtres
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Récupérer les catégories uniques des produits
  const categories = [...new Set(products.map(p => p?.category).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    return products.filter(item => {

      if (searchText.trim()) {
        const text = searchText.toLowerCase();
        const match =
          item?.name?.toLowerCase().includes(text) ||
          item?.title?.toLowerCase().includes(text) ||
          item?.seller?.toLowerCase().includes(text);

        if (!match) return false;
      }

      const price = Number(item?.price) || 0;
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;

      if (price < min || price > max) return false;

      if (selectedCategory && item?.category !== selectedCategory) {
        return false;
      }

      if (selectedCountry && item?.country !== selectedCountry?.name && item?.country_id !== selectedCountry?.id) {
        return false;
      }

      return true;
    });
  }, [
    products,
    searchText,
    minPrice,
    maxPrice,
    selectedCategory,
    selectedCountry
  ]);


  const handleSearch = () => {
    handleResetFilters();
  }

  const handleResetFilters = () => {
    setSearchText("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedCountry(null);
    setSelectedCategory(null);
  };
  
  return (
    <View style={{ flex: 1, marginHorizontal: 5, backgroundColor: "#fff", paddingBottom: 8}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginHorizontal: 10}}>
        <View style={{flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{marginRight: 10}}>
            <FontAwesome5 name="arrow-left" size={20} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            {t('search.searchTitle')}
          </Text>
        </View>
        <FlottingCart navigation={navigation} />
      </View>
      <View style={{marginVertical: 15}}>
          <View style={{flexDirection: 'row',borderWidth: 0.1, marginHorizontal: 10, borderRadius: 5, backgroundColor: '#f4f4f4', height: 45, alignItems: 'center'}}>
            <FontAwesome5 name="search" size={18} color="#000" style={{marginTop: 3, marginLeft: 15}}/>
            <TextInput autoFocus={false} keyboardType="default" placeholder={t('search.searchPlaceholder')} placeholderTextColor="#000" value={searchText} maxLength={50} onChangeText={setSearchText}   style={{flex: 1, padding: 10}}/>
            {searchText.length > 0 && (
              <TouchableOpacity onPress={handleSearch} style={{marginRight: 10}}>
                <FontAwesome5 name="times" size={18} color="#000" style={{marginLeft: 15}}/>
              </TouchableOpacity>
            )
            }
            <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={{marginRight: 15}}>
              <FontAwesome5 name="sliders-h" size={18} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Filtres */}
          <FilterModal
            visible={showFilters}
            onClose={() => setShowFilters(false)}
            minPrice={minPrice}
            maxPrice={maxPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            countries={countries}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            onReset={handleResetFilters}
            resultsCount={filteredProducts.length}
          />

      </View>
      <View style={{marginTop: 1, flex: 1}}>
        {filteredProducts.length === 0 && searchText.length === 0 && (
          <View style={{alignItems: 'center', marginTop: 190}}>
            <FontAwesome5 name="search" size={30} color="gray" />
            <Text style={{fontSize: 16, color: 'gray'}}>{t('search.searchPlaceholder')}</Text>
          </View>
        )}
        {filteredProducts.length === 0 && searchText.length > 0 && (
          <View style={{alignItems: 'center', marginTop: 190}}>
            <FontAwesome5 name="grin-beam-sweat" size={30} color="gray" />
            <Text style={{fontSize: 16, color: 'gray'}}>{t('search.noResults')} "{searchText}"</Text>
          </View>
        )}
        {filteredProducts.length > 0 && (
           <ScrollView style={{marginBottom: 40}}>
              <FlatList
                  data={filteredProducts}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={2}
                  initialNumToRender={2}
                  maxToRenderPerBatch={2}
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