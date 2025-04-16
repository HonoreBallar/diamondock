import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Header from "../components/Header";
import Title from "../components/Title";
import { useState } from "react";

const ordersData = [
    { id: "1", status: "en attente", price: 25 },
    { id: "2", status: "livré", price: 50 },
    { id: "3", status: "annulé", price: 30 },
    { id: "4", status: "en attente", price: 40 },
];

export default function OrderScreen(){
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
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.orderItem}>
                            <Text>Commande #{item.id} - Statut : {item.status}</Text>
                            <Text>Prix : ${item.price}</Text>
                        </View>
                    )}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    buttonContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10, textAlign: 'center' },
    button: {
        backgroundColor: "gray",
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 15,
        width: '80',
    },
    activeButton: {
        backgroundColor: "blue", // Couleur du bouton actif
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
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