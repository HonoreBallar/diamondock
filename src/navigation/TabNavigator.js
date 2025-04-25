import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

const Tab = createBottomTabNavigator();

const TabNavigator = () => {

  const { cart } = useCart();

  const {auth} = useRootContext();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
            if (route.name === 'Home') {
                iconName = 'home';
            } 
            else if (route.name === 'Favoris') {
                iconName = 'heart';
            } else if (route.name === 'Panier') {
                iconName = 'shopping-cart';
            } else if (route.name === 'Categories') {
                iconName = 'list-alt';
            } else if (route.name === 'Mon compte') {
                iconName = 'user-tie';
            }
            else if (route.name === 'Commandes') {
                iconName = 'clipboard-list';
            }
          return <FontAwesome5 name={iconName} size={focused ? 24 : 20 } color={focused? colors.primary: color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#666',
        tabBarStyle: { backgroundColor: '#f8f9fa', height: 55},
        tabBarBadgeStyle:{ backgroundColor: "orange", color: "black"}
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Categories" component={CategoryScreen} />
      <Tab.Screen name="Panier" component={CartScreen} options={{tabBarBadge: cart.length > 0 ? cart.length : null}}/>
      <Tab.Screen name="Favoris" component={WishlistScreen} />
      {auth.isLoggedIn ? 
        (<Tab.Screen name="Mon compte" component={ProfilScreen} />)
      :
        (<Tab.Screen name="Commandes" component={OrderScreen} />)
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