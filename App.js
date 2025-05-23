import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import RootNavigator from './src/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './src/context';


export default function App() {
  return (
    <AppProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
            <StatusBar
              // backgroundColor="white"
              // barStyle="light-content"
              style='auto'
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