import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useState } from 'react';
import colors from '../utils/colors';
import { formatAmount } from '../utils/utils';

export default function ProductCard({navigation, product}){
    const {addToCart} = useCart();
    const {addToWishlist, isProductInWishlist} = useWishlist();
    const [loading, setLoading] = useState(false);
    const [loadingWishlist, setLoadingWishlist] = useState(false);

    const handleAddToCart = async (product) => {
        setLoading(true);
        setTimeout(async() => {
            await addToCart(product);
            setLoading(false);
        }, 50);
    }

    const handleAddToWishlist = async (product) => {
        setLoadingWishlist(true);
        setTimeout(async () => {
            await addToWishlist(product);
            setLoadingWishlist(false);
        }, 50);
    }

    const handlePress = ()=>{
        navigation.navigate('DetailProductScreen',{product: product})
    }

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={{backgroundColor: '#f7f7f7', width: 150, height: 225, borderRadius: 10, marginRight: 10, padding: 8}}>
                <View style={{alignSelf: 'center',marginTop: 10, height: 120, width: 130, backgroundColor: 'white', borderRadius: 10}}>
                    <Image source={{uri: product?.main_image}} style={{height:100, width: 100, alignSelf: 'center', marginTop: 5 }}/>
                    <View style={{marginTop: -115, alignItems: 'flex-end'}}>
                        <TouchableOpacity onPress={()=>handleAddToWishlist(product)} style={{backgroundColor: '#fff', borderRadius: 15, width:30, height:30, justifyContent: 'center', alignItems: 'center'}}>
                            {loadingWishlist ? (
                                <ActivityIndicator size="small" color={colors.onPrimary} />
                            ) : (
                                isProductInWishlist(product.token) ? (
                                    <FontAwesome5 name="heartbeat" size={15} color="red" />
                                ):(
                                    <FontAwesome5 name="heart" size={15} color="red" />
                                )

                            )}
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{margin: 10}}>
                    <TouchableOpacity onPress={()=>navigation.navigate('DetailProductScreen',{product})}><Text style={{fontSize: 15, fontWeight: '500', color: colors.primary, marginTop: 1}} numberOfLines={1}>{product?.name || 'nom produit'}</Text></TouchableOpacity>
                    <Text style={{fontSize: 15, color: colors.primary, marginTop: 1, fontWeight: '500'}}>{ formatAmount(product?.price || 0)}</Text>
                    <View style={{marginTop: 2, alignItems: 'center'}}>
                        <TouchableOpacity disabled={loading} onPress={()=>handleAddToCart(product)} style={{backgroundColor: '#f29f03', borderRadius: 5, width:119, height:30, justifyContent: 'center', alignItems: 'center'}}>
                            {loading ? (
                                <ActivityIndicator size="small" color={colors.primary} />
                            ):(
                                <View style={{flexDirection: 'row'}}>
                                    <FontAwesome5 name="cart-plus" size={15} color="#000" />
                                    <Text style={{marginLeft: 5}}>Ajouter</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}