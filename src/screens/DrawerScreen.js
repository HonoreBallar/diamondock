import Constants from 'expo-constants';
import { Text, TouchableOpacity, View } from "react-native";
import colors from "../utils/colors";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CardNavigation from "../components/CardNavigation";

export default function DrawerScreen({navigation}){
    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <View style={{marginTop: 20, padding: 15, backgroundColor: '#f9f9f9', borderBottomRightRadius: 35, borderBottomLeftRadius: 35, elevation: 2}}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <FontAwesome5 name="angle-left" size={28} color="#000" style={{marginTop: 15}}/>
                </TouchableOpacity>
                <Text style={{fontSize: 25, fontWeight: 'bold', color: colors.primary, marginTop: 15, textAlign: 'center'}}>Diamondock</Text>
            </View>
            <View style={{margin: 18, marginTop: 35}}>
                <CardNavigation icon={'digital-ocean'} title={'Digital Mall'} navigateTo={"DigitalMallScreen"}/>
                <CardNavigation icon={'laptop-code'} title={'Social Media Manager'} navigateTo={"SocialMediaManager"} navigation={navigation}/>
                <CardNavigation icon={'trophy'} title={'Diamond Ares'} navigateTo={"DiamondAresScreen"}/>
                <CardNavigation icon={'store'} title={'Vendeur'}/>
                <CardNavigation icon={'user-tie'} title={'Devenir Vendeur'}/>
            </View>
            <Text style={{textAlign: 'center', marginTop: 60, color: '#999'}}>Version : {Constants.expoConfig.version} © Diamondock</Text>
        </View>
    )
}