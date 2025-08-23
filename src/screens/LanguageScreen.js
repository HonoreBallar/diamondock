import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { setItemInStorage } from '../utils/utils';
// import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRootContext } from '../context/RootContext';
import { useTranslation } from '../context/LocalizationContext';
import HeaderSimple from '../components/HeaderSimple';

const LANGUAGE_KEY = '@app_language';
const CURRENCY_KEY = '@app_currency';

const languages = [
  { label: 'Français', value: 'fr', icon: 'flag', image: require('../assets/fr.png') },
  { label: 'English', value: 'en', icon: 'flag' , image: require('../assets/en.png')},
];

export default function LanguageScreen({navigation}) {
    const {t} = useTranslation();
    // const navigation = useNavigation();
    const {appLanguage ,setAppLanguage, appCurrency, setAppCurrency, currencies} = useRootContext();
    const [selectedLanguage, setSelectedLanguage] = useState(appLanguage);
    const [selectedCurrency, setSelectedCurrency] = useState(appCurrency);
    const [isLoading, setIsLoading] = useState(false);

    const handleSavePreferences = async () => {
        if (!selectedLanguage || !selectedCurrency) {
            alert('Veuillez choisir une langue et une devise.');
            return;
        }
        setIsLoading(true);
        try {
            await setItemInStorage('@app_language', selectedLanguage);
            await setItemInStorage('@app_currency', selectedCurrency);

            setAppLanguage(selectedLanguage);
            setAppCurrency(selectedCurrency);
            
            navigation.replace('ChangeLangueScreen');
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
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
           
            <HeaderSimple title={t('profil.language')} />
            
            <View style={{ margin: 20, marginTop: 30 }}>
                <Text style={{ fontSize: 18, fontWeight: '400', marginBottom: 10 }}>{t('language.chooseLanguage')}</Text>
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

                <View style={{ marginTop: 20, marginBottom: 30 }}>
                    <Text style={{ fontSize: 18, fontWeight: '400', marginBottom: 10 }}>{t('language.chooseCurrency')}</Text>
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
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{t('language.save')}</Text>
                )}
                </TouchableOpacity>
            </View>
        </View>
    );
}