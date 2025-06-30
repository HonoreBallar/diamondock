import { ActivityIndicator, Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Swiper from "react-native-swiper";
import colors from "../utils/colors";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import FlottingCart from "../components/FlottingCart";
import { getRequest } from "../utils/api";
import { formatAmount, ratio } from "../utils/utils";
import { ProgressBar } from "react-native-paper";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import HeaderLogo from "../components/HeaderLogo";
import RenderHTML from "react-native-render-html";

export default function DetailProductScreen({navigation, route}){

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


    useEffect(()=>{
        async function loadProducts() {
            setLoading(true);
            try {
                const response = await getRequest('/product/'+product?.token);
                const datas = response.data ?? []
                if (!datas?.images || datas?.images.length === 0) {
                    let defaultImage = datas?.main_image;
                    setPhotos([{url: defaultImage}]);
                }else{
                    setPhotos(datas.images);
                }
                setMainProduct(datas);
                setRatio(datas?.remaining_stock,datas?.total_stock);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors du chargement des produits :', error);
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
            await addToCart(mainProduct, parseInt(quantity));
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
                        <Text style={{marginTop: 10, fontSize: 16, color: colors.gray}}>Chargement...</Text>
                    </View>
                </>
            ) : (
                <>
                    <StatusBar translucent backgroundColor="transparent" />
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
                            <View style={{paddingTop: 50, position: 'absolute',paddingHorizontal: 15, justifyContent: 'space-between', width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableOpacity onPress={()=>navigation.goBack()}>
                                    <FontAwesome5 name="arrow-left" size={20} color="white"/>
                                </TouchableOpacity>
                                <FlottingCart navigation={navigation}/>
                            </View>
                        </View>
                        <View style={{margin: 13}}>
                            <Text style={{fontSize: 17, marginBottom: 3}} numberOfLines={2}>{mainProduct?.name}</Text>
                            <Text style={{fontSize: 17, marginBottom: 8, color: '#ccc'}} numberOfLines={2}>{mainProduct?.title}</Text>
                            <Text style={{fontWeight: 'bold', fontSize: 25, marginBottom: 8}}>{formatAmount(mainProduct?.price || 0)} {mainProduct?.currency || 'F CFA' } </Text>
                            
                            <Text style={{fontWeight: '600', fontSize: 16, marginBottom: 9}}>Description</Text>
                            <RenderHTML source={{html: mainProduct?.description || ''}} contentWidth={300} baseStyle={{fontSize: 14, lineHeight: 22, marginBottom: 9}} />
                            {/* <Text style={{fontSize: 14, marginBottom: 8}}>
                                {mainProduct?.description || 'Aucune description disponible pour ce produit.'}
                            </Text> */}
                            {ratio === 0 ? (
                                <Text style={{color: 'red', fontWeight: '600', fontSize: 16, marginBottom: 5}}>Ce produit est actuellement en rupture de stock.</Text>
                            ) :(
                                <View style={{marginBottom: 10}}>
                                    <Text style={{fontWeight: '300', fontSize: 16, marginBottom: 5}}>{mainProduct?.remaining_stock || 0} article (s) resrtant(s)</Text>
                                    <ProgressBar progress={ratio} color={colors.primary} />
                                </View>
                            )}
                            {/* <Text style={{fontWeight: '600', fontSize: 25, marginBottom: 5}}>Livraison</Text> */}
                            {/* <View>
                                <View  style={{flexDirection: 'row', backgroundColor: '#f9f9f9', borderRadius: 8, padding: 5, alignItems: 'center', borderWidth: 0.5, borderColor: colors.primary, marginBottom: 10}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:6, width: '100%'}}>
                                        <Text style={{ fontWeight: '500', fontSize: 19}}>Standard</Text>
                                        <Text style={{backgroundColor: '#f5f8ff', padding: 5, borderRadius: 5, color: colors.primary}}>5-7 jours</Text>
                                        <Text style={{fontWeight: '700', fontSize: 18}}>1 500 F CFA</Text>
                                    </View>
                                </View>
                                <View  style={{flexDirection: 'row', backgroundColor: '#f9f9f9', borderRadius: 8, padding: 5, alignItems: 'center', borderWidth: 0.5, borderColor: colors.primary, marginBottom: 10}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:6, width: '100%'}}>
                                        <Text style={{ fontWeight: '500', fontSize: 19}}>Express</Text>
                                        <Text style={{backgroundColor: '#f5f8ff', padding: 5, borderRadius: 5, color: colors.primary}}>1-2 jours</Text>
                                        <Text style={{fontWeight: '700', fontSize: 18}}>8 00 F CFA</Text>
                                    </View>
                                </View>
                            </View> */}
                            <Text style={{fontWeight: '600', fontSize: 25, marginBottom: 5}}>Avis clients</Text>
                            <View style={{borderTopWidth: 0.3, borderTopColor: '#999', padding: 8, marginBottom: 10}}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{fontSize: 20, marginBottom: 3}}>⭐</Text>
                                        {/* <FontAwesome5 name="star" size={20} color="#fec727"/> */}
                                        <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 5}}>
                                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>4.8</Text>
                                            <Text style={{fontSize: 15, color: colors.gray, fontWeight: '400', marginLeft: 5}}>({mainProduct?.comment ? mainProduct?.comment : "Pas d'avis"})</Text>
                                        </View>
                                    </View>
                                    <FontAwesome5 name="chevron-right" size={20} color="#000"/>
                                </View>
                            </View>
                            {/* <View>
                                <View style={{borderWidth: 0.3, backgroundColor: '#f9f9f9', padding: 8, borderRadius: 8, marginBottom: 10}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                                        <Text style={{fontSize: 18, fontWeight: 'bold'}}>Nom de l'utilisateur</Text>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text>⭐⭐⭐⭐</Text>
                                            <FontAwesome5 name="star" size={12} color="#fec727" style={{marginTop: 2}}/>
                                        </View>
                                    </View>
                                    <Text style={{fontSize: 16, lineHeight: 22}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel odio id dui fermentum laoreet.</Text>
                                    <Text style={{fontSize: 15, color: colors.gray, fontWeight: '400'}}>12/15/2025</Text>
                                </View>
                                <View style={{borderWidth: 0.3, backgroundColor: '#f9f9f9', padding: 8, borderRadius: 8, marginBottom: 10}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                                        <Text style={{fontSize: 18, fontWeight: 'bold'}}>Nom de l'utilisateur</Text>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text>⭐⭐⭐⭐⭐</Text>
                                        </View>
                                    </View>
                                    <Text style={{fontSize: 16, lineHeight: 22}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel odio id dui fermentum laoreet.</Text>
                                    <Text style={{fontSize: 15, color: colors.gray, fontWeight: '400'}}>12/15/2025</Text>
                                </View>
                            </View> */}
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
                            <View style={{flexDirection: 'row', justifyContent: 'space-around', width: "40%", borderRadius: 5, padding: 5}}>
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
                                    <Text style={{color: 'white'}}> En Rupture de stock</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity disabled={isAddedToCart} onPress={addToCartHandler} style={{flexDirection: 'row', backgroundColor: "#000", padding: 9, borderRadius: 8, alignItems: 'center'}}>
                                    { isAddedToCart ? <ActivityIndicator size="small" color="white" /> :<FontAwesome5 name="cart-plus" size={20} color="white"/>}
                                    <Text style={{color: 'white', marginLeft: 5}}>Ajouter au panier</Text>
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