import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import HomeScreen from '../screens/HomeScreen';
import WishlistScreen from '../screens/WishlistScreen';
import CartScreen from '../screens/CartScreen';
import CategoryScreen from '../screens/CategoryScreen';
import { StyleSheet, Text, View } from 'react-native';
import OrderScreen from '../screens/OrderScreen';
import { useCart } from '../context/CartContext';
import ProfilScreen from '../screens/ProfilScreen';
import colors from '../utils/colors';
import { useRootContext } from '../context/RootContext';
import { useWishlist } from '../context/WishlistContext';
import { useTranslation } from '../context/LocalizationContext';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {

  const insets = useSafeAreaInsets();

  const { t } = useTranslation();

  const { cart } = useCart();

  const {wishlist} = useWishlist();

  const {auth} = useRootContext();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
            if (route.name === t('tabs.tab_home')) {
                iconName = 'home';
            } 
            else if (route.name === t('tabs.tab_favorites')) {
                iconName = 'heart';
            } else if (route.name === t('tabs.tab_cart')) {
                iconName = 'shopping-cart';
            } else if (route.name === t('tabs.tab_categories')) {
                iconName = 'list-alt';
            } else if (route.name === t('tabs.tab_profile')) {
                iconName = 'user-tie';
            }
            else if (route.name === t('tabs.tab_orders')) {
                iconName = 'clipboard-list';
            }
          return <FontAwesome5 name={iconName} size={focused ? 24 : 20 } color={focused? colors.primary: color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#666',
        tabBarStyle: { 
          backgroundColor: '#f8f9fa', 
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarBadgeStyle:{ backgroundColor: "#03045e", color: "white"}
      })}
    >
      <Tab.Screen name={t('tabs.tab_home')} component={HomeScreen} />
      <Tab.Screen name={t('tabs.tab_categories')} component={CategoryScreen} />
      <Tab.Screen name={t('tabs.tab_cart')} component={CartScreen} options={{tabBarBadge: cart.length > 0 ? cart.length : null}}/>
      <Tab.Screen name={t('tabs.tab_favorites')} component={WishlistScreen} options={{tabBarBadge: wishlist.length > 0 ? wishlist.length : null}}/>
      {auth.isLoggedIn ? 
        (<Tab.Screen name={t('tabs.tab_profile')} component={ProfilScreen} />)
      :
        (<Tab.Screen name={t('tabs.tab_orders')} component={OrderScreen} />)
      }
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
    tabItemActive: {
        backgroundColor: '#03045e',
        padding: 5,
        borderWidth: 2,
        borderRadius: 10,
        justifyContent: 'center',
    },
    badge: {
      position: 'absolute',
      color: 'white',
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 2,
      textAlign: 'center',
      fontSize: 12,
    },  
});

export default TabNavigator;