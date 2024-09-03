import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { backgroundColor, buttonBackground } from '../styles/SensorStyles';

export default function UC() {

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: backgroundColor }}>
             <Icon name="construction" size={50} color={buttonBackground} style={{marginBottom: 10}} />
             <Text style={{fontWeight: 'bold', marginTop: 10}}>This Page is Currently Under Construction</Text>

        </View>

    );
}


