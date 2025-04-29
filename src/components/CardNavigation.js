import { Linking, Text, TouchableOpacity, View } from "react-native";
import colors from "../utils/colors";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from "@react-navigation/native";

export default function CardNavigation({icon, title, navigateTo, isExternalLink = false}){
    const navigation = useNavigation();

    const handlePress = async ()=>{
        if(isExternalLink){
            const canOpen = await Linking.canOpenURL(navigateTo);
            if(canOpen){
                await Linking.openURL(navigateTo)
            }
        }else{
            navigation.navigate(navigateTo);
        }
    }
    return(
        <TouchableOpacity onPress={handlePress}  style={{backgroundColor: '#e5ebfc', borderRadius: 15, padding: 15, marginBottom: 15, borderWidth: 0.1}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                    <FontAwesome5 name={icon} size={18} color="#ffa100" style={{}}/>
                    <Text style={{fontSize: 16, marginLeft: 5,}}>{title}</Text>
                </View>
                <FontAwesome5 name="angle-right" size={22} color="#000" style={{marginTop: 1}}/>
            </View>
        </TouchableOpacity>
    )
}