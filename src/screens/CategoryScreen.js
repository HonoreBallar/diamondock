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
import LazyImage from "../components/LazyImage";
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
    const [loading, setLoading] = useState(true);

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

    // Arrêter le loading quand les données sont chargées (avec délai de 1 seconde)
    React.useEffect(() => {
        if (structuredData.length > 0) {
            const timer = setTimeout(() => {
                setLoading(false);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [structuredData]);

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

    // Afficher le skeleton loader pendant le chargement
    if (loading) {
        return (
            <View style={styles.container}>
                <Header />
                <View style={styles.contentWrapper}>
                    {/* Sidebar Skeleton */}
                    <ScrollView
                        style={styles.sidebar}
                        contentContainerStyle={styles.sidebarContent}
                        scrollEnabled={false}
                    >
                        {[1, 2, 3, 4, 5].map((index) => (
                            <View key={index} style={styles.skeletonDeptButton}>
                                <View style={styles.skeletonText} />
                            </View>
                        ))}
                    </ScrollView>

                    {/* Main Content Skeleton */}
                    <ScrollView
                        style={styles.mainContent}
                        scrollEnabled={false}
                    >
                        {[1, 2, 3].map((depIndex) => (
                            <View key={depIndex} style={styles.skeletonDepartmentSection}>
                                <View style={styles.skeletonDepartmentTitle} />
                                {[1, 2, 3].map((catIndex) => (
                                    <View key={catIndex} style={styles.skeletonCategoryItem} />
                                ))}
                            </View>
                        ))}
                    </ScrollView>
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

                            {/* 1. Catégories sans parent (Standalone) - Grid Layout */}
                            {dep.standaloneCategories.length > 0 && (
                                <View style={styles.categoriesGrid}>
                                    {dep.standaloneCategories.map(cat => (
                                        <TouchableOpacity
                                            key={cat.token}
                                            onPress={() => handleCategoryPress(cat)}
                                            style={styles.categoryCard}
                                        >
                                            <View style={styles.categoryImageContainer}>
                                                {cat.image ? (
                                                    <LazyImage
                                                        source={{ uri: cat.image }}
                                                        style={styles.categoryImage}
                                                        resizeMode="cover"
                                                    />
                                                ) : (
                                                    <View style={styles.categoryImagePlaceholder}>
                                                        <Text style={styles.placeholderText}>
                                                            {cat.name.charAt(0).toUpperCase()}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            <View style={styles.categoryCardBottom}>
                                                <Text style={styles.categoryCardTitle} numberOfLines={2}>
                                                    {cat.name}
                                                </Text>
                                                <Text style={styles.categoryCardCount}>
                                                    {cat?.nb_products || 0} {t("common.products")}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

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
                                                    <View style={styles.categoriesGrid}>
                                                        {parent.categories.map(cat => (
                                                            <TouchableOpacity
                                                                key={cat.token}
                                                                onPress={() => handleCategoryPress(cat)}
                                                                style={styles.categoryCard}
                                                            >
                                                                <View style={styles.categoryImageContainer}>
                                                                    {cat.image ? (
                                                                        <LazyImage
                                                                            source={{ uri: cat.image }}
                                                                            style={styles.categoryImage}
                                                                            resizeMode="cover"
                                                                        />
                                                                    ) : (
                                                                        <View style={styles.categoryImagePlaceholder}>
                                                                            <Text style={styles.placeholderText}>
                                                                                {cat.name.charAt(0).toUpperCase()}
                                                                            </Text>
                                                                        </View>
                                                                    )}
                                                                </View>
                                                                <View style={styles.categoryCardBottom}>
                                                                    <Text style={styles.categoryCardTitle} numberOfLines={2}>
                                                                        {cat.name}
                                                                    </Text>
                                                                    <Text style={styles.categoryCardCount}>
                                                                        {cat?.nb_products || 0} {t("common.products")}
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </View>
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
        color: "#ffa100",
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
        color: "#03045e"
    },
    parentSection: {
        marginBottom: 5
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
    // Grid Styles for Category Cards
    categoriesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 3,
        justifyContent: "space-between"
    },
    categoryCard: {
        width: "48%",
        marginBottom: 10,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3
    },
    categoryImageContainer: {
        width: "100%",
        height: 50,
        backgroundColor: "#f0f0f0",
        overflow: "hidden"
    },
    categoryImage: {
        width: 150,
        height: 50
    },
    categoryImagePlaceholder: {
        width: "100%",
        height: "100%",
        backgroundColor: "#e5e7eb",
        justifyContent: "center",
        alignItems: "center"
    },
    placeholderText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#9ca3af"
    },
    categoryCardBottom: {
        padding: 12,
        minHeight: 60,
        justifyContent: "center"
    },
    categoryCardTitle: {
        fontSize: 13,
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: 6
    },
    categoryCardCount: {
        fontSize: 11,
        color: "#9ca3af",
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
    },
    // Skeleton Styles
    skeletonDeptButton: {
        paddingHorizontal: 12,
        paddingVertical: 14,
        borderLeftWidth: 3,
        borderLeftColor: "transparent"
    },
    skeletonText: {
        height: 16,
        backgroundColor: "#e5e7eb",
        borderRadius: 4,
        marginBottom: 8
    },
    skeletonDepartmentSection: {
        marginBottom: 28
    },
    skeletonDepartmentTitle: {
        height: 22,
        backgroundColor: "#e5e7eb",
        borderRadius: 4,
        marginBottom: 16,
        width: "40%"
    },
    skeletonCategoryItem: {
        height: 16,
        backgroundColor: "#e5e7eb",
        borderRadius: 4,
        marginBottom: 12
    }
});