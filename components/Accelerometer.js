import { StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { useState, useEffect } from 'react';

export default function Accelero() {

    const [{ x, y, z }, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });

    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        setSubscription(Accelerometer.addListener(setData));

        return () => {
            subscription && subscription.remove();
            setSubscription(null);
        };
    }, []);

    return (

        <View style={styles.container}>
            <Text style={styles.title}>Accelerometer</Text>
            <Text>
                X: {x.toFixed(2)}
            </Text>
            <Text>
                Y: {y.toFixed(2)}
            </Text>
            <Text>
                Z: {z.toFixed(2)}
            </Text>

        </View>

    );
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        marginBottom: '3%',
        color: 'blue'
    },
    container: {
        flex: 0.15,
        width: '80%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 20,
        marginBottom: '3%',

    },
});
