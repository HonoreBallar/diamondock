import { ScrollView, Text } from "react-native"
import Header from "../components/Header";

export default function CategoryScreen(){
    return(
        <ScrollView style={{flex: 1}}>
            <Header />
        </ScrollView>
    );
}