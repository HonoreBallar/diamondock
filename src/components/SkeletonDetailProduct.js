import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from './SkeletonLoader';

export default function SkeletonDetailProduct() {
    return (
        <>
            {/* Image Carousel Skeleton */}
            <SkeletonLoader
                width="100%"
                height={350}
                borderRadius={0}
            />

            {/* Product Info Skeleton */}
            <View style={styles.section}>
                <SkeletonLoader
                    width="80%"
                    height={24}
                    borderRadius={4}
                    style={styles.marginBottom}
                />
                <SkeletonLoader
                    width="60%"
                    height={16}
                    borderRadius={4}
                    style={styles.marginBottom}
                />
                
                {/* Price Skeleton */}
                <SkeletonLoader
                    width="40%"
                    height={28}
                    borderRadius={4}
                    style={styles.marginBottom}
                />

                {/* Category Badge Skeleton */}
                <SkeletonLoader
                    width="30%"
                    height={20}
                    borderRadius={5}
                    style={styles.marginBottom}
                />

                {/* Stock Progress Skeleton */}
                <SkeletonLoader
                    width="100%"
                    height={16}
                    borderRadius={4}
                    style={styles.marginBottom}
                />
                <SkeletonLoader
                    width="100%"
                    height={6}
                    borderRadius={3}
                    style={styles.marginBottom}
                />

                {/* Variants Skeleton */}
                <View style={styles.marginTop}>
                    <SkeletonLoader
                        width="30%"
                        height={18}
                        borderRadius={4}
                        style={styles.marginBottom}
                    />
                    <View style={styles.variantsRow}>
                        <SkeletonLoader
                            width={80}
                            height={32}
                            borderRadius={6}
                            style={styles.variantItem}
                        />
                        <SkeletonLoader
                            width={80}
                            height={32}
                            borderRadius={6}
                            style={styles.variantItem}
                        />
                        <SkeletonLoader
                            width={80}
                            height={32}
                            borderRadius={6}
                        />
                    </View>
                </View>
            </View>

            {/* Description Section Skeleton */}
            <View style={styles.section}>
                <SkeletonLoader
                    width="40%"
                    height={18}
                    borderRadius={4}
                    style={styles.marginBottom}
                />
                <SkeletonLoader
                    width="100%"
                    height={14}
                    borderRadius={4}
                    style={styles.marginBottom}
                />
                <SkeletonLoader
                    width="95%"
                    height={14}
                    borderRadius={4}
                    style={styles.marginBottom}
                />
                <SkeletonLoader
                    width="85%"
                    height={14}
                    borderRadius={4}
                />
            </View>

            {/* Delivery Section Skeleton */}
            <View style={styles.section}>
                <SkeletonLoader
                    width="40%"
                    height={18}
                    borderRadius={4}
                    style={styles.marginBottom}
                />
                {[1, 2, 3, 4].map((item, index) => (
                    <SkeletonLoader
                        key={index}
                        width="100%"
                        height={48}
                        borderRadius={8}
                        style={styles.marginBottom}
                    />
                ))}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    section: {
        padding: 12,
        backgroundColor: '#ffffff',
        marginTop: 5,
        marginBottom: 5
    },
    marginBottom: {
        marginBottom: 12
    },
    marginTop: {
        marginTop: 10
    },
    variantsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    variantItem: {
        marginRight: 10,
        marginBottom: 10
    }
});
