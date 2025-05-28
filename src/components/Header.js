import { Image, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../utils/colors';
import { useNavigation } from '@react-navigation/native';

export default function Header(){

    const navigation = useNavigation();

    return (
        <View>
            <View style={{flexDirection: 'row',justifyContent:'space-between' ,paddingHorizontal: 15, height: 60, marginTop: 40, alignItems: 'center'}}>
                <TouchableOpacity onPress={()=>navigation.navigate('Main')}>
                    <Image source={require('../assets/logo.png')} style={{width: 190, height: "100%"}} resizeMode='contain'/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate('DrawerScreen')}>
                    <FontAwesome5 name="stream" size={20} color="#000" style={{marginTop: 9}}/>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={()=>navigation.navigate('SearchScreen')} style={{flexDirection: 'row',borderWidth: 0.1, marginHorizontal: 10, borderRadius: 5, backgroundColor: '#f4f4f4', height: 45, alignItems: 'center'}}>
                    <FontAwesome5 name="search" size={18} color="#000" style={{marginTop: 5, marginLeft: 15}}/>
                    <Text style={{marginLeft: 8, fontSize: 16, marginTop: 4,}}>Rechercher un article ...</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}