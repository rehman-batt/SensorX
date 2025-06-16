import { Text, View, Image } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/SensorStyles';

export default function Magnet({ delay, collectData, data }) {
    // State to track permission and error messages
    const [status, setStatus] = useState(false);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access Magnetometer');

    // State for current magnetometer values
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });

    // Ref to hold the sensor subscription
    const subscription = useRef(null);

    // If data collection is enabled, push readings into shared `data` object
    if (collectData && status) {
        data.current['x'].push(x);
        data.current['y'].push(y);
        data.current['z'].push(z);
        data.current['timestamp'].push(Date.now());
    }

    // Set sensor update interval
    Magnetometer.setUpdateInterval(delay);

    // Start and clean up the listener when the screen gains/loses focus
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                try {
                    // Request magnetometer permissions
                    let permissionStatus = await Magnetometer.requestPermissionsAsync();
                    if (permissionStatus.status !== 'granted') {
                        setErrorMsg('Please provide permission to access Magnetometer');
                        return;
                    }

                    setStatus(true);
                    setErrorMsg(null);

                    // Subscribe to magnetometer data
                    subscription.current = Magnetometer.addListener((magnetometerData) => {
                        if (isActive) {
                            setData(magnetometerData);
                        }
                    });
                } catch (e) {
                    setErrorMsg('An error occurred while requesting Magnetometer permission');
                }
            })();

            // Clean up listener on unmount/focus loss
            return () => {
                isActive = false;
                if (subscription.current) {
                    subscription.current.remove();
                    subscription.current = null;
                }
            };
        }, [delay, collectData, status])
    );

    return (
        <View style={styles.container}>
            {/* Title */}
            <View style={styles.titleView}>
                <Text style={styles.title}>Magnetometer</Text>
            </View>

            {/* If permission granted and no errors, display sensor values */}
            {!errorMsg && (
                <>
                    <View style={styles.subContainer}>
                        <View style={styles.sensorImageView}>
                            <Image
                                style={styles.sensorImage}
                                source={require('../assets/magnatometer-sensor.png')}
                            />
                        </View>

                        <View style={styles.valueContainer}>
                            {/* X-axis value */}
                            <View>
                                <Text style={styles.valueTitle}>x-axis</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.value}>
                                        {x.toFixed(2)}
                                    </Text>
                                    <Text style={styles.unit}>m/s²</Text>
                                </View>
                            </View>

                            {/* Y-axis value */}
                            <View>
                                <Text style={styles.valueTitle}>y-axis</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.value}>
                                        {y.toFixed(2)}
                                    </Text>
                                    <Text style={styles.unit}>m/s²</Text>
                                </View>
                            </View>

                            {/* Z-axis value */}
                            <View>
                                <Text style={styles.valueTitle}>z-axis</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.value}>
                                        {z.toFixed(2)}
                                    </Text>
                                    <Text style={styles.unit}>m/s²</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </>
            )}

            {/* Display error message if any */}
            {errorMsg && (
                <View style={styles.errorView}>
                    <Text>{errorMsg}</Text>
                </View>
            )}
        </View>
    );
}
