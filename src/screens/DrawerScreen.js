import Constants from 'expo-constants';
import { Image, Text, TouchableOpacity, View } from "react-native";
import colors from "../utils/colors";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CardNavigation from "../components/CardNavigation";
import { useTranslation } from '../context/LocalizationContext';

export default function DrawerScreen({navigation}){
    const {t} = useTranslation();
    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <View style={{padding: 15, backgroundColor: '#f9f9f9', borderBottomRightRadius: 25, borderBottomLeftRadius: 25, elevation: 1}}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <FontAwesome5 name="chevron-circle-left" size={28} color="#f29f03" style={{marginTop: 15}}/>
                </TouchableOpacity>
                <Image source={require('../assets/logo.png')} style={{width: 150, height: 60, alignSelf: 'center'}} resizeMode='contain'/>
            </View>
            <View style={{margin: 18, marginTop: 35}}>
                <CardNavigation icon={'store'} title={'Digital Mall'} navigateTo={"DigitalMallScreen"}/>
                <CardNavigation icon={'laptop-code'} title={'Social Media Manager'} isExternalLink={true} navigateTo={"https://manager.diamondock.com"}/>
                <CardNavigation icon={'trophy'} title={'Diamond Ares'} isExternalLink={true} navigateTo={"https://ares.diamondock.com"}/>
                <View style={{borderWidth: 1, backgroundColor: '#f9f9f9', marginVertical: 10, borderStyle: 'dashed', marginVertical: 35}}/>
                <CardNavigation icon={'user-tie'} title={t('common.becomeSeller')} isExternalLink={true} navigateTo={"https://seller.diamondock.com/#signup"}/>
            </View>
            <Text style={{position:'absolute', bottom: 15 , color: '#999', alignSelf: 'center'}}>Version : {Constants?.expoConfig.version} © Diamondock</Text>
        </View>
    )
}