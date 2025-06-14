import { useState } from "react";
import { Keyboard, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, View } from "react-native";
import HeaderLogo from "../components/HeaderLogo";
import Title from "../components/Title";
import Input from "../components/Input";
import Btn from "../components/Btn";

export default function OrderStepTwo({ navigation, route }) {

    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleNext = () => {
        if (address.trim() === '') {
            showMessage({
                message: "Veuillez entrer une adresse valide",
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }
        navigation.navigate('OrderStepThree', { order: { ...order, address } });
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: 'white' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <HeaderLogo />
                        <Title title="Étape 2 : Informations de livraison" />
                        <View style={{ marginTop: 20, marginHorizontal: 15 }}>
                            <Input
                                label="Adresse de livraison"
                                icon="map-marker-alt"
                                placeholder="Entrez votre adresse"
                                value={address}
                                onChangeText={setAddress}
                                isRequired={true}
                            />
                            <Btn
                                title="Suivant"
                                onPress={handleNext}
                                loading={loading}
                            />
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}