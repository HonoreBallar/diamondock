import { useEffect, useRef } from "react";
import Constants from 'expo-constants';
import { ActivityIndicator, Image, Text, View } from "react-native";

export default function ChangeLangueScreen({navigation}){

    useEffect(() => {
        const timeout = setTimeout(() => {
            navigation.navigate('Main');
        }, 500);

        return () => clearTimeout(timeout); 
    }, []);

    return(
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
            <Image
                source={require('../assets/icon.png')}
                style={{
                    width: 200,
                    height: 200,
                }}
                resizeMode='contain'
            />
            <ActivityIndicator size="large" color="#000000" style={{marginTop: 40}} />
            <Text style={{position:'absolute', bottom: 15 , color: '#999', alignSelf: 'center'}}>Version : {Constants?.expoConfig.version} © Diamondock</Text>
        </View>
    )
}