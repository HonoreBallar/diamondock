import { Text, TextInput, View } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function Input({label, icon, value ='', keyboardType='default', placeholder, isRequired = false, onChangeText, maxLength = 100, editable = true}){
    return (
        <View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize:15, fontWeight: 'bold', marginBottom: 8, marginRight: 3}}>{label}</Text>
                {isRequired && (<Text style={{color: 'red'}}>*</Text>)}
            </View>
            <View style={{flexDirection: 'row', borderWidth: 1, borderColor: '#ccc', borderRadius: 15, alignContent: 'center', marginBottom: 10}}>
                <FontAwesome5 name={icon} size={20} color='#333' style={{marginLeft: 10, marginTop: 7}}/>
                <TextInput
                keyboardType={keyboardType} placeholder={placeholder}
                onChangeText={onChangeText}
                maxLength={maxLength}
                value={value}
                style={{flex: 1, marginLeft: 5, fontSize: 15, paddingHorizontal: 10, height: 40}}
                editable={editable}
                />
            </View>
        </View>
    );
}