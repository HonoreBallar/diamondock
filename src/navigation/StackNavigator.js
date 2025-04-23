import { CardStyleInterpolators, createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import PaymentScreen from '../screens/PaymentScreen';
import DetailProductScreen from '../screens/DetailProductScreen';
import OrderScreen from '../screens/OrderScreen';
import DrawerScreen from '../screens/DrawerScreen';
import DigitalMallScreen from '../screens/DigitalMallScreen';
import SocialMediaManager from '../screens/SocialMediaManagerScreen';
import DiamondAresScreen from '../screens/DiamondAresScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import SplashScreen from '../screens/SplashScreen';
import { useRootContext } from '../context/RootContext';

const Stack = createStackNavigator();

const StackNavigator = ({navigation}) => {

  const {loading} = useRootContext();

  if(loading){
    return <SplashScreen />
  }
  
  return (
    <Stack.Navigator 
    // initialRouteName='OrderScreen'
    >
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DetailProductScreen" component={DetailProductScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OrderScreen" component={OrderScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DigitalMallScreen" component={DigitalMallScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SocialMediaManager" component={SocialMediaManager} options={{ headerShown: false }} />
      <Stack.Screen name="DiamondAresScreen" component={DiamondAresScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CategoryDetailScreen" component={CategoryDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DrawerScreen" component={DrawerScreen} options={{ 
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }} />
    </Stack.Navigator>
  );
};

export default StackNavigator;