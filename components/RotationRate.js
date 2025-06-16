import { Text, View, Image } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { styles } from '../styles/SensorStyles';
import { DeviceMotion } from 'expo-sensors';
import { useFocusEffect } from '@react-navigation/native';

export default function RotationRate({ delay, collectData, data }) {
    // Track whether permission was granted
    const [status, setStatus] = useState(false);

    // Display this if permission is not granted or an error occurs
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access device motion');

    // State to store latest rotation rate values (alpha, beta, gamma)
    const [{ alpha, beta, gamma }, setData] = useState({
        alpha: 0,
        beta: 0,
        gamma: 0,
    });

    // Ref to store the DeviceMotion subscription so it can be removed later
    const subscription = useRef(null);

    // If data collection is enabled and permission granted, save values
    if (collectData && status) {
        data.current['alpha'].push(alpha);
        data.current['beta'].push(beta);
        data.current['gamma'].push(gamma);
        data.current['timestamp'].push(Date.now());
    }

    // Set device motion update frequency based on `delay` prop
    DeviceMotion.setUpdateInterval(delay);

    // Start sensor listener when screen is focused
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                try {
                    // Request permission to access device motion
                    let permissionStatus = await DeviceMotion.requestPermissionsAsync();
                    if (permissionStatus.status !== 'granted') {
                        setErrorMsg('Please provide permission to access device motion');
                        return;
                    } else {
                        setStatus(true);
                        setErrorMsg(null);

                        // Subscribe to rotationRate updates from DeviceMotion
                        subscription.current = DeviceMotion.addListener(motionData => {
                            try {
                                if (motionData.rotation) {
                                    // Update state with new rotation rate values
                                    setData(motionData.rotationRate);
                                }
                            } catch (e) {
                                setErrorMsg('An error occurred while processing device motion data');
                            }
                        });
                    }
                } catch (e) {
                    setErrorMsg('An error occurred while requesting device motion permission');
                }
            })();

            // Cleanup listener when screen is unfocused or component unmounts
            return () => {
                isActive = false;
                if (subscription.current) {
                    subscription.current.remove();
                    subscription.current = null;
                }
            };
        }, [delay, collectData, status]) // Re-run when these values change
    );

    return (
        <View style={styles.container}>
            {/* Title section */}
            <View style={styles.titleView}>
                <Text style={styles.title}>Rotation Rate</Text>
            </View>

            {/* Sensor data or error display */}
            {!errorMsg &&
                <>
                    <View style={styles.subContainer}>
                        {/* Sensor image */}
                        <View style={styles.sensorImageView}>
                            <Image
                                style={styles.sensorImage}
                                source={require('../assets/rotationrate.png')}
                            />
                        </View>

                        {/* Rotation rate values */}
                        <View style={styles.valueContainer}>
                            <View>
                                <Text style={styles.valueTitle}>alpha</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.value}>
                                        {alpha.toFixed(2)}
                                    </Text>
                                    <Text style={styles.unit}>deg/s</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.valueTitle}>beta</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.value}>
                                        {beta.toFixed(2)}
                                    </Text>
                                    <Text style={styles.unit}>deg/s</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.valueTitle}>gamma</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.value}>
                                        {gamma.toFixed(2)}
                                    </Text>
                                    <Text style={styles.unit}>deg/s</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </>
            }

            {/* Error display */}
            {errorMsg &&
                <View style={styles.errorView}>
                    <Text>{errorMsg}</Text>
                </View>
            }
        </View>
    );
}
