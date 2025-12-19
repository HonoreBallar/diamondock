import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import colors from "../utils/colors";

export default function Btn({label, action, loader = false, disabled = false}) {
    return (
        <TouchableOpacity 
            disabled={disabled} 
            onPress={action} 
            style={{ 
                backgroundColor: disabled ? '#ccc' : colors.primary, 
                padding: 14, 
                borderRadius: 10,
                opacity: disabled ? 0.6 : 1
            }}
        >
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                {loader && <ActivityIndicator size={'small'} color={"white"} /> }
                <Text style={{ color: disabled ? '#666' : 'white', fontWeight: 'bold', fontSize: 18, textAlign: 'center', marginLeft: 5 }}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
}