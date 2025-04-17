import { ScrollView, Text } from "react-native"
import Header from "../components/Header";
import Title from "../components/Title";

export default function DigitalMallScreen(){
    return(
        <ScrollView style={{flex: 1, marginTop: 40}}>
            {/* <Header /> */}
            <Title title="Digital Mall" />
        </ScrollView>
    );
}