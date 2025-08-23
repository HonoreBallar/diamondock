import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native"
import Header from "../components/Header";
import Title from "../components/Title";
import { useWishlist } from "../context/WishlistContext";
import WishlistCard from "../components/WhishlistCard";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from "../utils/colors";
import { ActivityIndicator } from "react-native-paper";
import { useState } from "react";
import { useTranslation } from "../context/LocalizationContext";

export default function WishlistScreen({navigation}){
    const {t} = useTranslation();
    const {wishlist, clearWishlist} = useWishlist();
    const [loadingWishlist, setloadingWishlist] = useState(false);

    const handleClearWishlist = () => {
        setloadingWishlist(true);
        Alert.alert(
            t('alerts.clearWishlist'),
            t('alerts.clearWishlistMessage'),
            [
                {text: t('common.cancel'), style: 'cancel', onPress: ()=> setloadingWishlist(false)},
                {text: t("common.empty"), onPress: () => {
                    clearWishlist();
                    setloadingWishlist(false);
                }}
            ],
            {cancelable: false}
        );
    };
    
    return(
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <Header/>
            <ScrollView>
                <Title title={t('wishlist.wishlistTitle')} />
                <View style={{flex: 1, padding: 15, marginBottom: 10}}>
                    { wishlist.length === 0? (
                        <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 150}}>
                            <View style={{width: 100, height: 100, borderRadius: 50, backgroundColor: 'white', elevation: 2, justifyContent: 'center', alignItems: 'center'}}>
                                <FontAwesome5 name="heartbeat" size={48} color={colors.primary}/>
                            </View>
                            <Text style={{marginTop: 20, fontSize: 18, color: '#999', fontWeight: '400'}}>{t('wishlist.emptyWishlist')}</Text>
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
                        <TouchableOpacity onPress={handleClearWishlist}>
                            {loadingWishlist ? (
                                <ActivityIndicator size="small" color="red" />
                            ): (
                                <Text style={{color: 'red', fontWeight: '400', textDecorationLine: 'underline', textAlign: 'center'}}>{t('wishlist.clearWishlist')}</Text>
                            )}
                        </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}