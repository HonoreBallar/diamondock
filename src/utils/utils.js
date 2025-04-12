import AsyncStorage from '@react-native-async-storage/async-storage';
//formater le montant fr
export const formatAmount = (amount) => {
    if (amount === null) return null;
    return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' });
};

export const setItemInStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'élément :', error);
    throw error;
  }
};

export const getItemFromStorage = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value != null) {
        return JSON.parse(value);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'élément :', error);
      throw error;
    }
}

export const wait = (ms)=>{
  return new Promise(resolve => setTimeout(resolve, ms));
}