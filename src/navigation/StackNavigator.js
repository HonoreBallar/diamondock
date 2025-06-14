import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import PaymentScreen from '../screens/PaymentScreen';
import DetailProductScreen from '../screens/DetailProductScreen';
import OrderScreen from '../screens/OrderScreen';
import DrawerScreen from '../screens/DrawerScreen';
import DigitalMallScreen from '../screens/DigitalMallScreen';
import SocialMediaManager from '../screens/SocialMediaManagerScreen';
import DiamondAresScreen from '../screens/DiamondAresScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import EditProfilScreen from '../screens/EditProfilScreen';
import AddressScreen from '../screens/AddressScreen';
import MethodPaymentScreen from '../screens/MethodPaymentScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DetailSellerScreen from '../screens/DetailSellerScreen';
import SearchScreen from '../screens/SearchScreen';
import OrderStepOne from '../screens/OrderStepOne';
import OrderStepTwo from '../screens/OrderStepTwo';

const Stack = createStackNavigator();

const StackNavigator = () => {
  
  return (
    <Stack.Navigator 
    initialRouteName='Main'
    >
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DetailProductScreen" component={DetailProductScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OrderScreen" component={OrderScreen} options={{ headerShown: false }} />
      
      <Stack.Screen name="DrawerScreen" component={DrawerScreen} options={{ 
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }} />
      <Stack.Screen name="DigitalMallScreen" component={DigitalMallScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SocialMediaManager" component={SocialMediaManager} options={{ headerShown: false }} />
      <Stack.Screen name="DiamondAresScreen" component={DiamondAresScreen} options={{ headerShown: false }} />
      
      <Stack.Screen name="CategoryDetailScreen" component={CategoryDetailScreen} options={{ headerShown: false }} />

      <Stack.Screen name="EditProfilScreen" component={EditProfilScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddressScreen" component={AddressScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MethodPaymentScreen" component={MethodPaymentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DetailSellerScreen" component={DetailSellerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
     
      <Stack.Screen name="OrderStepOne" component={OrderStepOne} options={{ headerShown: false }} />
      <Stack.Screen name="OrderStepTwo" component={OrderStepTwo} options={{ headerShown: false }} />
      

      {/* Add more screens here */}
    </Stack.Navigator>
  );
};

export default StackNavigator;