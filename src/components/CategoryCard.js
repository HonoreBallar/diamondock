import { Image, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function CategoryCard({category, navigation}){
    return(
        <TouchableOpacity onPress={()=>navigation.navigate('CategoryDetailScreen', {category: category})} style={{height: 80, backgroundColor: '#e5ebfc', flexDirection: 'row', alignItems: 'center', borderRadius: 10}}>
            <View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 0.2, borderColor: '#ccc', marginLeft: 10}}>
                <Image source={category?.image ? {uri: category?.image} : require('../assets/icon.png')} style={{width: 50, height: 50, borderRadius: 25}} resizeMode="cover"/>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '70%'}}>
                <Text style={{marginLeft: 10, fontSize: 18, fontWeight: '400'}}>{category?.name ?? 'name'}</Text>  
                <View style={{flexDirection: 'row'}}>
                    <View style={{width: 20, height: 20 , borderRadius: 10, backgroundColor: '#A9C7FF', marginRight: 8, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontWeight: '300',}}>{category?.nb_products ?? 0}</Text>
                    </View>
                    <FontAwesome5 name="chevron-right" size={17} color="black" style={{marginTop: 2}}/>
                </View>
            </View>
        </TouchableOpacity>
    )
}