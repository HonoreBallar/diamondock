import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';



//formater le montant fr
export const formatAmount = (amount) => {
    if (amount === null) return null;
    return amount.toLocaleString('fr-FR');
};

export const setItemInStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving item in storage :', error);
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
      console.error('Error getting item from storage :', error);
      throw error;
    }
}

export const wait = (ms)=>{
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const ratio = (width, height) => {
  if (width === 0 || height === 0) return 0;
  return (width / height).toFixed(1);
}

export const formatDateToEnglish = (date) => {

    const [day, month, year] = date.split('/');

    return `${year}-${month}-${day}`;
};

export const renderStars = (note) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (note >= i) {
            stars.push(<FontAwesome5 key={i} name="star" size={17} color="#fec727" />);
        } else if (note >= i - 0.5) {
            stars.push(<FontAwesome5 key={i} name="star-half-alt" size={17} color="#fec727" />);
        } else {
            stars.push(<FontAwesome5 key={i} name="star" size={17} color="#ccc" />);
        }
    }
    return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {stars}
        </View>
    );
};


export const  getIdFromCode = (codeParam, data)=> {
  for (let i = 0; i < data.length; i++) {
    if (data[i].code == codeParam) {
      return data[i].id;
    }
  }
  return null; // Return null if no matching code is found
}
