import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Header from "../components/Header";
import Title from "../components/Title";
import colors from "../utils/colors";

export default function DiamondAresScreen({navigation}){
    return(
        <ScrollView style={{flex: 1}}>
            <View style={{padding: 15, backgroundColor: '#f9f9f9', borderBottomRightRadius: 25, borderBottomLeftRadius: 25, elevation: 1}}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <FontAwesome5 name="chevron-circle-left" size={28} color="#000"/>
                </TouchableOpacity>
                <Text style={{fontSize: 25, fontWeight: 'bold', color: colors.primary, marginTop: 15, textAlign: 'center'}}>Diamond Ares Screen</Text>
            </View>
        </ScrollView>
    );
}