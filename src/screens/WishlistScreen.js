import { ScrollView, Text, View } from "react-native"
import Header from "../components/Header";
import Title from "../components/Title";
import { useWishlist } from "../context/WishlistContext";
import WishlistCard from "../components/WhishlistCard";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from "../utils/colors";

export default function WishlistScreen({navigation}){
    const {wishlist} = useWishlist();
    return(
        <ScrollView style={{flex: 1}}>
            <Header/>
            <Title title="Mes favoris" />
            <View style={{flex: 1, padding: 15, marginBottom: 80}}>
                { wishlist.length === 0? (
                    <View style={{alignItems: 'center', justifyContent: 'center', height: 200, backgroundColor: 'white', marginTop: 150, borderRadius: 10}}>
                        <FontAwesome5 name="heartbeat" size={35} color={colors.primary} style={{marginTop: 5}}/>
                        <Text style={{fontSize: 18, fontWeight: 'bold', color: colors.primary}}>Votre liste de favoris est vide.</Text>
                    </View>
                ) : (
                    <>
                    {
                        wishlist.map((product, index) => (
                            <View key={index.toString()}>
                                <WishlistCard navigation={navigation} product={product} />
                            </View>
                        ))

                    }
                    </>
                )}
            </View>
        </ScrollView>
    );
}