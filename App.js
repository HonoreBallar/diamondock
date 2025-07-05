import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import RootNavigator from './src/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './src/context';
import Constants from 'expo-constants';


export default function App() {
  return (
    <AppProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{
          height: Constants.statusBarHeight,
          backgroundColor: 'white',
        }} />
        <NavigationContainer>
            <StatusBar
              style="dark"
            />
            <RootNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});