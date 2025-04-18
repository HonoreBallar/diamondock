import React, { useRef, useMemo } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";

export default function MyBottomSheet({ bottomSheetRef, snapPoints: customSnapPoints, initialIndex = 0, children }) {
    // Définir les dimensions du Bottom Sheet
    const snapPoints = useMemo(() => customSnapPoints || ["50%"], [customSnapPoints]);

    return (
        <BottomSheet ref={bottomSheetRef} index={initialIndex} snapPoints={snapPoints}>
            <View style={styles.content}>
                {children}
            </View>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    content: { flex: 1, alignItems: "center", justifyContent: "center" },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
});
