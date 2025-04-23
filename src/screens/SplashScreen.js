import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

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
            <Animated.Text style={{ opacity: fadeAnim, fontSize: 44, color: 'orange', fontWeight: 'bold' }}>
                DIAMONDOCK
            </Animated.Text>
        </View>
    )
}