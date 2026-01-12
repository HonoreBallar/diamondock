import { useEffect, useRef } from "react";
import Constants from 'expo-constants';
import { ActivityIndicator, Animated, Text, View } from "react-native";

export default function SplashScreen(){

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return(
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
            <Animated.Image
                source={require('../assets/icon.png')}
                style={{
                    width: 200,
                    height: 200,
                    opacity: fadeAnim,
                }}
                resizeMode='contain'
            />
            <ActivityIndicator size="large" color="#000000" style={{marginTop: 40}} />
            <Text style={{position:'absolute', bottom: 20 , color: '#999', alignSelf: 'center'}}>Version : {Constants?.expoConfig.version} © Diamondock</Text>
        </View>
    )
}