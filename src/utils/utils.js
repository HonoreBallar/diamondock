import AsyncStorage from '@react-native-async-storage/async-storage';
//formater le montant fr
export const formatAmount = (amount) => {
    if (amount === null) return null;
    return amount.toLocaleString('fr-FR');
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

export const ratio = (width, height) => {
  if (width === 0 || height === 0) return 0;
  return Math.round(width / height);
}

export const formatDateToEnglish = (date) => {

    const [day, month, year] = date.split('/');

    return `${year}-${month}-${day}`;
};