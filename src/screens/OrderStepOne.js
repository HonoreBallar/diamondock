import { useState } from "react";
import HeaderLogo from "../components/HeaderLogo";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { Image, Keyboard, KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Title from "../components/Title";
import Btn from "../components/Btn";
import Input from "../components/Input";
import colors from "../utils/colors";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useCart } from "../context/CartContext";
import { formatAmount } from "../utils/utils";

export default function OrderStepOne({navigation}) {
    const { cart, getTotal, productListInCart, currency } = useCart();
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    
    const [phone, setPhone] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLasttname] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');


    const handleNext = () => {
        if (phone.trim() === '' || phone.length < 10) {
            showMessage({
                message: "Veuillez entrer un numéro de téléphone valide",
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }

        const completePhone =  '+225'+ phone;
        const customer = {
            firstname: firstname,
            lastname: lastname,
            phone: completePhone,
            email: email,
            address: address,
        }

        const datas = {
            customer: customer,
            products: productListInCart,
        };

        setLoading(true);
        setTimeout(()=>{
            navigation.navigate('OrderStepTwo', {datas: datas});
            setLoading(false);
        }, 200);

    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: 'white' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{flex: 1}}>
                    <ScrollView style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <HeaderLogo />
                        <Title title="Étape 1 : Informations de contact" />
                        <View style={{ marginTop: 20, marginHorizontal: 15 }}>
                            <Input
                                label="Téléphone"
                                icon="phone"
                                placeholder="Entrez votre téléphone"
                                keyboardType="numeric"
                                value={phone}
                                onChangeText={setPhone}
                                isRequired={true}
                                maxLength={10}
                            />
                            <Input
                                label="Nom"
                                icon="user-tie"
                                placeholder="Entrez votre nom"
                                value={firstname}
                                onChangeText={setFirstname}
                            />
                            <Input
                                label="Prénoms"
                                icon="user-tie"
                                placeholder="Entrez votre prénoms"
                                value={lastname}
                                onChangeText={setLasttname}
                            />
                            <Input
                                label="Email"
                                icon="envelope"
                                placeholder="Entrez votre email"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <Input
                                label="Adresse"
                                icon="map-marker-alt"
                                placeholder="Cocody Abidjan"
                                value={address}
                                onChangeText={setAddress}
                            />
                            <View style={{borderWidth: 1 , borderColor: '#ccc', borderRadius: 10}}>
                                <TouchableOpacity onPress={toggleExpanded} style={{flexDirection: 'row', justifyContent: 'space-between', padding: 15}}>
                                    <Text style={{color: colors.primary, fontSize: 15}}>Resumé de commande</Text>
                                    <FontAwesome5 name={isExpanded ? 'chevron-up' : 'chevron-down'} size={15} color="black" style={{}}/>
                                </TouchableOpacity>
                                {isExpanded && (
                                    cart.map(product => (
                                        <View key={product.token} style={{flexDirection: 'row', justifyContent:'space-between', marginHorizontal: 15, marginVertical: 10}}>
                                            <View style={{flexDirection: 'row'}}>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <View style={{marginRight: 15, height: 40, width: 40, borderRadius: 45, backgroundColor: 'white', borderWidth: 0.2, justifyContent: 'center', alignItems: 'center'}}>
                                                        <Image source={{uri: product?.main_image}} style={{height: 40, width: 40, borderRadius: 40}}/>
                                                    </View>
                                                    <View style={{borderWidth: 0.1, backgroundColor: '#e5ebfc', height: 18, width: 18, borderRadius:15, justifyContent: 'center', alignItems: 'center',position: 'absolute', top: 4, left: 30 }}>
                                                        <Text style={{fontSize: 11, fontWeight: '500'}}>{product.quantity}</Text>
                                                    </View>
                                                    <View style={{width: '65%',flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                        <Text style={{width: '40%'}} numberOfLines={3}>{product?.name}</Text>
                                                        <Text style={{fontWeight: 'bold', fontSize: 18}}>{formatAmount(product.price * product.quantity)} {product?.currency}</Text>
                                                    </View>
                                                </View>
                                                <Text style={{width: '60%', marginRight: 5}} numberOfLines={2}>{product.name} ({product.quantity})</Text>
                                            </View>
                                            {/* <Text style={{fontWeight: 'bold'}}>{formatAmount(product.price * product.quantity)} {product?.currency}</Text> */}
                                        </View>
                                    ))
                                )}
                                <View style={{flexDirection: 'row', justifyContent:'space-between', marginHorizontal: 15, marginBottom: 10}}>
                                    <Text style={{fontSize: 17, fontWeight: 'bold', marginBottom: 8, marginLeft: 3}}>Total</Text>
                                    <Text style={{color: colors.primary, fontSize: 20, fontWeight: 'bold'}}>{formatAmount(getTotal())} {currency}</Text>
                                </View>
                            </View>
                            <View style={{marginTop: 20}}>
                                <Btn label={"Enregistrer la commande"} loader={loading} action={handleNext} />
                            </View>
                            <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginTop: 5}}>
                                <Text style={{color: '#ccc', fontWeight: 'bold', textDecorationLine: 'underline', textAlign: 'center'}}>Voir le panier</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}