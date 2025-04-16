import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import PaymentScreen from '../screens/PaymentScreen';
import DetailProductScreen from '../screens/DetailProductScreen';
import OrderScreen from '../screens/OrderScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator 
    initialRouteName='OrderScreen'
    >
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DetailProductScreen" component={DetailProductScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OrderScreen" component={OrderScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default StackNavigator;