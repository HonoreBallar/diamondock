import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Title from "../components/Title";
import colors from "../utils/colors";

export default function SocialMediaManager({navigation}){
    return(
        <ScrollView style={{flex: 1}}>
            <View style={{marginTop: 20, padding: 15, backgroundColor: '#f9f9f9', borderBottomRightRadius: 35, borderBottomLeftRadius: 35, elevation: 2}}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <FontAwesome5 name="angle-left" size={28} color="#000" style={{marginTop: 15}}/>
                </TouchableOpacity>
                <Text style={{fontSize: 25, fontWeight: 'bold', color: colors.primary, marginTop: 15, textAlign: 'center'}}>Diamondock</Text>
            </View>
            <Title title="Social Media Manager" />
        </ScrollView>
    );
}