import { StyleSheet } from 'react-native';
import {
    backgroundColor,
    foregroundColor1,
    buttonBackground,
    buttonForeground,
    foregroundColor2,
} from './SensorStyles';

export const placeholderTextColor = "#888";

export const AuthStyles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: backgroundColor,
        padding: 20,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: foregroundColor1,
        marginBottom: 20,
        backgroundColor: buttonForeground,
    },
    icon: {
        marginBottom: 40,
        borderColor: foregroundColor1,
        borderWidth: 1,
        borderRadius: 100,
        backgroundColor: buttonForeground,
        padding: 10,
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 40,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: foregroundColor1,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginVertical: 10,
        backgroundColor: buttonForeground,
        color: foregroundColor2,
    },
    pickerContainer: {
        width: '100%',
        height: 50,
        borderColor: foregroundColor1,
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 10,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    picker: {
        width: '100%',
        height: '100%',
        color: foregroundColor2,
        backgroundColor: buttonForeground,
    },
    sliderLabel: {
        width: '100%',
        textAlign: 'center',
        marginTop: 10,
        color: foregroundColor2,
        fontSize: 16,
        fontWeight: 'bold',
    },
    sliderContainer: {
        width: '100%',
        borderWidth: 0.5,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: buttonForeground,
        shadowColor: foregroundColor2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
        elevation: 1,
    },  
    slider: {
        width: '100%',
        height: 40,
        marginVertical: 10,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: buttonBackground,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 20
    },
    buttonText: {
        color: buttonForeground,
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkText: {
        color: foregroundColor1,
        marginTop: 15,
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    label: {
        width: '100%',
        textAlign: 'left',
        marginBottom: 5,
        color: foregroundColor2,
        fontSize: 14,
        fontWeight: '600',
    },
    loading: {
        marginTop: 50,
    }
});
