import React, { useState, useRef, useEffect } from 'react';
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
    ActivityIndicator,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../utils/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Fonction pour normaliser les caractères et retirer les accents
const normalizeString = (str) => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
};

const SearchableSelect = ({
    label,
    data = [],
    value,
    onChange,
    placeholder = 'Sélectionner...',
    isRequired = false,
    disabled = false,
    loading = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedItem, setSelectedItem] = useState(value || null);

    // Synchroniser selectedItem avec la prop value
    useEffect(() => {
        setSelectedItem(value || null);
    }, [value]);

    // Filtrer les données selon la recherche avec normalisation
    const filteredData = data.filter(item =>
        normalizeString(item.name).includes(normalizeString(searchText))
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
                style={[styles.selectButton, disabled && styles.selectButtonDisabled]}
                disabled={disabled}
            >
                <Text style={[styles.selectButtonText, disabled && styles.selectButtonTextDisabled]}>
                    {selectedItem ? selectedItem.name : placeholder}
                </Text>
                {loading ? (
                    <ActivityIndicator size={16} color={colors.primary} />
                ) : (
                    <FontAwesome5 name="chevron-down" size={14} color={disabled ? '#ccc' : colors.primary} />
                )}
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
                                keyExtractor={(item, index) => item.id || index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.listItem,
                                            selectedItem?.id === item.id && styles.listItemSelected,
                                        ]}
                                        onPress={() => handleSelectItem(item)}
                                    >
                                        <Text
                                            style={[
                                                styles.listItemText,
                                                selectedItem?.id === item.id && styles.listItemTextSelected,
                                            ]}
                                        >
                                            {item.name}
                                        </Text>
                                        {selectedItem?.id === item.id && (
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
    selectButtonDisabled: {
        backgroundColor: '#f5f5f5',
        opacity: 0.6,
    },
    selectButtonTextDisabled: {
        color: '#999',
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
        zIndex: 10000,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        height: SCREEN_HEIGHT * 0.8,
        maxHeight: SCREEN_HEIGHT * 1.0,
        paddingBottom: 50,
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
