import { Text, View } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import { useState, useEffect } from 'react';
import { styles } from '../styles/SensorStyles';

export default function Magnet({delay}) {

    const [{ x, y, z }, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });

    const [subscription, setSubscription] = useState(null);
    Magnetometer.setUpdateInterval(delay);

    useEffect(() => {
        setSubscription(
            Magnetometer.addListener(magnetometerData => {
                setData(magnetometerData);
            })
        );

        return () => {
            subscription && subscription.remove();
            setSubscription(null);
        };
    }, []);

    return (

        <View style={styles.container}>
            <Text style={styles.title}>Magnetometer</Text>
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


