import { Image, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../utils/colors';

export default function Header({navigation}){
    return (
        <View style={{flexDirection: 'row',justifyContent:'space-between' ,padding: 15, height: 60, marginTop: 40}}>
            <Text style={{fontSize: 25, fontWeight: 'bold', color: colors.primary}}>Diamondock</Text>
            <View>
            </View>
            <TouchableOpacity onPress={()=>alert('menu')}>
                <FontAwesome5 name="stream" size={20} color="#000" style={{marginTop: 9}}/>
            </TouchableOpacity>
        </View>
    )
}