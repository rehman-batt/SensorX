import { StyleSheet } from 'react-native';
import {
    backgroundColor,
    foregroundColor1,
    buttonBackground,
    buttonForeground,
    foregroundColor2,
} from './SensorStyles';

export const deleteButtonColor = '#C0392B';
export const SettingsStyles = StyleSheet.create({
    button: {
        width: '80%',
        height: 50,
        backgroundColor: buttonBackground,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginTop: 20
    },
    buttonText: {
        color: buttonForeground,
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {

        width: '40%',
        height: 50,
        backgroundColor: buttonBackground,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginTop: 20

    },
    deleteButton: {
        width: '40%',
        height: 50,
        backgroundColor: deleteButtonColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginTop: 20,
        flexDirection: 'row',
    },
    icon: {
        marginBottom: 40,
        borderColor: foregroundColor1,
        borderWidth: 1,
        borderRadius: 100,
        backgroundColor: buttonForeground,
        padding: 10,
    },
    userDataContainer: {
        margin: 0,
        padding: 10,
        width: '80%',
        borderWidth: 1.5,
        borderColor: foregroundColor1,
        backgroundColor: 'white',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 15,
    },
    carDataTitle: {
        color: foregroundColor1,
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
    },
    pickerContainer: {
        width: '100%',
        height: 50,
        borderColor: foregroundColor1,
        borderWidth: 1,
        marginBottom: 10,
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
    accountButtonContiner: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
    },
    deleteIcon: {
        color: buttonForeground,
        paddingRight: 2,
    }, 
    deleteActivityIndicator: {
        marginTop: 20,
    },
    dataActivityIndicator: {
        marginVertical: 130,
    }

});