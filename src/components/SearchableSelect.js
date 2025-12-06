import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    StyleSheet,
    FlatList,
    Dimensions,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../utils/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SearchableSelect = ({
    label,
    data = [],
    value,
    onChange,
    placeholder = 'Sélectionner...',
    isRequired = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedItem, setSelectedItem] = useState(value || null);

    // Filtrer les données selon la recherche
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleSelectItem = (item) => {
        setSelectedItem(item);
        onChange(item);
        setIsOpen(false);
        setSearchText('');
    };

    const handleClose = () => {
        setIsOpen(false);
        setSearchText('');
    };

    return (
        <View style={styles.container}>
            {label && (
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>{label}</Text>
                    {isRequired && <Text style={styles.required}>*</Text>}
                </View>
            )}

            {/* Button pour ouvrir le select */}
            <TouchableOpacity
                onPress={() => setIsOpen(true)}
                style={styles.selectButton}
            >
                <Text style={styles.selectButtonText}>
                    {selectedItem ? selectedItem.name : placeholder}
                </Text>
                <FontAwesome5 name="chevron-down" size={14} color={colors.primary} />
            </TouchableOpacity>

            {/* Modal avec le select dropdown */}
            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={handleClose}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.backdrop}
                        onPress={handleClose}
                        activeOpacity={1}
                    />

                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {/* Header */}
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{label || placeholder}</Text>
                                <TouchableOpacity onPress={handleClose}>
                                    <FontAwesome5 name="times" size={20} color="#000" />
                                </TouchableOpacity>
                            </View>

                            {/* Search Input */}
                            <View style={styles.searchContainer}>
                                <FontAwesome5
                                    name="search"
                                    size={16}
                                    color={colors.primary}
                                    style={styles.searchIcon}
                                />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Rechercher..."
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    placeholderTextColor="#999"
                                />
                            </View>

                            {/* List */}
                            <FlatList
                                data={filteredData}
                                keyExtractor={(item, index) => item.token || index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.listItem,
                                            selectedItem?.token === item.token && styles.listItemSelected,
                                        ]}
                                        onPress={() => handleSelectItem(item)}
                                    >
                                        <Text
                                            style={[
                                                styles.listItemText,
                                                selectedItem?.token === item.token && styles.listItemTextSelected,
                                            ]}
                                        >
                                            {item.name}
                                        </Text>
                                        {selectedItem?.token === item.token && (
                                            <FontAwesome5 name="check" size={16} color={colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <View style={styles.emptyContainer}>
                                        <Text style={styles.emptyText}>Aucun résultat trouvé</Text>
                                    </View>
                                }
                                scrollEnabled={true}
                            />

                            {/* Close Button */}
                            {/* <TouchableOpacity
                                style={styles.closeButton}
                                onPress={handleClose}
                            >
                                <Text style={styles.closeButtonText}>Fermer</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    labelContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
        marginRight: 3,
    },
    required: {
        color: 'red',
        fontSize: 14,
        fontWeight: '600',
    },
    selectButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    selectButtonText: {
        fontSize: 14,
        color: '#1f2937',
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
    },
    modalContainer: {
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: SCREEN_HEIGHT * 0.75,
        paddingBottom: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 14,
        color: '#1f2937',
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#f3f4f6',
    },
    listItemSelected: {
        backgroundColor: '#f0f9ff',
    },
    listItemText: {
        fontSize: 14,
        color: '#1f2937',
        flex: 1,
    },
    listItemTextSelected: {
        fontWeight: '600',
        color: colors.primary,
    },
    emptyContainer: {
        paddingHorizontal: 16,
        paddingVertical: 24,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#9ca3af',
        fontStyle: 'italic',
    },
    closeButton: {
        marginHorizontal: 16,
        marginTop: 12,
        paddingVertical: 12,
        backgroundColor: colors.primary,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
});

export default SearchableSelect;
