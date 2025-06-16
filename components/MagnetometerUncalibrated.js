import { Text, View, Image } from 'react-native';
import { MagnetometerUncalibrated } from 'expo-sensors';
import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/SensorStyles';

export default function MagnetUnc({ delay, collectData, data }) {
    // State to track permission status and error messages
    const [status, setStatus] = useState(false);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access Magnetometer');

    // State to store current x, y, z values from the sensor
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });

    // Ref to hold the sensor subscription
    const subscription = useRef(null);

    // If allowed, push current sensor data to the shared `data` object
    if (collectData && status) {
        data.current['x'].push(x);
        data.current['y'].push(y);
        data.current['z'].push(z);
        data.current['timestamp'].push(Date.now());
    }

    // Set the sensor update interval
    MagnetometerUncalibrated.setUpdateInterval(delay);

    // Hook to handle sensor subscription when screen is focused
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                try {
                    // Request permission to use the uncalibrated magnetometer
                    let permissionStatus = await MagnetometerUncalibrated.requestPermissionsAsync();
                    if (permissionStatus.status !== 'granted') {
                        setErrorMsg('Please provide permission to access Magnetometer');
                        return;
                    }

                    setStatus(true);
                    setErrorMsg(null);

                    // Subscribe to magnetometer data updates
                    subscription.current = MagnetometerUncalibrated.addListener((magnetometerData) => {
                        if (isActive) {
                            setData(magnetometerData);
                        }
                    });
                } catch (e) {
                    setErrorMsg('An error occurred while requesting Magnetometer permission');
                }
            })();

            // Cleanup the subscription on unfocus/unmount
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
                <Text style={styles.title}>Magnetometer (Uncalibrated)</Text>
            </View>

            {/* Display sensor values if no error */}
            {!errorMsg && (
                <>
                    <View style={styles.subContainer}>
                        <View style={styles.sensorImageView}>
                            <Image
                                style={styles.sensorImage}
                                source={require('../assets/magnatometer-unc-sensor.png')}
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

            {/* Display error message if permission is denied or an error occurred */}
            {errorMsg && (
                <View style={styles.errorView}>
                    <Text>{errorMsg}</Text>
                </View>
            )}
        </View>
    );
}
