import React, { useRef, useMemo, useCallback, useState } from "react";
import {
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    StyleSheet
} from "react-native";
import Header from "../components/Header";
import { useCategories } from "../context/CategoryContext";
import { useTranslation } from "../context/LocalizationContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function CategoryScreen({ navigation }) {
    const { t } = useTranslation();
    const { categories, departments } = useCategories();

    const scrollViewRef = useRef(null);
    const depRefs = useRef({});
    const [activeDept, setActiveDept] = useState(null);
    const [expandedParents, setExpandedParents] = useState({});

    // Structurer les données : Département > (Catégories sans parent) + (Parents > Catégories)
    const structuredData = useMemo(() => {
        return departments
            .filter(dep => dep.state === "enabled")
            .map(dep => {
                // Toutes les catégories de ce département
                const depCategories = categories.filter(
                    cat => cat.department?.token === dep.token
                );

                // Si pas de catégories, retourner le département vide
                if (depCategories.length === 0) {
                    return {
                        token: dep.token,
                        name: dep.name,
                        description: dep.description,
                        standaloneCategories: [],
                        parentGroups: []
                    };
                }

                const standaloneCategories = [];
                const uniqueParents = new Map();

                depCategories.forEach(cat => {
                    if (!cat.parent || !cat.parent.token) {
                        // Catégorie sans parent ou parent invalide : à afficher directement
                        standaloneCategories.push(cat);
                    } else {
                        // Catégorie avec parent valide : à grouper
                        const parentKey = cat.parent.token;
                        const parentName = cat.parent.name || "";

                        if (!uniqueParents.has(parentKey)) {
                            uniqueParents.set(parentKey, {
                                key: parentKey,
                                name: parentName,
                                categories: []
                            });
                        }
                        uniqueParents.get(parentKey).categories.push(cat);
                    }
                });

                // Trier les catégories sans parent
                standaloneCategories.sort((a, b) => a.name.localeCompare(b.name));

                // Convertir les groupes parents en tableau et trier
                const parentGroups = Array.from(uniqueParents.values()).sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });

                return {
                    token: dep.token,
                    name: dep.name,
                    description: dep.description,
                    standaloneCategories,
                    parentGroups
                };
            });
    }, [categories, departments, t]);

    // Initialiser le premier département actif
    React.useEffect(() => {
        if (structuredData.length > 0 && !activeDept) {
            setActiveDept(structuredData[0].token);
        }
    }, [structuredData, activeDept]);

    // Navigation vers le département sélectionné
    const handleDeptPress = useCallback(depToken => {
        setActiveDept(depToken);
        const ref = depRefs.current[depToken];
        if (ref && scrollViewRef.current) {
            ref.measureLayout(
                scrollViewRef.current,
                (x, y) => {
                    scrollViewRef.current.scrollTo({ x: 0, y, animated: true });
                },
                () => { }
            );
        }
    }, []);

    const handleCategoryPress = useCallback(category => {
        navigation.navigate("CategoryDetailScreen", { category });
    }, [navigation]);

    // Toggler parent ouvert/fermé
    const toggleParent = useCallback(parentKey => {
        setExpandedParents(prev => ({
            ...prev,
            [parentKey]: !prev[parentKey]
        }));
    }, []);

    if (structuredData.length === 0) {
        return (
            <View style={styles.container}>
                <Header />
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                        {t("common.noCategories")}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.contentWrapper}>
                {/* Sidebar Navigation */}
                <ScrollView
                    style={styles.sidebar}
                    contentContainerStyle={styles.sidebarContent}
                    showsVerticalScrollIndicator={false}
                >
                    {structuredData.map(dep => (
                        <TouchableOpacity
                            key={dep.token}
                            onPress={() => handleDeptPress(dep.token)}
                            style={[
                                styles.deptButton,
                                activeDept === dep.token && styles.deptButtonActive
                            ]}
                        >
                            <Text
                                style={[
                                    styles.deptButtonText,
                                    activeDept === dep.token && styles.deptButtonTextActive
                                ]}
                                numberOfLines={2}
                            >
                                {dep.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Contenu Principal - Liste de catégories */}
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.mainContent}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                >
                    {structuredData.map(dep => (
                        <View
                            key={dep.token}
                            ref={el => {
                                if (el) depRefs.current[dep.token] = el;
                            }}
                            style={styles.departmentSection}
                        >
                            {/* Titre du Département */}
                            <Text style={styles.departmentTitle}>
                                {dep.name}
                            </Text>

                            {/* 1. Catégories sans parent (Standalone) */}
                            {dep.standaloneCategories.map(cat => (
                                <TouchableOpacity
                                    key={cat.token}
                                    onPress={() => handleCategoryPress(cat)}
                                    style={styles.standaloneCategoryItem}
                                >
                                    <Text style={styles.standaloneCategoryName}>
                                        {cat.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}

                            {/* 2. Groupes de Parents */}
                            {dep.parentGroups.map(parent => {
                                const isExpanded = expandedParents[parent.key];
                                const hasCategories = parent.categories && parent.categories.length > 0;

                                return (
                                    <View key={parent.key} style={styles.parentSection}>
                                        {/* Header Parent - Cliquable */}
                                        <TouchableOpacity
                                            onPress={() => toggleParent(parent.key)}
                                            style={styles.parentHeader}
                                        >
                                            <View style={styles.parentHeaderTouchable}>
                                                <Text style={styles.parentTitle}>
                                                    {parent.name}
                                                </Text>
                                                <Text
                                                    style={[
                                                        styles.parentChevron,
                                                        isExpanded && styles.parentChevronOpen
                                                    ]}
                                                >
                                                    ›
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                        {/* Catégories - Visible si déplié */}
                                        {isExpanded && (
                                            <View>
                                                {hasCategories ? (
                                                    parent.categories.map(cat => (
                                                        <TouchableOpacity
                                                            key={cat.token}
                                                            onPress={() => handleCategoryPress(cat)}
                                                            style={styles.categoryItem}
                                                        >
                                                            <Text style={styles.categoryName}>
                                                                {cat.name}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))
                                                ) : (
                                                    <View style={styles.emptyCategories}>
                                                        <Text style={styles.emptyCategoriesText}>
                                                            {t("common.noCategoriesAvailable")}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                );
                            })}

                            {/* Message si rien du tout */}
                            {dep.standaloneCategories.length === 0 && dep.parentGroups.length === 0 && (
                                <Text style={styles.emptyStateText}>
                                    {t("common.noCategories")}
                                </Text>
                            )}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    contentWrapper: {
        flex: 1,
        flexDirection: "row"
    },
    sidebar: {
        width: SCREEN_WIDTH * 0.25,
        backgroundColor: "#f7f7f7",
        borderRightWidth: 1,
        borderRightColor: "#e0e0e0"
    },
    sidebarContent: {
        paddingVertical: 8
    },
    deptButton: {
        paddingHorizontal: 12,
        paddingVertical: 14,
        borderLeftWidth: 3,
        borderLeftColor: "transparent"
    },
    deptButtonActive: {
        borderLeftColor: "#2563eb",
        backgroundColor: "#f0f9ff"
    },
    deptButtonText: {
        fontSize: 13,
        color: "#374151",
        fontWeight: "500"
    },
    deptButtonTextActive: {
        color: "#2563eb",
        fontWeight: "600"
    },
    mainContent: {
        width: SCREEN_WIDTH * 0.75,
        paddingHorizontal: 16,
        paddingVertical: 12
    },
    departmentSection: {
        marginBottom: 28
    },
    departmentTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#1f2937"
    },
    parentSection: {
        marginBottom: 16
    },
    parentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
        paddingBottom: 8,
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb"
    },
    parentHeaderTouchable: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1
    },
    parentTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1f2937",
        flex: 1
    },
    parentChevron: {
        fontSize: 18,
        color: "#9ca3af",
        marginLeft: 8
    },
    parentChevronOpen: {
        transform: [{ rotate: "90deg" }]
    },
    standaloneCategoryItem: {
        paddingVertical: 12,
        paddingHorizontal: 4,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6"
    },
    standaloneCategoryName: {
        fontSize: 14,
        color: "#1f2937",
        fontWeight: "500"
    },
    categoryItem: {
        paddingLeft: 20,
        paddingVertical: 8,
        marginBottom: 4
    },
    categoryName: {
        fontSize: 13,
        color: "#6b7280",
        fontWeight: "500"
    },
    emptyCategories: {
        paddingLeft: 20,
        paddingVertical: 8,
        marginBottom: 4
    },
    emptyCategoriesText: {
        fontSize: 13,
        color: "#9ca3af",
        fontStyle: "italic"
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
        paddingHorizontal: 20
    },
    emptyStateText: {
        textAlign: "center",
        fontSize: 14,
        color: "#9ca3af"
    }
});