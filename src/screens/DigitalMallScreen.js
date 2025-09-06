import { 
    FlatList, 
    Image, 
    RefreshControl, 
    Text, 
    TouchableOpacity, 
    View, 
    ActivityIndicator 
} from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Title from "../components/Title";
import colors from "../utils/colors";
import { useState, useEffect } from "react";
import { wait } from "../utils/utils";
import { useSellers } from "../context/SellerContext";
import { useTranslation } from "../context/LocalizationContext";

const PAGE_SIZE = 10;

export default function DigitalMallScreen({ navigation }) {
    const { t } = useTranslation();
    const { sellers, fetchSellers } = useSellers();

    const [displayedSellers, setDisplayedSellers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);

    // Initial load
    useEffect(() => {
        setDisplayedSellers(sellers.slice(0, PAGE_SIZE));
    }, [sellers]);

    // Refresh function
    const onRefresh = async () => {
        setRefreshing(true);
        await wait(1000);
        await fetchSellers();
        setPage(1);
        setRefreshing(false);
    };

    // Load more sellers on scroll
    const loadMore = async () => {
        if (loadingMore) return;

        const nextPage = page + 1;
        const end = nextPage * PAGE_SIZE;

        if (sellers.length <= displayedSellers.length) return;

        setLoadingMore(true);
        await wait(1000); // simulate API latency
        setDisplayedSellers(sellers.slice(0, end));
        setPage(nextPage);
        setLoadingMore(false);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Header */}
            <View style={{
                padding: 15,
                backgroundColor: '#f9f9f9',
                borderBottomRightRadius: 25,
                borderBottomLeftRadius: 25,
                elevation: 1
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesome5 name="chevron-circle-left" size={28} color="#f29f03" style={{ marginTop: 15 }} />
                </TouchableOpacity>
                <Text style={{
                    fontSize: 25,
                    fontWeight: 'bold',
                    color: colors.primary,
                    marginTop: 15,
                    textAlign: 'center'
                }}>
                    Digital Mall
                </Text>
            </View>

            {/* Vendeurs */}
            <View style={{ marginHorizontal: 10, marginTop: 5, flex: 1 }}>
                <Title title={t('common.sellers')} />
                <FlatList
                    data={displayedSellers}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={{
                                margin: 10,
                                backgroundColor: '#f9f9f9',
                                borderRadius: 10,
                                padding: 10,
                                width: '45%'
                            }}
                            onPress={() => navigation.navigate('DetailSellerScreen', { seller: item })}
                        >
                            <Image
                                source={{ uri: item?.avatar }}
                                style={{ width: '100%', height: 150, borderRadius: 10 }}
                            />
                            <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                marginTop: 8
                            }}>
                                {item?.name}
                            </Text>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '300',
                                textAlign: 'center',
                                color: '#555'
                            }}>
                                {t('common.products')} {item?.nb_products ?? '0'}
                            </Text>
                        </TouchableOpacity>
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.primary]}
                            progressBackgroundColor={'#f9f9f9'}
                        />
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={
                        loadingMore ? (
                            <View style={{ paddingVertical: 20 }}>
                                <ActivityIndicator size="small" color={colors.primary} />
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={() => (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <Text style={{ textAlign: 'center' }}>{t('common.noSellers')}</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}
