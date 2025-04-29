import { useEffect, useRef } from "react";
import Constants from 'expo-constants';
import { Animated, Text, View } from "react-native";

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
            {/* <Animated.Text style={{ opacity: fadeAnim, fontSize: 44, color: 'orange', fontWeight: 'bold' }}>
                DIAMONDOCK
            </Animated.Text> */}
            <Text style={{position:'absolute', bottom: 15 , color: '#999', alignSelf: 'center'}}>Version : {Constants?.expoConfig.version} © Diamondock</Text>
        </View>
    )
}