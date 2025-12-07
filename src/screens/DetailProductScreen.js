import { ActivityIndicator, Button, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Swiper from "react-native-swiper";
import colors from "../utils/colors";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import FlottingCart from "../components/FlottingCart";
import { formatAmount, ratio, renderStars } from "../utils/utils";
import { ProgressBar } from "react-native-paper";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import HeaderLogo from "../components/HeaderLogo";
import RenderHTML from "react-native-render-html";
import { useTranslation } from "../context/LocalizationContext";
import { useApiClient } from "../context/ApiContext";
import SearchableSelect from "../components/SearchableSelect";
import { useRootContext } from "../context/RootContext";

export default function DetailProductScreen({navigation, route}){

    const {t} = useTranslation();
    const {countries, getMunicipalities, getRegions, regions, municipalities} = useRootContext();
    const {product} = route.params;
    const {addToCart} = useCart();
    const [quantity, setQuantity] = useState('1');
    const [mainProduct, setMainProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ratio, setRatio] = useState(0);
    const [photos, setPhotos] = useState([]);
    const [loadingWishlist, setLoadingWishlist] = useState(false);
    const [isAddedToCart, setIsAddedToCart] = useState(false);
    const {isProductInWishlist, addToWishlist} = useWishlist();
    const apiClient = useApiClient();

    const [selectedVariants, setSelectedVariants] = useState({});
    const [isDeliveryExpanded, setIsDeliveryExpanded] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedCommune, setSelectedCommune] = useState(null);
    const [loadingRegions, setLoadingRegions] = useState(false);
    const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);

    // Charger les régions quand le pays change
    useEffect(() => {
        if (selectedCountry) {
            setLoadingRegions(true);
            setSelectedRegion(null);
            setSelectedCommune(null);
            getRegions(selectedCountry.id || selectedCountry).then(() => {
                setLoadingRegions(false);
            }).catch(() => {
                setLoadingRegions(false);
            });
        }
    }, [selectedCountry]);

    // Charger les communes quand la région change
    useEffect(() => {
        if (selectedRegion && selectedCountry) {
            setLoadingMunicipalities(true);
            setSelectedCommune(null);
            getMunicipalities(selectedRegion.id || selectedRegion).then(() => {
                setLoadingMunicipalities(false);
            }).catch(() => {
                setLoadingMunicipalities(false);
            });
        }
    }, [selectedRegion]);



    const handleSelectVariant = (groupName, item) => {
        setSelectedVariants(prev => ({
            ...prev,
            [groupName]: item
        }));
    };

    // LISTE DES VARIANTS CHOISIS
    const selectedVariantsList = Object.values(selectedVariants);

    // PRIX FINAL
    const finalPrice =
        selectedVariantsList.length === 0
        ? mainProduct.price
        : selectedVariantsList.reduce(
            (total, variant) => total + (variant.price || 0),
            0
    );

    // VÉRIFIER SI TOUS LES VARIANTS SONT SÉLECTIONNÉS
    const hasVariants = mainProduct?.variants && mainProduct.variants.length > 0;
    const allVariantsSelected = hasVariants ? mainProduct.variants.every(variantGroup => selectedVariants[variantGroup.name]) : true;
    const isAddButtonDisabled = isAddedToCart || (hasVariants && !allVariantsSelected) || mainProduct?.remaining_stock === 0;

    useEffect(()=>{
        async function loadProducts() {
            setLoading(true);
            try {
                const response = await apiClient.get('/product/' + product?.token);
                const datas = response?.data?.data ?? []
                if (!datas?.images || datas?.images.length === 0) {
                    let defaultImage = datas?.main_image;
                    setPhotos([{url: defaultImage}]);
                }else{
                    setPhotos(datas.images);
                }
                setMainProduct(datas);
                setRatio(datas?.remaining_stock/datas?.total_stock);
                setLoading(false);
            } catch (error) {
                console.error('Error :', error);
            }
            finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, [product?.token]);

    const addToCartHandler = async () => {
        setIsAddedToCart(true);
        setTimeout(async () => {
            await addToCart(mainProduct, parseInt(quantity), selectedVariants);
            setQuantity('1');
            setIsAddedToCart(false);
        },50);
    }
    const handleAddProductToWishlist = async () => {
        setLoadingWishlist(true);
        setTimeout(async () => {
            await addToWishlist(mainProduct);
            setLoadingWishlist(false);
        }, 50);
    }

    return(
        <View style={{flex: 1}}>
            {loading ? (
                <>
                    <HeaderLogo />
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size={50} color={colors.primary} />
                        <Text style={{marginTop: 10, fontSize: 16, color: colors.gray}}>{t('common.loading')}</Text>
                    </View>
                </>
            ) : (
                <>
                    <StatusBar translucent style="dark" />
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        // height: Platform.OS === 'android' ? 2 : 44,
                        backgroundColor: 'black',
                        zIndex: 1,
                    }} />
                    <ScrollView style={{flex: 1, marginBottom: 80}}>
                        <View>
                            <Swiper
                                style={{height: 350}}
                                showsButtons={false}
                                autoplay={true}
                                loop={false}
                                activeDotColor={colors.primary}
                                dotStyle={styles.dot}
                                activeDotStyle={styles.activeDot}
                            >
                                {photos.map((image, index) => (
                                    <View key={index} style={styles.slide}>
                                        <Image
                                            source={{uri: image.url}}
                                            style={styles.image}
                                            resizeMode="cover"
                                        />
                                    </View>
                                ))}
                            </Swiper>
                            <View style={{paddingTop: 20, position: 'absolute',paddingHorizontal: 15, justifyContent: 'space-between', width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableOpacity onPress={()=>navigation.goBack()}>
                                    <FontAwesome5 name="chevron-circle-left" size={25} color="#f29f03"/>
                                </TouchableOpacity>
                                <FlottingCart navigation={navigation}/>
                            </View>
                        </View>
                        <View style={{margin: 13}}>
                            <Text style={{fontSize: 17, marginBottom: 3, fontWeight: '500'}} numberOfLines={2}>{mainProduct?.name}</Text>
                            <Text style={{fontSize: 17, marginBottom: 8, color: '#ccc'}} numberOfLines={2}>{mainProduct?.title}</Text>
                            <View style={{flexDirection: 'row', }}>
                                <Text style={{fontWeight: 'bold', fontSize: 25, marginBottom: 8}}>{formatAmount(finalPrice || 0)} {mainProduct?.currency || 'F CFA' } </Text>
                                { mainProduct?.reduction_rate != null && (
                                    <Text style={{fontSize: 20, color: colors.primary, marginTop: 3, textDecorationLine: 'line-through', marginLeft: 5}}>{formatAmount(mainProduct?.base_price || 0)} {mainProduct?.currency}</Text>
                                ) }  
                            </View>
                            <View style={{backgroundColor: '#03045e', padding: 4, marginBottom: 10, borderRadius: 5, alignSelf: 'flex-start'}}>
                                <Text style={{fontWeight: '600', fontSize: 14, color: '#fff'}}>{mainProduct?.category || 'Non disponible'}</Text>
                            </View>
                            
                            {ratio === 0 ? (
                                <Text style={{color: 'red', fontWeight: '400', fontSize: 16, marginBottom: 5}}>{t('common.productOutOfStock')}</Text>
                            ) :(
                                <View style={{marginBottom: 10}}>
                                    <Text style={{fontWeight: '300', fontSize: 16, marginBottom: 5}}>{mainProduct?.remaining_stock || 0} {t('common.itemsLeft')}</Text>
                                    <ProgressBar progress={ratio} color={colors.primary} />
                                </View>
                            )}
                            {/* VARIANTS */}
                            <View style={{marginBottom: 10}}>
                                {mainProduct?.variants?.map((variantGroup, index) => (
                                <View key={index} style={{ marginTop: 10 }}>

                                    <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 10 }}>
                                    {variantGroup.name} :
                                    </Text>

                                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                    {variantGroup.items.map((item) => {
                                        
                                        const isSelected =
                                        selectedVariants[variantGroup.name]?.token === item.token;

                                        return (
                                        <TouchableOpacity
                                            key={item.token}
                                            onPress={() => handleSelectVariant(variantGroup.name, item)}
                                            style={{
                                            paddingHorizontal: 10,
                                            paddingVertical: 6,
                                            backgroundColor: isSelected ? "#ffa100" : "#ddd",
                                            marginRight: 10,
                                            marginBottom: 10,
                                            borderRadius: 6,
                                            }}
                                        >
                                            <Text
                                            style={{
                                                fontWeight: "600",
                                                color: isSelected ? "white" : "black",
                                            }}
                                            >
                                            {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                        );
                                    })}
                                    </View>

                                </View>
                                ))}
                            </View>
                            
                            <Text style={{fontWeight: '600', fontSize: 16, marginBottom: 9}}>{t('common.description')}</Text>
                            <RenderHTML source={{html: mainProduct?.description || ''}} contentWidth={300} baseStyle={{fontSize: 14, lineHeight: 22, marginBottom: 9}} />
                            
                            {/* DELIVERY CARD */}
                            <View style={{borderWidth: 0.8, borderColor: '#ccc', borderRadius: 10, marginBottom: 15, marginTop: 15, overflow: 'hidden'}}>
                                <TouchableOpacity 
                                    onPress={() => setIsDeliveryExpanded(!isDeliveryExpanded)} 
                                    style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15}}
                                >
                                    <Text style={{color: colors.primary, fontSize: 15, fontWeight: '600'}}>📦 {t('common.delivery') || 'Livraison'}</Text>
                                    <FontAwesome5 name={isDeliveryExpanded ? 'chevron-up' : 'chevron-down'} size={15} color="black" />
                                </TouchableOpacity>
                                {isDeliveryExpanded && (
                                    <View style={{borderTopWidth: 0.8, borderTopColor: '#ccc', padding: 16, backgroundColor: '#f9f9f9'}}>

                                        {/* SELECTS */}
                                        <View style={{marginTop: 2}}>
                                            <SearchableSelect
                                                label="Pays"
                                                data={countries}
                                                value={selectedCountry}
                                                onChange={setSelectedCountry}
                                                placeholder="Sélectionner un pays"
                                                isRequired
                                            />
                                            <SearchableSelect
                                                label="Région"
                                                data={regions}
                                                value={selectedRegion}
                                                onChange={setSelectedRegion}
                                                placeholder="Sélectionner une région"
                                                isRequired
                                                disabled={!selectedCountry || loadingRegions}
                                                loading={loadingRegions}
                                            />
                                            <SearchableSelect
                                                label="Commune"
                                                data={municipalities}
                                                value={selectedCommune}
                                                onChange={setSelectedCommune}
                                                placeholder="Sélectionner une commune"
                                                isRequired
                                                disabled={!selectedRegion || loadingMunicipalities}
                                                loading={loadingMunicipalities}
                                            />
                                        </View>
                                    </View>
                                )}
                            </View>
                            
                            <Text style={{fontWeight: '500', fontSize: 20, marginBottom: 5}}>{t('common.reviews')}</Text>
                            <View style={{borderTopWidth: 0.3, borderTopColor: '#999', padding: 8, marginBottom: 10}}>
                                <TouchableOpacity onPress={()=>navigation.navigate('RateDetailProduct',{product: product})} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        {renderStars(mainProduct?.note || 0)}
                                        <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 6}}>
                                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{mainProduct?.note || 0} / 5</Text>
                                            <Text style={{fontSize: 15, color: colors.gray, fontWeight: '400', marginLeft: 5}}>({mainProduct?.comment ? mainProduct?.comment : "Pas d'avis"})</Text>
                                        </View>
                                    </View>
                                    <FontAwesome5 name="chevron-right" size={20} color="#000"/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{position: 'absolute', bottom: 0, left: 0, borderWidth: 0.2, height: 85 ,width: '100%', backgroundColor: '#f9f9f9', padding: 15, elevation: 8}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <TouchableOpacity onPress={()=>handleAddProductToWishlist(mainProduct)}>
                                {loadingWishlist ? (
                                    <ActivityIndicator size={22} color="black" />
                                ): (
                                    isProductInWishlist(mainProduct.token) ? (
                                        <Text style={{fontSize: 24}}>❤️</Text>
                                    ):(
                                        <FontAwesome5 name="heart" size={24} color="red" />
                                    )
                                )}
                            </TouchableOpacity>
                            <View style={{flexDirection: 'row', justifyContent: 'space-around', width: "50%", borderRadius: 5, padding: 5}}>
                                <TouchableOpacity 
                                onPress={() => setQuantity((prev) => (parseInt(prev) > 1 ? `${parseInt(prev) - 1}` : prev))}
                                style={{borderWidth: 0.5, width: '25%', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center'}}>
                                    <FontAwesome5 name="minus" size={12} color="#000"/>
                                </TouchableOpacity>
                                <TextInput value={quantity} onChangeText={(text)=>setQuantity(text)} keyboardType="numeric" style={{borderWidth: 0.5, width:'50%', fontSize: 19, borderColor: '#ddd', fontWeight: '600'}} textAlign="center"/>
                                <TouchableOpacity
                                onPress={() => setQuantity((prev) => `${parseInt(prev) + 1}`)}
                                style={{borderWidth: 0.5, width: '25%', borderTopRightRadius: 5, borderBottomRightRadius: 5, borderColor: '#ddd',justifyContent: 'center', alignItems: 'center'}}>
                                    <FontAwesome5 name="plus" size={12} color="#000"/>
                                </TouchableOpacity>
                            </View>
                            { mainProduct?.remaining_stock === 0 ? (
                                <TouchableOpacity disabled={true} style={{backgroundColor: colors.gray, padding: 9, borderRadius: 8, alignItems: 'center'}}>
                                    <Text style={{color: 'white'}}> {t('common.outOfStock')}</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity disabled={isAddButtonDisabled} onPress={addToCartHandler} style={{flexDirection: 'row', backgroundColor: isAddButtonDisabled ? colors.gray : "#000", padding: 9, borderRadius: 8, alignItems: 'center'}}>
                                    { isAddedToCart ? <ActivityIndicator size="small" color="white" /> :<FontAwesome5 name="cart-plus" size={20} color="white"/>}
                                    <Text style={{color: 'white', marginLeft: 8}}>{t('common.add')}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    slide: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    }
});