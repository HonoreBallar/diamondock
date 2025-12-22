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
import RateDetailProduct from '../screens/RateDetailProduct';
import WelcomeScreen from '../screens/WelcomeScreen';
import { useEffect, useState } from 'react';

const Stack = createStackNavigator();
const WELCOME_SEEN_KEY = '@welcome_seen';
import { getItemFromStorage } from '../utils/utils';
import { ActivityIndicator, Image, View } from 'react-native';
import LanguageScreen from '../screens/LanguageScreen';
import ChangeLangueScreen from '../screens/ChangeLangueScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import OrderStepThree from '../screens/OrderStepThree';
import AboutUsScreen from '../screens/AboutUsScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import ReviewsScreen from '../screens/ReviewsScreen';


const StackNavigator = () => {

  const [initialRoute, setInitialRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasSeenWelcome = await getItemFromStorage(WELCOME_SEEN_KEY);
        if (hasSeenWelcome) {
          setInitialRoute('Main');
        } else {
          setInitialRoute('Welcome');
        }
      } catch (e) {
          console.error("Failed to check if welcome screen was seen", e);
          // En cas d'erreur, afficher par défaut l'écran de bienvenue
          console.error("Error checking welcome screen status, defaulting to Welcome");
          setInitialRoute('Welcome');
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
              source={require('../assets/logo.png')}
              style={{
                  width: 200,
                  marginBottom: 5,
              }}
              resizeMode='contain'
          />
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  return (
    <Stack.Navigator 
    initialRouteName={initialRoute}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
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
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DetailSellerScreen" component={DetailSellerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RateDetailProduct" component={RateDetailProduct} options={{ headerShown: false }} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LanguageScreen" component={LanguageScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ReviewsScreen" component={ReviewsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChangeLangueScreen" component={ChangeLangueScreen} options={{ headerShown: false }} />

     
      <Stack.Screen name="OrderStepOne" component={OrderStepOne} options={{ headerShown: false }} />
      <Stack.Screen name="OrderStepTwo" component={OrderStepTwo} options={{ headerShown: false }} />
      <Stack.Screen name="OrderStepThree" component={OrderStepThree} options={{ headerShown: false }} />
      

      {/* Add more screens here */}
    </Stack.Navigator>
  );
};

export default StackNavigator;