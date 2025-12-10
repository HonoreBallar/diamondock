import React, { useState, useEffect } from 'react';
import { Image, View, ActivityIndicator } from 'react-native';

export default function LazyImage({ 
    source, 
    style, 
    resizeMode = 'cover',
    placeholderColor = '#f0f0f0'
}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(false);
    }, [source]);

    const handleLoadStart = () => {
        setLoading(true);
    };

    const handleLoadEnd = () => {
        setLoading(false);
    };

    const handleError = () => {
        setLoading(false);
        setError(true);
    };

    if (error) {
        return (
            <View style={[style, { backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' }]}>
                <View style={{ opacity: 0.5 }}>
                    <Image
                        source={require('../assets/placeholder.png')}
                        style={{ width: 40, height: 40 }}
                        resizeMode="contain"
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={[style, { position: 'relative' }]}>
            <Image
                source={source}
                style={style}
                resizeMode={resizeMode}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                onError={handleError}
            />
            {loading && (
                <View
                    style={[
                        style,
                        {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: placeholderColor,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }
                    ]}
                >
                    <ActivityIndicator size="small" color="#9ca3af" />
                </View>
            )}
        </View>
    );
}
