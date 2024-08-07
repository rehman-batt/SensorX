import { Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { useState, useEffect } from 'react';
import { styles } from '../styles/SensorStyles';

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