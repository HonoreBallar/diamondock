import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Header from "../components/Header";
import Title from "../components/Title";
import { useState } from "react";
import { useRootContext } from "../context/RootContext";

const ordersData = [
    // { id: "1", status: "en attente", price: 25 },
    // { id: "2", status: "livré", price: 50 },
    // { id: "3", status: "annulé", price: 30 },
    // { id: "4", status: "en attente", price: 40 },
];

export default function OrderScreen({navigation}){
    const {auth} = useRootContext();
    const [filteredOrders, setFilteredOrders] = useState(ordersData);
    const [activeFilter, setActiveFilter] = useState("tous");

    // Fonction de filtrage
    const filterOrders = (status) => {
        setActiveFilter(status);
        if (status === "tous") {
            setFilteredOrders(ordersData);
        } else {
            setFilteredOrders(ordersData.filter(order => order.status === status));
        }
    };

    return(
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
            <Header/>
            <Title title="Mes commandes" />
            <View>
                {filterOrders.length > 1 && (
                    <View style={styles.buttonContainer}>
                        <Text>{filterOrders.length}</Text>
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
                )}

                <FlatList
                    data={filteredOrders}
                    scrollEnabled={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.orderItem}>
                            <Text>Commande #{item.id} - Statut : {item.status}</Text>
                            <Text>Prix : ${item.price}</Text>
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
    buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10, marginHorizontal: 10, textAlign: 'center' },
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