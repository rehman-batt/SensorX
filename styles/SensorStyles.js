import { StyleSheet } from 'react-native';

export const backgroundColor = '#f2f2f2';
export const foregroundColor1 = '#0e4c92';
export const buttonBackground = '#0e4c92';
export const buttonForeground = 'white';
export const foregroundColor2 = 'black';

export const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        marginBottom: '3%',
        color: foregroundColor1
    },
    container: {
        flex: 0.17,
        width: '80%',
        backgroundColor: backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        marginBottom: '3%',

    },
});

