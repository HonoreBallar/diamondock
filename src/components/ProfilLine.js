import { Linking, Text, TouchableOpacity, View } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from "@react-navigation/native";

export default function ProfilLine({icon, iconColor, title, onPress, navigateTo, isExternalLink = false}) {
    const navigation = useNavigation();

    const handlePress = async () => {
        if (isExternalLink && navigateTo) {
            const canOpen = await Linking.canOpenURL(navigateTo);
            if (canOpen) {
                await Linking.openURL(navigateTo);
            }
        } else if (navigateTo) {
            navigation.navigate(navigateTo);
        } else if (onPress) {
            onPress();
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} style={{padding: 10, marginBottom: 5}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                    <FontAwesome5 name={icon} size={16} color={iconColor} style={{marginTop: 1}}/>
                    <Text style={{fontSize: 18, marginLeft: 5}}>{title}</Text>
                </View>
                <FontAwesome5 name="angle-right" size={16} color="#000" />
            </View>
        </TouchableOpacity>
    );
}