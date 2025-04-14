import { FlatList, ScrollView, Text, View } from "react-native"
import Header from "../components/Header";
import CategoryCard from "../components/CategoryCard";
import { useCategories } from "../context/CategoryContext";

export default function CategoryScreen(){
    const {categories} = useCategories();
    return(
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
            <Header />
            {/* <CategoryCard/> */}
            <View style={{marginHorizontal: 13, marginVertical: 15}}>
                <FlatList
                    data={categories}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <CategoryCard />
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                />
            </View>
        </ScrollView>
    );
}