import { Text, View, Image } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { styles } from '../styles/SensorStyles';
import { DeviceMotion } from 'expo-sensors';
import { useFocusEffect } from '@react-navigation/native';

export default function MotionAccGrav({ delay, collectData, data }) {

    // Track whether permission was granted
    const [status, setStatus] = useState(false);

    // Display any permission or runtime errors
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access device motion');

    // Store current x, y, z acceleration values
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });

    // Reference to store the subscription object
    const subscription = useRef(null);

    // Collect data if allowed and permission is granted
    if (collectData && status) {
        data.current['x'].push(x);
        data.current['y'].push(y);
        data.current['z'].push(z);
        data.current['timestamp'].push(Date.now());
    }

    // Set the update interval for DeviceMotion readings
    DeviceMotion.setUpdateInterval(delay);

    // Run sensor permission and listener setup when screen is focused
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                try {
                    // Request permission to access motion sensor
                    let permissionStatus = await DeviceMotion.requestPermissionsAsync();
                    if (permissionStatus.status !== 'granted') {
                        setErrorMsg('Please provide permission to access device motion');
                        return;
                    }

                    setStatus(true);
                    setErrorMsg(null);

                    // Subscribe to DeviceMotion updates
                    subscription.current = DeviceMotion.addListener(motionData => {
                        try {
                            if (isActive && motionData.acceleration) {
                                setData(motionData.acceleration);
                            }
                        } catch (e) {
                            setErrorMsg('An error occurred while processing device motion data');
                        }
                    });
                } catch (e) {
                    setErrorMsg('An error occurred while requesting device motion permission');
                }
            })();

            // Cleanup on component blur or unmount
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
                <Text style={styles.title}>Acceleration (Gravity)</Text>
            </View>

            {/* If no error, show the sensor readings */}
            {!errorMsg &&
                <>
                    <View style={styles.subContainer}>
                        <View style={styles.sensorImageView}>
                            <Image
                                style={styles.sensorImage}
                                source={require('../assets/gravity.png')}
                            />
                        </View>
                        <View style={styles.valueContainer}>
                            <View>
                                <Text style={styles.valueTitle}>x-axis</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.value}>
                                        {x.toFixed(2)}
                                    </Text>
                                    <Text style={styles.unit}>m/s²</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.valueTitle}>y-axis</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.value}>
                                        {y.toFixed(2)}
                                    </Text>
                                    <Text style={styles.unit}>m/s²</Text>
                                </View>
                            </View>
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
            }

            {/* If error occurred, show error message */}
            {errorMsg &&
                <View style={styles.errorView}>
                    <Text>{errorMsg}</Text>
                </View>
            }
        </View>
    );
}
