import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Image, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import HeaderSimple from '../components/HeaderSimple';
import { useTranslation } from '../context/LocalizationContext';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../utils/colors';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import Btn from '../components/Btn';
import { renderStars } from '../utils/utils';

export default function ReviewsScreen({ navigation }) {
    const { t } = useTranslation();
    const [reviews, setReviews] = useState([]); // TODO: Fetch from API
    const [modalVisible, setModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmitReview = async () => {
        if (rating === 0) {
            showMessage({
                message: t('alerts.ratingRequired'),
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }

        if (reviewText.trim() === '') {
            showMessage({
                message: t('alerts.reviewTextRequired'),
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }

        if (reviewText.trim().length < 10) {
            showMessage({
                message: t('alerts.reviewMinLength'),
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }

        setLoading(true);
        try {
            // TODO: Send review to API
            setTimeout(() => {
                // Add review to list
                const newReview = {
                    id: Math.random().toString(),
                    rating: rating,
                    text: reviewText,
                    date: new Date().toLocaleDateString(),
                    productName: 'Produit', // TODO: Get product name
                };

                setReviews([newReview, ...reviews]);
                setRating(0);
                setReviewText('');
                setModalVisible(false);
                setLoading(false);

                showMessage({
                    message: t('alerts.reviewSubmitted'),
                    type: "success",
                    icon: { icon: "success", position: "left" },
                    duration: 2000,
                });
            }, 1000);
        } catch (error) {
            console.error('Error submitting review:', error);
            showMessage({
                message: t('alerts.reviewError'),
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            setLoading(false);
        }
    };

    const renderStarRating = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 15 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => setRating(star)}
                        style={{ marginHorizontal: 8 }}
                    >
                        <FontAwesome5
                            name={star <= rating ? 'star' : 'star'}
                            size={32}
                            color={star <= rating ? '#ffc107' : '#ddd'}
                            solid={star <= rating}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderReviewItem = ({ item }) => (
        <View style={{
            backgroundColor: '#f7f8fa',
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor: colors.primary
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4 }}>
                        {item.productName}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {renderStars(item.rating, 14)}
                        <Text style={{ fontSize: 12, color: '#999', marginLeft: 5 }}>
                            {item.rating}.0
                        </Text>
                    </View>
                </View>
                <Text style={{ fontSize: 12, color: '#999' }}>
                    {item.date}
                </Text>
            </View>
            <Text style={{ fontSize: 13, color: '#555', lineHeight: 20 }}>
                {item.text}
            </Text>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <HeaderSimple title={t('profil.reviews')} />

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
                {reviews.length === 0 ? (
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 60,
                    }}>
                        <FontAwesome5 name="star" size={50} color="#ddd" />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: '#999',
                            marginTop: 15,
                            textAlign: 'center'
                        }}>
                            {t('reviews.noReviews')}
                        </Text>
                        <Text style={{
                            fontSize: 13,
                            color: '#ccc',
                            marginTop: 8,
                            textAlign: 'center',
                            paddingHorizontal: 30
                        }}>
                            {t('reviews.noReviewsSubtitle')}
                        </Text>
                    </View>
                ) : (
                    <View style={{ padding: 15 }}>
                        <FlatList
                            data={reviews}
                            renderItem={renderReviewItem}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                        />
                    </View>
                )}
            </ScrollView>

            {/* Floating Action Button */}
            {/* <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: colors.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    elevation: 5,
                }}
            >
                <FontAwesome5 name="plus" size={24} color="white" />
            </TouchableOpacity> */}

            {/* Modal for adding review */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1, backgroundColor: 'white' }}
                >
                    <View style={{ flex: 1 }}>
                        {/* Header */}
                        <View style={{
                            paddingHorizontal: 15,
                            paddingTop: 10,
                            paddingBottom: 10,
                            backgroundColor: 'white',
                            borderBottomWidth: 1,
                            borderBottomColor: '#eee',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
                                {t('reviews.addReview')}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <FontAwesome5 name="times" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        <ScrollView style={{ flex: 1, padding: 15 }} keyboardShouldPersistTaps="handled">
                            {/* Instructions */}
                            <Text style={{
                                fontSize: 14,
                                color: '#555',
                                lineHeight: 22,
                                marginBottom: 20
                            }}>
                                {t('reviews.reviewInstruction')}
                            </Text>

                            {/* Star Rating */}
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: 15
                            }}>
                                {t('reviews.rating')} <Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            {renderStarRating()}

                            {/* Review Text */}
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: 8
                            }}>
                                {t('reviews.reviewText')} <Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    borderRadius: 8,
                                    paddingHorizontal: 12,
                                    paddingVertical: 12,
                                    minHeight: 120,
                                    textAlignVertical: 'top',
                                    fontSize: 14,
                                    marginBottom: 20
                                }}
                                placeholder={t('reviews.reviewPlaceholder')}
                                placeholderTextColor="#999"
                                value={reviewText}
                                onChangeText={setReviewText}
                                multiline={true}
                                numberOfLines={6}
                            />
                            <Text style={{ fontSize: 12, color: '#999', marginBottom: 20 }}>
                                {reviewText.length} / 500
                            </Text>

                            {/* Submit Button */}
                            <Btn
                                label={loading ? t('common.loading') : t('reviews.submitReview')}
                                loader={loading}
                                disabled={loading}
                                action={handleSubmitReview}
                            />

                            <View style={{ height: 20 }} />
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}
