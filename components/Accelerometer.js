// Import core React Native components and required libraries
import { Text, View, Image } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/SensorStyles';

export default function Accelero({ delay, collectData, data }) {
    // State to track accelerometer access status and errors
    const [status, setStatus] = useState(false);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access Accelerometer');

    // State to hold current x, y, z readings
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });

    // Reference to accelerometer subscription
    const subscription = useRef(null);

    // Push latest readings to the shared data ref if collection is enabled
    if (collectData && status) {
        data.current['x'].push(x);
        data.current['y'].push(y);
        data.current['z'].push(z);
        data.current['timestamp'].push(Date.now());
    }

    // Set accelerometer update interval based on passed delay
    Accelerometer.setUpdateInterval(delay);

    // Set up accelerometer listener when component is focused
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                try {
                    // Request accelerometer permission
                    let permissionStatus = await Accelerometer.requestPermissionsAsync();
                    if (permissionStatus.status !== 'granted') {
                        setErrorMsg('Please provide permission to access Accelerometer');
                        return;
                    }

                    setStatus(true);
                    setErrorMsg(null);

                    // Start listening to accelerometer data
                    subscription.current = Accelerometer.addListener((accelerometerData) => {
                        if (isActive) {
                            setData(accelerometerData);
                        }
                    });
                } catch (e) {
                    setErrorMsg('An Error Occurred while requesting Accelerometer permission');
                }
            })();

            // Clean up subscription on unmount or blur
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
            <View style={styles.titleView}>
                <Text style={styles.title}>Accelerometer</Text>
            </View>

            {/* Display live accelerometer data if no error */}
            {!errorMsg && (
                <>
                    <View style={styles.subContainer}>
                        <View style={styles.sensorImageView}>
                            <Image
                                style={styles.sensorImage}
                                source={require('../assets/accelerometer-sensor.png')}
                            />
                        </View>
                        <View style={styles.valueContainer}>
                            <View>
                                <Text style={styles.valueTitle}>x-axis</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.value}>{x.toFixed(2)}</Text>
                                    <Text style={styles.unit}>m/s²</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.valueTitle}>y-axis</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.value}>{y.toFixed(2)}</Text>
                                    <Text style={styles.unit}>m/s²</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.valueTitle}>z-axis</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.value}>{z.toFixed(2)}</Text>
                                    <Text style={styles.unit}>m/s²</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </>
            )}

            {/* Show error message if permission is denied or other error occurs */}
            {errorMsg && (
                <View style={styles.errorView}>
                    <Text>{errorMsg}</Text>
                </View>
            )}
        </View>
    );
}
