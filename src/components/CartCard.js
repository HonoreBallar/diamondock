import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { formatAmount } from '../utils/utils';
import colors from '../utils/colors';

export default function CartCard({navigation, product}){
    const {removeFromCart,incrementQuantity, decrementQuantity} = useCart();
    const [loading, setLoading] = useState(false);
    const [loadingMinus, setLoadingMinus] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false);

    const handleRemoveFromCart = (productId) => {
        setLoading(true);
        Alert.alert(
            'Supprimer du panier',
            'Voulez-vous vraiment supprimer ce produit du panier?',
            [
                {text: 'Annuler', style: 'cancel', onPress: () => setLoading(false)},
                {text: 'Supprimer', onPress: async () => {
                    await removeFromCart(productId);
                    setLoading(false);
                }}
            ],
            {cancelable: false}
        );
    }

    const handleIncrement = (productId) => {
        setLoadingMinus(true);
        setTimeout(async () => {
            await incrementQuantity(productId);
            setLoadingMinus(false);
        }, 400);
    }

    const handleDecrement = (productId) => {
        setLoadingButton(true);
        setTimeout(async () => {
            await decrementQuantity(productId);
            setLoadingButton(false);
        }, 400);
    }

    return (
        <View style={{flexDirection: 'row', height: 120, borderRadius: 10, padding: 10, marginBottom: 10}}>
            <TouchableOpacity onPress={()=>navigation.navigate('DetailProductScreen',{product: product})} style={{backgroundColor: 'white', width: 130, height: 110, borderRadius: 8, borderWidth: 0.1, justifyContent: 'center',alignItems: 'center'}}>
                <Image source={{uri: product?.image}} style={{height: 100, width: 120, borderRadius: 8}} resizeMode='cover'/>
            </TouchableOpacity>
            <View style={{width: '70%', marginLeft: 8}}>
                <TouchableOpacity onPress={()=>navigation.navigate('DetailProductScreen',{product: product})} >
                    <Text style={{fontSize: 15, fontWeight: 'bold', marginBottom: 2, color: colors.primary, width: '70%'}} numberOfLines={1}>{product?.name || 'nom produit'}</Text>
                </TouchableOpacity>
                <Text style={{fontSize: 12, color: '#555555', marginTop: 5, width: '70%'}} numberOfLines={1}>Categorie: {product?.category || 'categorie'}</Text>
                <Text style={{fontSize: 14, color: '#000', fontWeight: 'bold'}}>Prix: {formatAmount(product?.price || 0)}</Text>
                <View style={{flexDirection: 'row', justifyContent:'space-between', width: '80%', marginTop: 10, }}>
                    <View style={{flexDirection: 'row', width: '60%', justifyContent: 'space-around'}}>
                        <TouchableOpacity onPress={()=>handleDecrement(product.token)} style={{}}>
                            {loadingButton ? (
                                <ActivityIndicator size={22} color="black" />
                            ):(
                                <FontAwesome5 name="minus-circle" size={25} color={colors.primary} />
                            )}
                        </TouchableOpacity>
                        <Text style={{fontWeight: 'bold', fontSize: 20, marginTop: 1}}>{product?.quantity}</Text>
                        <TouchableOpacity onPress={()=>handleIncrement(product.token)} style={{}}>
                            {loadingMinus ? (
                                <ActivityIndicator size={22} color="black" />
                            ):(
                                <FontAwesome5 name="plus-circle" size={25} color={colors.primary} />
                            )}
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={()=>handleRemoveFromCart(product.token)} style={{backgroundColor: 'red', borderRadius: 15, width:30, height:30, justifyContent: 'center', alignItems: 'center'}}>
                        {loading ?(
                            <ActivityIndicator size="small" color='white' />
                        ):(
                            <FontAwesome5 name="trash" size={15} color="white" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}