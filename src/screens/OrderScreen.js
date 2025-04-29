import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Header from "../components/Header";
import Title from "../components/Title";
import { useState } from "react";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useRootContext } from "../context/RootContext";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { getRequest } from "../utils/api";
import { wait } from "../utils/utils";

export default function OrderScreen({navigation}){
    const {auth} = useRootContext();
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [activeFilter, setActiveFilter] = useState("tous");
    const [searchText, setSearchText] = useState("0300000000");
    const [loading, setLoading] = useState(false);

    // Fonction de filtrage
    const filterOrders = (status) => {
        setActiveFilter(status);
        if (status === "tous") {
            setFilteredOrders(filteredOrders);
        } else {
            setFilteredOrders(filteredOrders.filter(order => order.status === status));
        }
    };

    const handleSearch = async () => {
        if(searchText.trim()=== '' || searchText.length < 10){
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
        const phone = '+225' + searchText;

        try {
            const response = await getRequest(`/order/all/${phone}`, auth.token);
            console.log('Response', response.data);
            setFilteredOrders(response?.data || []);
            setLoading(false);
            
        } catch (error) {
            showMessage({
                message: "Erreur lors de la recherche de la commande",
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            console.log('Error searching order', error);
            setLoading(false);
        }finally{
            setLoading(false);
        }
    }

    return(
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
            <Header/>
            <Title title="Mes commandes" />
            <View>
                <View style={{flexDirection: 'row',borderWidth: 0.1, marginHorizontal: 10, borderRadius: 5, backgroundColor: '#f4f4f4', height: 45, alignItems: 'center'}}>
                    <TextInput keyboardType="numeric" placeholder="0142216384" value={searchText} maxLength={10} onChangeText={(text)=>setSearchText(text)}   style={{width: '85%', padding: 10}}/>
                    <TouchableOpacity onPress={handleSearch} style={{}}>
                        {
                            loading ? (
                                <ActivityIndicator size="small" color="#000" style={{marginTop: 5, marginLeft: 15}}/>
                            ) : (
                                <FontAwesome5 name="search" size={18} color="#000" style={{marginTop: 5, marginLeft: 15}}/>
                            )
                        }
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <View style={styles.buttonContainer}>
                    {["tous", "en attente", "livré", "annulé"].map((status) => (
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

                <FlatList
                    data={filteredOrders}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ marginTop: 40 }}
                    renderItem={({ item }) => (
                        <View style={{borderWidth: 0.3, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5, margin: 5, backgroundColor: '#f9f9f9'}}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Commande #{item.order_number}</Text>
                            <Text style={{ backgroundColor: item?.status_color,padding: 2, borderRadius: 5, alignSelf: 'flex-start', marginVertical: 5 }}>{item?.status_label}</Text>
                            <Text style={{ color: '#666' }}>Prix : ${item?.price}</Text>
                            <View style={{flexDirection: 'row', marginTop: 5}}>
                                <FontAwesome5 name="clock" size={12} color="#666" style={{marginTop: 5, marginRight: 5}}/>
                                <Text style={{ color: '#666' }}>{item?.order_date}</Text>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Aucune commande trouvée</Text>}
                    showsVerticalScrollIndicator={false}
                />
                {auth.isLoggedIn === false && (
                    <View style={{marginTop: 20, marginBottom: 20}}>
                        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                            <Text style={{textAlign: 'center', marginBottom: 10, fontWeight: 'bold', textDecorationLine: 'underline'}}>Connecter à votre compte pour passer vos commandes</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
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
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 15,
        width: '80',
    },
    activeButton: {
        backgroundColor: "blue", // Couleur du bouton actif
    },
    buttonText: {
        color: "#ccc",
        fontWeight: "bold",
        textAlign: 'center',
        textTransform: 'capitalize'
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