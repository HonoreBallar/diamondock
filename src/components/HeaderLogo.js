import { Image, View } from 'react-native';

export default function HeaderLogo() {
    return (
        <View style={{paddingHorizontal : 15,marginTop: 40 , height:40}}>
            <Image
                source={require('../assets/logo.png')}
                style={{ width: 190, height: '100%' }}
                resizeMode='contain'
            />
        </View>
    );
}