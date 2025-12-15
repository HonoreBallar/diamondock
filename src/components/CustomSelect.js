import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    StyleSheet,
    Dimensions,
    FlatList
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CustomSelect({
    label,
    data = [],
    value,
    onChange,
    placeholder = 'Sélectionner une option',
    isRequired = false,
    disabled = false,
    loading = false,
    searchable = false,
    error = null,
    labelKey = 'name',  // Clé pour le texte affiché
    valueKey = 'id'     // Clé pour la valeur unique
}) {
    const [visible, setVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [dropdownTop, setDropdownTop] = useState(0);
    const buttonRef = useRef(null);

    const filteredData = searchable
        ? data.filter(item =>
            item[labelKey]?.toLowerCase().includes(searchText.toLowerCase())
        )
        : data;

    const displayValue = value?.[labelKey] || value;

    const handleSelect = (item) => {
        onChange(item);
        setVisible(false);
        setSearchText('');
    };

    const isItemSelected = (item) => {
        if (!value) return false;
        // Comparaison par valueKey
        if (item[valueKey] && value[valueKey]) {
            return item[valueKey] === value[valueKey];
        }
        // Sinon comparaison par displayValue
        return item[labelKey] === displayValue;
    };

    const toggleDropdown = () => {
        if (!disabled && !loading) {
            buttonRef.current?.measure((fx, fy, width, height, px, py) => {
                setDropdownTop(py + height);
                setVisible(!visible);
            });
        }
    };

    return (
        <View style={styles.container}>
            {label && (
                <Text style={styles.label}>
                    {label}
                    {isRequired && <Text style={styles.required}>*</Text>}
                </Text>
            )}
            
            <TouchableOpacity
                ref={buttonRef}
                style={[
                    styles.button,
                    visible && styles.buttonActive,
                    disabled && styles.buttonDisabled,
                    error && styles.buttonError
                ]}
                onPress={toggleDropdown}
                disabled={disabled || loading}
            >
                <Text
                    style={[
                        styles.buttonText,
                        !displayValue && styles.placeholderText,
                        disabled && styles.buttonTextDisabled
                    ]}
                    numberOfLines={1}
                >
                    {loading ? 'Chargement...' : displayValue || placeholder}
                </Text>
                <Text style={[styles.chevron, visible && styles.chevronUp]}>
                    ▼
                </Text>
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Modal
                visible={visible}
                transparent
                onRequestClose={() => setVisible(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setVisible(false)}
                    activeOpacity={1}
                >
                    <View
                        style={[
                            styles.dropdown,
                            { top: dropdownTop }
                        ]}
                    >
                        {searchable && (
                            <View style={styles.searchContainer}>
                                <Text style={styles.searchLabel}>Rechercher...</Text>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Tapez pour rechercher"
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>
                        )}

                        <FlatList
                            data={filteredData}
                            keyExtractor={(item, index) => item[valueKey]?.toString() || index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        isItemSelected(item) && styles.optionSelected
                                    ]}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            isItemSelected(item) && styles.optionTextSelected
                                        ]}
                                    >
                                        {item[labelKey]}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            scrollEnabled
                            nestedScrollEnabled
                            maxHeight={300}
                        />

                        {filteredData.length === 0 && (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>Aucune option disponible</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 8,
    },
    required: {
        color: '#ef4444',
        fontSize: 16,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 15,
        backgroundColor: '#f9fafb',
    },
    buttonActive: {
        borderColor: '#2563eb',
        backgroundColor: '#f0f9ff',
    },
    buttonDisabled: {
        backgroundColor: '#f3f4f6',
        opacity: 0.6,
    },
    buttonError: {
        borderColor: '#ef4444',
    },
    buttonText: {
        flex: 1,
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '500',
    },
    placeholderText: {
        color: '#9ca3af',
        fontWeight: '400',
    },
    buttonTextDisabled: {
        color: '#9ca3af',
    },
    chevron: {
        fontSize: 12,
        color: '#6b7280',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    chevronUp: {
        transform: [{ rotate: '180deg' }],
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dropdown: {
        position: 'absolute',
        left: 0,
        right: 0,
        marginHorizontal: 15,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    searchContainer: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    searchLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 6,
        fontWeight: '500',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 14,
        color: '#1f2937',
    },
    option: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        borderRadius: 8,
    },
    optionSelected: {
        backgroundColor: '#f1f4f7ff',
    },
    optionText: {
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '500',
    },
    optionTextSelected: {
        color: '#ffa100',
        fontWeight: '600',
    },
    emptyContainer: {
        paddingVertical: 20,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#9ca3af',
    },
    errorText: {
        fontSize: 12,
        color: '#ef4444',
        marginTop: 4,
    },
});
