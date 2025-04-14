import { Image, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function CategoryCard(){
    return(
        <TouchableOpacity style={{height: 80, backgroundColor: '#f2f2f2', flexDirection: 'row', alignItems: 'center', borderRadius: 10}}>
            <View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: '#ccc', marginLeft: 10}}>
                <Image source={require('../assets/chaussure.jpg')} style={{width: 50, height: 50, borderRadius: 25}} resizeMode="contain"/>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '70%'}}>
                <Text style={{marginLeft: 10, fontSize: 18, fontWeight: '500'}}>Women</Text>  
                <View style={{flexDirection: 'row'}}>
                    <Text style={{backgroundColor: '#A9C7FF', marginRight: 8, padding: 2, borderRadius: 5}}>10</Text>
                    <FontAwesome5 name="chevron-right" size={17} color="black" />
                </View>
            </View>
        </TouchableOpacity>
    )
}