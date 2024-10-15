import { StyleSheet } from 'react-native';

export const backgroundColor = '#f2f2f2';
export const foregroundColor1 = '#0e4c92';
export const buttonBackground = '#0e4c92';
export const buttonForeground = 'white';
export const foregroundColor2 = 'black';
export const camerBackground = '#e6e6e6'

export const styles = StyleSheet.create({
    titleView: {
        width: '100%',
        backgroundColor: buttonBackground,
        height: 50,
        justifyContent: 'center',
        paddingLeft: '5%',
        
    },
    title: {
        color: buttonForeground,
        fontSize: 20,
    },
    container: {
        width: '95%',
        backgroundColor: backgroundColor,
        borderWidth: 1,
        marginTop: '4%',
        borderRadius: 5,
        overflow: 'hidden',
        borderColor: 'transparent',
        shadowColor: foregroundColor2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
        elevation: 5,
        height: 300,
        
    },
    sensorImageView: {
        marginTop: 'auto',
        marginBottom: 'auto',
        height: 140, 
        width: 140,
        marginHorizontal: 40,
        borderColor: buttonBackground,
        borderWidth: 1,
        borderRadius: 100,
        padding: 20,
    },
    sensorImage: {
        flex: 1,
        width: '100%'
    },
    subContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    valueTitle: {
        fontWeight: 'bold',
        fontSize: 17,
        marginBottom: 5,
    },
    value: {
        borderWidth: 1,
        alignSelf: 'flex-start',
        paddingHorizontal: 20,
        fontSize: 16,
        color: foregroundColor1,
    },
    latLongValue: {
        borderWidth: 1,
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        fontSize: 13,
        color: foregroundColor1,
    },
    valueContainer: {
        flex: 1,
        justifyContent: 'space-around',
    }, 
    flexRowUtility: {
        flexDirection: 'row',
    },
    unit: {
        color: 'gray',
        fontSize: 15,
        marginLeft: 5,
    },
    errorView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    GraphContainer: {
        
        flex: 1,
        width: '100%',
        alignItems: 'center',
        
    },
    GraphTitle: {
        marginTop: 70,
        fontWeight: 'bold',
        fontSize: 30,
    }
});

