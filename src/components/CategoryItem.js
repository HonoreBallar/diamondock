import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const CategoryItem =({category, navigation})=>{
    return(
        <TouchableOpacity onPress={()=>navigation.navigate('CategoryDetailScreen',{category: category})} style={{marginRight: 10, marginBottom: 10, padding: 5 }}>
            <View style={{width: 80, height: 80, borderRadius: 40, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: '#ccc'}}>
                <Image source={{uri: category?.image}} style={{width: 80, height: 80, borderRadius: 40}} resizeMode="cover"/>
            </View>
            <Text style={{fontSize: 14, fontWeight: '400',textAlign: 'center'}} numberOfLines={2}>{category?.name || 'Categorie'} ({category?.nb_products || 0})</Text>
        </TouchableOpacity>
    );
}

export default React.memo(CategoryItem);