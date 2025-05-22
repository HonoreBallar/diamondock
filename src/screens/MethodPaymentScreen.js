import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import HeaderSimple from "../components/HeaderSimple";
import { useState } from "react";
import { RadioButton } from "react-native-paper";
import colors from "../utils/colors";

export default function MethodPaymentScreen({navigation}){

    const [payment, setPayment] = useState('cash');

    return(
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
            <HeaderSimple title="Méthode de paiement" />
            <View style={{margin: 15}}>
                <TouchableOpacity onPress={()=>setPayment('cash')} style={{flexDirection: 'row', backgroundColor: payment == "cash" ? '#e5ebfc' : '#f9f9f9', borderRadius: 8, padding: 15, alignItems: 'center', marginBottom: 8}}>
                    <RadioButton
                        value="cash"
                        status={ payment === 'cash' ? 'checked' : 'unchecked' }
                        onPress={() => setPayment('cash') }
                        color="#4f6dff"
                    />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '80%'}}>
                        <Text style={{ fontWeight: '500', fontSize: 19}}>Cash à la livraison</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setPayment('credit_card')} style={{flexDirection: 'row', backgroundColor: payment == "credit_card" ? '#e5ebfc' : '#f9f9f9', borderRadius: 8, padding: 15, alignItems: 'center'}}>
                    <RadioButton
                        value="credit_card"
                        status={ payment === 'credit_card' ? 'checked' : 'unchecked' }
                        onPress={() => setPayment('credit_card') }
                        color="#4f6dff"
                    />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '90%'}}>
                        <Text style={{ fontWeight: '500', fontSize: 19}}>Visa, Mastercard</Text>
                        {/* <View style={{justifyContent: 'center', alignItems: 'center', width: 30, height: 30, borderRadius: 15, borderWidth: 0.3}}>
                            <Text style={{fontWeight: '700', fontSize: 18,  alignContent: 'center', justifyContent: 'center' }}>➕</Text>
                        </View> */}
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}