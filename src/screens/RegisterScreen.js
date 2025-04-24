import { ScrollView, Text, View } from "react-native";
import HeaderSimple from "../components/HeaderSimple";
import Input from "../components/Input";
import Btn from "../components/Btn";

export default function RegisterScreen({navigation}){
    return(
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
            <HeaderSimple title="Inscription" />
            <View style={{marginTop: 20, marginHorizontal: 15}}>
                <Text style={{fontSize: 20, fontWeight: '600', marginBottom: 10}}>Bienvenue sur notre application</Text>
                <Text style={{fontSize: 16, fontWeight: '400', marginBottom: 20}}>Veuillez vous inscrire pour continuer</Text>
                
                <View>
                    <Input
                        label="Nom"
                        icon="user-tie"
                        placeholder="Entrez votre nom"
                        // onChangeText={(text) => {}}
                    />
                    <Input
                        label="Téléphone"
                        icon="phone"
                        placeholder="Entrez votre téléphone"
                        keyboardType="numeric"
                        // onChangeText={(text) => {}}
                    />
                    <Input
                        label="Email"
                        icon="envelope"
                        placeholder="Entrez votre email"
                        keyboardType="email-address"
                        // onChangeText={(text) => {}}
                    />
                    <Input
                        label="Mot de passe"
                        icon="lock"
                        placeholder="Entrez votre mot de passe"
                        secureTextEntry={true}
                        onChangeText={(text) => {}}
                    />
                </View>
                <View style={{marginTop: 20}}>
                    <Btn label={"S'inscrire"} loader={false} onPress={() => {}} />
                </View>
                <View>
                    <Text style={{textAlign: 'center', marginTop: 20, fontSize: 16, fontWeight: '400'}}>
                        Vous avez déjà un compte ? 
                        <Text onPress={() => navigation.navigate('LoginScreen')} style={{color: 'blue'}}> Connectez-vous</Text>
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}