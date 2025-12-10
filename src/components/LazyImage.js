import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Image, View, ActivityIndicator } from 'react-native';

// Cache global pour les images chargées
const imageCache = new Map();

export default function LazyImage({ 
    source, 
    style, 
    resizeMode = 'cover',
    placeholderColor = '#f0f0f0'
}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const imageUrlRef = useRef(source?.uri);
    const isLoadedRef = useRef(false);

    // Vérifier si l'image est déjà en cache
    useMemo(() => {
        const uri = source?.uri;
        if (uri && imageCache.has(uri)) {
            isLoadedRef.current = true;
            setLoading(false);
            setError(false);
        } else {
            isLoadedRef.current = false;
            setLoading(true);
            setError(false);
        }
    }, [source?.uri]);

    useEffect(() => {
        imageUrlRef.current = source?.uri;
    }, [source?.uri]);

    const handleLoadStart = () => {
        setLoading(true);
    };

    const handleLoadEnd = () => {
        // Ajouter l'image au cache
        const uri = imageUrlRef.current;
        if (uri && !imageCache.has(uri)) {
            imageCache.set(uri, true);
        }
        setLoading(false);
        isLoadedRef.current = true;
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
        <View style={[style, { position: 'relative', backgroundColor: placeholderColor }]}>
            <Image
                source={source}
                style={style}
                resizeMode={resizeMode}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                onError={handleError}
                cache="force"
            />
            {loading && !isLoadedRef.current && (
                <View
                    style={[
                        style,
                        {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: placeholderColor,
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 10
                        }
                    ]}
                >
                    <ActivityIndicator size="small" color="#9ca3af" />
                </View>
            )}
        </View>
    );
}
