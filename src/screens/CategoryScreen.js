import { FlatList, ScrollView, Text, View } from "react-native"
import Header from "../components/Header";
import CategoryCard from "../components/CategoryCard";
import { useCategories } from "../context/CategoryContext";
import Title from "../components/Title";
import { useTranslation } from "../context/LocalizationContext";

export default function CategoryScreen({navigation}){
    const { t } = useTranslation();
    const {categories} = useCategories();
    return(
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <Header />
            <ScrollView>
                <Title title={t('categories.categoriesTitle')} />
                <View style={{marginHorizontal: 13, marginVertical: 15}}>
                    <FlatList
                        data={categories}
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <CategoryCard category={item} navigation={navigation}/>
                        )}
                        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                    />
                </View>
            </ScrollView>
        </View>
    );
}