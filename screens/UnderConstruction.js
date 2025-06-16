// Import core UI components from React Native
import { Text, View } from 'react-native';

// Import MaterialIcons for displaying the construction icon
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import custom color styles
import { backgroundColor, buttonBackground } from '../styles/SensorStyles';

// Under Construction screen component
export default function UC() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: backgroundColor
            }}
        >
            {/* Construction icon */}
            <Icon
                name="construction"
                size={50}
                color={buttonBackground}
                style={{ marginBottom: 10 }}
            />

            {/* Informational text */}
            <Text style={{ fontWeight: 'bold', marginTop: 10 }}>
                This Page is Currently Under Construction
            </Text>
        </View>
    );
}
