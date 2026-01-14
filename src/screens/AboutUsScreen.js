import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from '../context/LocalizationContext';
import HeaderSimple from '../components/HeaderSimple';


export default function AboutUsScreen({navigation}) {
    const {t} = useTranslation();

    const SectionTitle = ({ title }) => (
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 8, color: '#03045e' }}>
            {title}
        </Text>
    );

    const SectionContent = ({ content }) => (
        <Text style={{ fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 12 }}>
            {content}
        </Text>
    );

    const BulletPoint = ({ text }) => (
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <Text style={{ fontSize: 14, color: '#03045e', marginRight: 10, fontWeight: 'bold' }}>•</Text>
            <Text style={{ fontSize: 14, color: '#555', lineHeight: 20, flex: 1 }}>
                {text}
            </Text>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
           
            <HeaderSimple title={t('aboutUs.title')} />
            
            <ScrollView style={{ flex: 1, padding: 15, marginBottom: 40 }} showsVerticalScrollIndicator={false}>
                
                {/* Introduction */}
                <SectionContent content={t('aboutUs.introduction')} />

                {/* What does Diamondock mean */}
                <SectionTitle title={t('aboutUs.meaningTitle')} />
                <SectionContent content={t('aboutUs.meaningContent')} />

                {/* Services */}
                <SectionTitle title={t('aboutUs.servicesTitle')} />
                
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#03045e', marginBottom: 4 }}>
                        {t('aboutUs.digitalMallTitle')}
                    </Text>
                    <SectionContent content={t('aboutUs.digitalMallContent')} />
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#03045e', marginBottom: 4 }}>
                        {t('aboutUs.socialMediaTitle')}
                    </Text>
                    <SectionContent content={t('aboutUs.socialMediaContent')} />
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#03045e', marginBottom: 4 }}>
                        {t('aboutUs.diamondAresTitle')}
                    </Text>
                    <SectionContent content={t('aboutUs.diamondAresContent')} />
                </View>

                {/* Key Differences */}
                <SectionTitle title={t('aboutUs.differencesTitle')} />
                
                <BulletPoint text={t('aboutUs.difference1')} />
                <BulletPoint text={t('aboutUs.difference2')} />
                <BulletPoint text={t('aboutUs.difference3')} />
                <BulletPoint text={t('aboutUs.difference4')} />
                <BulletPoint text={t('aboutUs.difference5')} />

                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
}