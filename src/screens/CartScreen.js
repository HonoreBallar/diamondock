import { ScrollView, Text } from "react-native"
import Header from "../components/Header";

export default function CartScreen(){
    return(
        <ScrollView style={{flex: 1}}>
            <Header />
        </ScrollView>
    );
}