import React from 'react';
import {StyleSheet, View,Text, Image} from 'react-native';

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SelectDropdown from "react-native-select-dropdown";
import colors from '../utils/colors';

const SingleDropdownSelect = ({items,onSelectHandler, iconSelect="globe",...props}) => {

    const renderButton = (selectedItem, isOpen) => {
        return (
            <View style={styles.dropdownButtonStyle}>
                {selectedItem && <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />}
                <Text style={styles.dropdownButtonTxtStyle}>
                    {(selectedItem && selectedItem.name) || (props?.placeholderText || 'Veuillez selectionner')}
                </Text>
                <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
            </View>
        );
    }

    const renderItem = (item, index, isSelected) => {
      return (
            <View
                style={{
                    ...styles.dropdownItemStyle,
                    ...(isSelected && {backgroundColor: '#D2D9DF'}),
                }}>
                {item?.logo && <Image source={{uri: item?.logo}} style={{height: 20, width: 20, mmarginRight: 10}} />}
                {item?.icon && <Icon name={item.icon} style={styles.dropdownItemIconStyle} />}
                <Text style={styles.dropdownItemTxtStyle}> {item.name}</Text>
            </View>
        );
    }
    return (
        <View style={{flexDirection: 'row', borderWidth: 1, borderColor: '#ccc', borderRadius: 15, alignContent: 'center', marginBottom: 10}}>
             <FontAwesome5 name={iconSelect} size={20} color='#333' style={{marginLeft: 10, marginTop: 9}}/>
            <SelectDropdown
                data={items}
                onSelect={(selectedItem, index) => onSelectHandler(selectedItem,index)}
                renderButton={(selectedItem, isOpen) => renderButton(selectedItem,isOpen)}
                renderItem={(item, index, isSelected) => renderItem(item, index, isSelected)}
                showsVerticalScrollIndicator={false}
                search
                searchPlaceHolder='Rechercher un pays...'
                dropdownStyle={styles.dropdownMenuStyle}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    dropdownButtonStyle: {
        flex: 1,
        // width: '90%',
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // paddingHorizontal: 5,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 17,
        fontWeight: '400',
        color: '#151E26',
        paddingHorizontal: 5,

    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        // marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        // width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});

export default SingleDropdownSelect;