import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Header from "../components/Header";
import Title from "../components/Title";
import { useEffect, useRef, useState } from "react";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useRootContext } from "../context/RootContext";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { getRequest } from "../utils/api";
import { wait } from "../utils/utils";
import PhoneInput from "react-native-phone-number-input";
import colors from "../utils/colors";
import { useTranslation } from "../context/LocalizationContext";

export default function OrderScreen({navigation}){
    const {auth} = useRootContext();
    const { t } = useTranslation();

    const [filteredOrders, setFilteredOrders] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeFilter, setActiveFilter] = useState(t('order.statusPending')); // 'En attente' par défaut
    const [loading, setLoading] = useState(false);

    const phoneInput = useRef(null);
    const [phone, setPhone] = useState(auth?.user?.phone_detail?.number || '');
    const [countryCode, setCountryCode] = useState(auth?.user?.phone_detail?.slug || 'CI');

    const orderStatus = [
        t('order.statusPending'), // 'En attente'
        t('order.statusValidated'), // 'Validé'
        t('order.statusCancelled'), // 'Annulé'
        t('order.statusDelivered'), // 'Livré'
    ]

    // Fonction de filtrage
    const filterOrders = (status) => {
        setActiveFilter(status);
        setFilteredOrders(orders.filter(order => order.status_label.toLowerCase().includes(status.toLowerCase())));
    };

    useEffect(()=>{
       if (auth?.isLoggedIn && auth?.user?.phone) {
            const fetchOrders = async () => {
                setLoading(true);
                try {
                    const response = await getRequest(`/order/all/${auth?.user?.phone}`);
                    if (response?.status === true) {
                        setOrders(response?.data || []);
                        setFilteredOrders(response?.data || []);
                    }
                } catch (err) {
                    showMessage({
                        message: "Erreur lors de la recherche de la commande",
                        type: "danger",
                        icon: { icon: "danger", position: "left" },
                        duration: 2000,
                    });
                    setLoading(false);
                } finally {
                    setLoading(false);
                }
            };

            fetchOrders();
        }
    },[auth])

    const handleSearch = async () => {

        if(phone.trim()=== ''){
            showMessage({
                message: "Veuillez entrer un numéro de commande valide",
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }
        await wait(500);
        setLoading(true);

        const code = phoneInput.current?.getCallingCode();
        const completePhone =  `+${code}${phone}`;

        try {

            setOrders([]);
            setFilteredOrders([]);

            const response = await getRequest(`/order/all/${completePhone}`);
            if(response?.status === false){
                showMessage({
                    message: response?.error,
                    type: "danger",
                    icon: { icon: "danger", position: "left" },
                    duration: 2000,
                });
                
                setLoading(false);
            }

            const ordersData = response?.data || [];
            setOrders(ordersData);

            const filteredData = ordersData.filter(order =>
                order.status_label.toLowerCase().includes(t('order.statusPending').toLowerCase())
            );
            setFilteredOrders(filteredData);
            setLoading(false);
            
        } catch (error) {
            showMessage({
                message: "Erreur lors de la recherche de la commande",
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            setLoading(false);
        }finally{
            setLoading(false);
        }
    }

    return(
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <Header/>
            <ScrollView>
                <Title title={t('order.ordersTitle')} />
                <View style={{ position: "relative", width: "95%" , marginHorizontal: 10}}>
                    <PhoneInput
                        ref={phoneInput}
                        value={phone}
                        defaultCode={countryCode}
                        layout="second"
                        onChangeText={setPhone}
                        placeholder={t('order.inputPlaceholder')}
                        containerStyle={{
                            width: "100%",
                            borderRadius: 12,
                            marginBottom: 12,
                            height: 45,
                            borderWidth: 1,
                            borderColor: '#ccc',
                            backgroundColor: '#fff',
                        }}
                        textContainerStyle={{
                            flex: 0.9,
                            backgroundColor: '#fff',
                            paddingVertical: 0,
                            paddingLeft: 0,
                            height: 40,
                        }}
                    />

                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            right: 15,
                            top: 13,
                        }}
                        onPress={handleSearch}
                    >
                        {
                            loading ? (
                                <ActivityIndicator size="small" color="#000" style={{marginLeft: 15}}/>
                            ) : (
                                <FontAwesome5 name="search" size={18} color="#000" style={{ marginLeft: 15}}/>
                            )
                        }
                    </TouchableOpacity>
                </View>
                <View>
                    <View style={styles.buttonContainer}>
                        {orderStatus.map((status) => (
                            <TouchableOpacity
                                key={status}
                                style={[
                                    styles.button,
                                    activeFilter === status ? styles.activeButton : null, // Change l'apparence du bouton actif
                                ]}
                                onPress={() => filterOrders(status)}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        activeFilter === status ? styles.activeButtonText : null,
                                    ]}
                                >
                                    {status}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                     {loading ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={{ marginTop: 10 }}>{t('order.loadingOrders')}</Text>
                        </View>
                    ) : (
                        <View style={{margin: 8}}>
                            <FlatList
                                data={filteredOrders}
                                scrollEnabled={false}
                                keyExtractor={(item, index) => index.toString()}
                                style={{ marginTop: 10, marginBottom: 20 }}
                                renderItem={({ item }) => (
                                    <View style={{borderWidth: 0.3, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5, margin: 5, backgroundColor: '#f9f9f9'}}>
                                        <View style={{flexDirection: 'row', marginTop: 1, justifyContent: 'space-between', marginBottom: 2}}>
                                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Commande #{item.order_number}</Text>
                                            <Text style={{ backgroundColor: item?.status_color,padding: 2, borderRadius: 5 }}>{item?.status_label}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', marginTop: 1, justifyContent: 'space-between', marginBottom: 2}}>
                                            <Text style={{ fontSize: 14, color: '#666', width: '50%' }} numberOfLines={2}>{item?.product_name} ({item?.quantity})</Text>
                                            <Text style={{fontWeight: '600' }}>Prix : {item?.amount} {item?.currency}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', marginTop: 1, justifyContent: 'space-between'}}>
                                            <View style={{flexDirection: 'row', marginTop: 5}}>
                                                <FontAwesome5 name="clock" size={12} color="#666" style={{marginTop: 2, marginRight: 5}}/>
                                                <Text style={{ color: '#666' }}>{item?.order_date}</Text>
                                            </View>
                                            <View style={{flexDirection: 'row', marginTop: 5}}>
                                                <FontAwesome5 name="money-bill-wave" size={12} color="#666" style={{marginTop: 2, marginRight: 5}}/>
                                                <Text style={{ color: '#666' }}>{item?.payment_method === 'online' ? item?.payment_option : 'Cash'}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                                ListEmptyComponent={
                                    filteredOrders.length === 0 ? (
                                        <Text style={{ textAlign: 'center', marginTop: 20 }}>{t('order.noOrders')}</Text>
                                    ) : null
                                }
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    )}

                    {auth.isLoggedIn === false && (
                        <View style={{marginTop: 20, marginBottom: 20}}>
                            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={{marginHorizontal: 15, borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 10, backgroundColor: '#f9f9f9'}}>
                                <Text style={{textAlign: 'center', fontWeight: '600', fontSize: 16, color: 'blue'}}>{t('order.login')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    buttonContainer: { 
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        marginTop: 15,
        marginHorizontal: 10,
        textAlign: 'center' 
    },
    button: {
        backgroundColor: "#f4f4f4",
        alignContent: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 15,
        width: '80',
    },
    activeButton: {
        backgroundColor: "#f29f03", // Couleur du bouton actif
    },
    buttonText: {
        color: "#ccc",
        fontWeight: "bold",
        textAlign: 'center',
        // textTransform: 'capitalize'
    },
    activeButtonText: {
        color: "white", // Couleur du texte du bouton actif
    },
    orderItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
});