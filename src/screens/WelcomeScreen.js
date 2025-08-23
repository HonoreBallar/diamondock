import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { setItemInStorage } from '../utils/utils';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRootContext } from '../context/RootContext';

const LANGUAGE_KEY = '@app_language';
const CURRENCY_KEY = '@app_currency';
const WELCOME_SEEN_KEY = '@welcome_seen';

const languages = [
  { label: 'Français', value: 'fr', icon: 'flag', image: require('../assets/fr.png') },
  { label: 'English', value: 'en', icon: 'flag' , image: require('../assets/en.png')},
];

const WelcomeScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const { setAppLanguage, setAppCurrency, currencies } = useRootContext();

  const handleSavePreferences = async () => {
    if (!selectedLanguage || !selectedCurrency) {
      alert('Veuillez choisir une langue et une devise.');
      return;
    }
    setIsLoading(true);
    // console.log('Saving preferences:', selectedLanguage, selectedCurrency);
    // return;
    try {
        await setItemInStorage(LANGUAGE_KEY, selectedLanguage);
        await setItemInStorage(CURRENCY_KEY, selectedCurrency);
        await setItemInStorage(WELCOME_SEEN_KEY, 'true');
        setAppLanguage(selectedLanguage);
        setAppCurrency(selectedCurrency);
        navigation.replace('Main');
    } catch (error) {
        console.error('Error saving preferences :', error);
        alert('An error has occurred. Please try again..');
    } finally {
        setIsLoading(false);
    }
  };

  const SelectionButton = ({ label, value, isSelected, onPress, image }) => (
    <TouchableOpacity
      onPress={() => onPress(value)}
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isSelected ? '#ffa100' : '#F0F0F0',
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: 90,
        borderRadius: 10,
        marginBottom: 10,
        marginRight: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      }}
    >
      {image && (
        <Image
            source={image}
            style={{
            width: 24,
            height: 20,
            resizeMode: 'contain',
            marginRight: 10,
            borderRadius: 2,
            }}
        />
        )}
      <Text style={{ color: isSelected ? '#fff' : '#333', fontWeight: '600' }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' }}>
      <StatusBar style="dark" />
      <Image
        source={require('../assets/icon.png')}
        style={{
            width: 200,
            height: 200,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginBottom: 20,
        }}
        />

      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 10, color: '#333' }}>
        Bienvenue sur Diamondock !
      </Text>
      <Text style={{ fontSize: 16, color: '#666', marginBottom: 30 }}>
        Veuillez choisir votre langue et votre devise pour continuer.
      </Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>Langue</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around'}}>
          {languages.map((item) => (
            <SelectionButton
              key={item.value}
              label={item.label}
              value={item.value}
              image={item.image}
              isSelected={selectedLanguage === item.value}
              onPress={setSelectedLanguage}
            />
          ))}
        </View>
      </View>

      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>Devise</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
          {currencies.map((item) => (
            <SelectionButton
              key={item.id}
              label={item.code}
              value={item.code}
              isSelected={selectedCurrency === item.code}
              onPress={setSelectedCurrency}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSavePreferences}
        disabled={isLoading || !selectedLanguage || !selectedCurrency}
        style={{
          backgroundColor: isLoading || !selectedLanguage || !selectedCurrency ? '#ccc' : '#03045e',
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Continuer</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;
