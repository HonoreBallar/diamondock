import { Text, View } from "react-native";

export default function Title({title = 'Title'}){
    return(
        <View style={{margin: 15}}>
            <Text style={{fontSize: 29, fontWeight: '900'}}>{title}</Text>
            <View style={{width: '20%', borderWidth: 2, borderColor: '#A9C7FF'}}></View>
        </View>
    )
}