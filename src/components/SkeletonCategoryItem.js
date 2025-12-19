import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from './SkeletonLoader';

export default function SkeletonCategoryItem() {
    return (
        <View style={styles.container}>
            <SkeletonLoader
                width={100}
                height={100}
                borderRadius={8}
                style={styles.image}
            />
            <SkeletonLoader
                width={80}
                height={14}
                borderRadius={4}
                style={styles.text}
            />
            <SkeletonLoader
                width={60}
                height={12}
                borderRadius={4}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginRight: 10,
        alignItems: 'center'
    },
    image: {
        marginBottom: 8
    },
    text: {
        marginBottom: 4
    }
});
