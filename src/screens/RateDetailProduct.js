import { ActivityIndicator, FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import FlottingCart from "../components/FlottingCart";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useState } from "react";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { getRequest } from "../utils/api";
import colors from "../utils/colors";
import { renderStars } from "../utils/utils";
import { useTranslation } from "../context/LocalizationContext";

export default function RateDetailProduct({navigation, route}){
    const {t} = useTranslation();
    const {product} = route.params;
    const [rate, setRate] = useState([]);
    const [loading, setLoading] = useState(false);

    useState(()=>{
       const fetchRates = async () => {
            try{
                setLoading(true);
                const response = await getRequest(`/product/comment/${product?.token}`);
                const data = await response?.data?.comments;
                setRate(data);
            }catch(error){
                showMessage({
                    message: "Erreur : " + error?.message,
                    type: "danger",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchRates();

    },[product.token])

    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <FlatList
                data={rate}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10,marginBottom: 10, marginHorizontal: 10}}>
                        <View style={{flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{marginRight: 10}}>
                                <FontAwesome5 name="arrow-left" size={20} color="#000" />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' , width: '60%'}} numberOfLines={1}>
                                Evaluation du produit 
                            </Text>
                        </View>
                        <FlottingCart navigation={navigation} />
                    </View>
                }
                ListEmptyComponent={
                    loading ? (
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40}}>
                            <ActivityIndicator size={50} color={colors.primary} />
                            <Text style={{marginTop: 10, fontSize: 16, color: colors.gray}}>{t('common.loading')}</Text>
                        </View>
                    ) : (
                        <View style={{flex: 1, justifyContent: 'center', marginTop: 30}}>
                            <Text style={{textAlign: 'center'}}>Aucun commentaire disponible pour l'instant </Text>
                        </View>
                    )
                }
                contentContainerStyle={{padding: 10}}
                renderItem={({ item }) => (
                    <View style={{borderWidth: 0.3, backgroundColor: '#f9f9f9', elevation:2, padding: 10, borderRadius: 8, marginBottom: 15, marginTop: 5}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                            <Text style={{fontSize: 17, fontWeight: '500'}}>{item?.customer || "Nom de l'utilisateur"}</Text>
                            {renderStars(item?.note || 0)}
                        </View>
                        <Text style={{fontSize: 16, lineHeight: 15}}>{item.comment || "Aucun commentaire."}</Text>
                        {/* <Text style={{fontSize: 15, color: colors.gray, fontWeight: '400'}}>{item.date || "12/15/2025"}</Text> */}
                    </View>
                )}
                initialNumToRender={1}
                maxToRenderPerBatch={2}
            />
        </View>
    )
}