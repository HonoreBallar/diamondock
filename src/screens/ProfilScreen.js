import { ScrollView, Text } from "react-native"
import Header from "../components/Header";
import Title from "../components/Title";

export default function ProfilScreen(){
    return(
        <ScrollView style={{flex: 1}}>
            <Header />
            <Title title="Mon compte" />
        </ScrollView>
    );
}