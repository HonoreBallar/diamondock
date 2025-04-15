import { Image, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function CategoryCard({category}){
    return(
        <TouchableOpacity style={{height: 80, backgroundColor: '#e5ebfc', flexDirection: 'row', alignItems: 'center', borderRadius: 10}}>
            <View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 0.2, borderColor: '#ccc', marginLeft: 10}}>
                <Image source={{uri: category.image}} style={{width: 50, height: 50, borderRadius: 25}} resizeMode="cover"/>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '70%'}}>
                <Text style={{marginLeft: 10, fontSize: 18, fontWeight: '400'}}>{category.name}</Text>  
                <View style={{flexDirection: 'row'}}>
                    <Text style={{backgroundColor: '#A9C7FF', marginRight: 8, padding: 2, borderRadius: 5}}>10</Text>
                    <FontAwesome5 name="chevron-right" size={17} color="black" style={{marginTop: 2}}/>
                </View>
            </View>
        </TouchableOpacity>
    )
}