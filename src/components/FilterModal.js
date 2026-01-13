import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput
} from "react-native";
import SearchableSelect from "./SearchableSelect";
import { useTranslation } from "../context/LocalizationContext";

export default function FilterModal({
  visible,
  onClose,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  categories,
  selectedCategory,
  setSelectedCategory,
  countries,
  selectedCountry,
  setSelectedCountry,
  onReset,
  resultsCount
}) {
  const { t } = useTranslation();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "flex-end"
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 16,
            maxHeight: "85%"
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              {t('filter.title') || 'Filtres'}
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Text style={{ fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Prix */}
            <Text style={{ fontWeight: "600", marginBottom: 8 }}>
              {t('common.price') || 'Prix'}
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TextInput
                placeholder={t('filter.min') || 'Min'}
                keyboardType="numeric"
                value={minPrice}
                onChangeText={setMinPrice}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 6,
                  padding: 8
                }}
              />
              <TextInput
                placeholder={t('filter.max') || 'Max'}
                keyboardType="numeric"
                value={maxPrice}
                onChangeText={setMaxPrice}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 6,
                  padding: 8
                }}
              />
            </View>

            {/* Catégories */}
            <View style={{ marginTop: 15 }}>
                <SearchableSelect
                label={t('common.category') || 'Catégorie'}
                data={categories.map(cat => ({ id: cat, name: cat }))}
                value={selectedCategory ? { id: selectedCategory, name: selectedCategory } : null}
                onChange={(item) => setSelectedCategory(item?.id || null)}
                placeholder={t('filter.selectCategory') || 'Sélectionner une catégorie'}
                />
            </View>

            {/* Pays */}
            <SearchableSelect
              label={t('filter.country') || 'Pays'}
              data={countries}
              value={selectedCountry}
              onChange={setSelectedCountry}
              placeholder={t('filter.selectCountry') || 'Sélectionner un pays'}
            />
          </ScrollView>

          {/* Footer */}
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginTop: 15
            }}
          >
            <TouchableOpacity
              onPress={onReset}
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: "#eee",
                borderRadius: 8,
                alignItems: "center"
              }}
            >
              <Text>{t('filter.reset') || 'Réinitialiser'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: "#ffa100",
                borderRadius: 8,
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                {t('filter.view') || 'Voir'} ({resultsCount})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
