import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SkeletonLoader = ({ width = '100%', height = 20, borderRadius = 4, style = {} }) => {
    const shimmerAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: false,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, [shimmerAnim]);

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width,
                    height,
                    borderRadius,
                    opacity,
                },
                style
            ]}
        />
    );
};

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: '#e5e7eb',
        overflow: 'hidden'
    }
});

export default SkeletonLoader;

