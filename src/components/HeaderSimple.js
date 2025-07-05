import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const HeaderSimple = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Flèche de retour à gauche */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome5 name="chevron-circle-left" size={22} color="#000"/>
      </TouchableOpacity>

      {/* Texte centré */}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = {
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    position: 'absolute', // Garde la flèche à gauche
    left: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
};

export default HeaderSimple;
