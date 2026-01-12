import { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TextInput, Platform, ActivityIndicator } from 'react-native';
import HeaderSimple from '../components/HeaderSimple';
import Input from '../components/Input';
import Btn from '../components/Btn';
import { useTranslation } from '../context/LocalizationContext';
import { showMessage } from 'react-native-flash-message';
import { postRequest } from '../utils/api';

export default function ContactUsScreen({ navigation }) {
    const { t } = useTranslation();
    const [firstname, setFirstname] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async () => {
        // Validation
        if (firstname.trim() === '') {
            showMessage({
                message: t('alerts.firstnameRequired'),
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }

        if (email.trim() === '') {
            showMessage({
                message: t('alerts.emailRequired'),
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }

        if (!validateEmail(email)) {
            showMessage({
                message: t('alerts.emailInvalid'),
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }

        if (message.trim() === '') {
            showMessage({
                message: t('alerts.messageRequired'),
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }

        if (message.trim().length < 10) {
            showMessage({
                message: t('alerts.messageMin'),
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            return;
        }

        // Submit form
        setLoading(true);
        try {
            const datas = {
                name: firstname,
                email: email,
                description: message,
            };
            const response = await postRequest('/contact/create',datas);
            console.log('Contact Us response :', response);
            if (response?.status === false) {
                showMessage({
                    message: response?.message,
                    type: "danger",
                    icon: { icon: "danger", position: "left" },
                    duration: 2000,
                });
                setLoading(false);
                return;
            }
            // TODO: Send form data to API
            showMessage({
                message: t('alerts.messageSent'),
                type: "success",
                icon: { icon: "success", position: "left" },
                duration: 2000,
            });

            setFirstname('');
            setEmail('');
            setMessage('');
            setLoading(false);
            navigation.goBack();

        } catch (error) {
            console.error('Error sending message:', error);
            showMessage({
                message: t('alerts.errorMessage'),
                type: "danger",
                icon: { icon: "danger", position: "left" },
                duration: 2000,
            });
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={{ flex: 1, backgroundColor: 'white' }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <HeaderSimple title={t('contactUs.title')} />
                    <ScrollView 
                        style={{ flex: 1 }} 
                        contentContainerStyle={{ paddingBottom: 20 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={{ padding: 15 }}>
                            {/* Introduction */}
                            <Text style={{ fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 20 }}>
                                {t('contactUs.subtitle')}
                            </Text>

                            {/* Form */}
                            <View style={{ marginBottom: 20 }}>
                                {/* Firstname */}
                                <Input
                                    label={t('input.firstnameTitle')}
                                    icon="user"
                                    placeholder={t('input.firstnamePlaceholder')}
                                    value={firstname}
                                    onChangeText={setFirstname}
                                    isRequired={true}
                                />

                                {/* Email */}
                                <Input
                                    label={t('input.emailTitle')}
                                    icon="envelope"
                                    placeholder={t('input.emailPlaceholder')}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    isRequired={true}
                                />

                                {/* Message */}
                                <View style={{ marginBottom: 15 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>
                                        {t('contactUs.messageLabel')} <Text style={{ color: 'red' }}>*</Text>
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
                                            fontFamily: 'System',
                                        }}
                                        placeholder={t('contactUs.messagePlaceholder')}
                                        placeholderTextColor="#999"
                                        value={message}
                                        onChangeText={setMessage}
                                        multiline={true}
                                        numberOfLines={6}
                                    />
                                    <Text style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                                        {message.length} / 1000
                                    </Text>
                                </View>
                            </View>

                            {/* Submit Button */}
                            <View style={{ marginBottom: 15 }}>
                                <Btn
                                    label={loading ? t('common.loading') : t('contactUs.send')}
                                    loader={loading}
                                    disabled={loading}
                                    action={handleSubmit}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
