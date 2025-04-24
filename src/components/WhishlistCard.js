import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { formatAmount } from '../utils/utils';

export default function WishlistCard({navigation, product}){
    const {removeFromWishlist} = useWishlist();
    const {addToCart} = useCart();
    const [loadingWishlist, setLoadingWishlist] = useState(false);
    const [loadingCart, setLoadingCart] = useState(false);
    const handleRemoveFromWishlist = (product)=>{
        setLoadingWishlist(true);
        Alert.alert(
            'Supprimer du favori',
            'Voulez-vous vraiment supprimer ce produit de vos favoris?',
            [
                {text: 'Annuler', style: 'cancel', onPress: ()=> setLoadingWishlist(false)},
                {text: 'Supprimer', onPress: () => {
                    removeFromWishlist(product)
                    setLoadingWishlist(false);
                }}
            ],
            {cancelable: false}
        )
    }
    const handleAddToCart = async (product)=>{
        setLoadingCart(true);
        setTimeout(async () => {
            await addToCart(product);
            setLoadingCart(false);
        }, 50);
    }
    return (
        <View style={{flexDirection: 'row', height: 120, backgroundColor: '#f9f9f9', borderRadius: 10, padding: 10, marginBottom: 10, elevation: 1}}>
            <TouchableOpacity onPress={()=>navigation.navigate('DetailProductScreen', {product})}>
                <Image source={{uri: product?.main_image}} style={{height: 100, width: 100, marginRight: 15, borderRadius: 5}} />
            </TouchableOpacity>
            <View>
                <TouchableOpacity onPress={()=>navigation.navigate('DetailProductScreen', {product})}>
                    <Text style={{fontSize: 17, fontWeight: 'bold', marginBottom: 5, width: '55%', color: '#03045e'}} numberOfLines={1}>{product?.name || 'nom produit'}</Text>
                </TouchableOpacity>
                <Text style={{fontSize: 12, fontWeight: 'bold', marginBottom: 5, color: '#555555', width: "80%"}} numberOfLines={1}>Categorie : {product?.category || 'category'} </Text>
                <Text style={{fontSize: 15, color: '#03045e', fontWeight: 'bold'}}>Prix: {formatAmount(product?.price || 0)}</Text>
                <View style={{flexDirection: 'row', justifyContent:'space-between', width: '80%', marginTop: 3, }}>
                    <TouchableOpacity onPress={()=>handleRemoveFromWishlist(product.token)} style={{marginTop: 10}}>
                        {loadingWishlist ? (
                            <ActivityIndicator size={22} color="red" />
                        ):(
                            <Text style={{color: 'red', fontSize: 12, fontWeight: '600'}}>Supprimer de mes favoris</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>handleAddToCart(product)} style={{backgroundColor: '#03045e', padding: 8, borderRadius: 18}}>
                        {loadingCart ?(
                            <ActivityIndicator size={15} color="white" />
                        ):(
                            <FontAwesome5 name="cart-plus" size={15} color="white" />
                        )
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}