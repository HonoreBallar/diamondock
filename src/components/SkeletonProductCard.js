import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SkeletonLoader from './SkeletonLoader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PRODUCT_CARD_WIDTH = SCREEN_WIDTH * 0.4;

export default function SkeletonProductCard() {
    return (
        <View style={styles.container}>
            <SkeletonLoader
                width={PRODUCT_CARD_WIDTH - 20}
                height={150}
                borderRadius={8}
                style={styles.image}
            />
            <SkeletonLoader
                width={PRODUCT_CARD_WIDTH - 30}
                height={14}
                borderRadius={4}
                style={styles.title}
            />
            <SkeletonLoader
                width={PRODUCT_CARD_WIDTH - 40}
                height={12}
                borderRadius={4}
                style={styles.price}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginRight: 10,
        width: PRODUCT_CARD_WIDTH
    },
    image: {
        marginBottom: 8
    },
    title: {
        marginBottom: 6
    },
    price: {
        marginBottom: 4
    }
});
