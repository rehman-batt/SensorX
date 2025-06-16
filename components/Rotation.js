import { Text, View, Image } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { styles } from '../styles/SensorStyles';
import { DeviceMotion } from 'expo-sensors';
import { useFocusEffect } from '@react-navigation/native';

export default function Rotation({ delay, collectData, data }) {
    // State to track permission status
    const [status, setStatus] = useState(false);

    // Error message to display in case of permission issues or failures
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access device motion');

    // State for rotation angles in degrees (alpha, beta, gamma)
    const [{ alpha, beta, gamma }, setData] = useState({
        alpha: 0,
        beta: 0,
        gamma: 0,
    });

    // Ref to hold DeviceMotion subscription so it can be removed later
    const subscription = useRef(null);

    // If data collection is enabled and permission is granted, store rotation values in shared `data` ref
    if (collectData && status) {
        data.current['alpha'].push(alpha);
        data.current['beta'].push(beta);
        data.current['gamma'].push(gamma);
        data.current['timestamp'].push(Date.now());
    }

    // Set the update interval for receiving motion data
    DeviceMotion.setUpdateInterval(delay);

    // Setup and teardown the DeviceMotion listener on screen focus/unfocus
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                try {
                    // Request permission to access motion sensors
                    let permissionStatus = await DeviceMotion.requestPermissionsAsync();
                    if (permissionStatus.status !== 'granted') {
                        setErrorMsg('Please provide permission to access device motion');
                        return;
                    }

                    // Permission granted: update state
                    setStatus(true);
                    setErrorMsg(null);

                    // Start listening to rotation data
                    subscription.current = DeviceMotion.addListener(motionData => {
                        try {
                            if (motionData.rotation) {
                                setData(motionData.rotation);
                            }
                        } catch (e) {
                            setErrorMsg('An error occurred while processing device motion data');
                        }
                    });
                } catch (e) {
                    setErrorMsg('An error occurred while requesting device motion permission');
                }
            })();

            // Cleanup function to remove listener on screen blur/unmount
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
                <Text style={styles.title}>Rotation</Text>
            </View>

            {/* Show data if no error */}
            {!errorMsg &&
                <>
                    <View style={styles.subContainer}>
                        <View style={styles.sensorImageView}>
                            <Image
                                style={styles.sensorImage}
                                source={require('../assets/rotation.png')}
                            />
                        </View>
                        <View style={styles.valueContainer}>
                            {/* Alpha angle */}
                            <View>
                                <Text style={styles.valueTitle}>alpha</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.value}>{alpha.toFixed(2)}</Text>
                                    <Text style={styles.unit}>deg</Text>
                                </View>
                            </View>

                            {/* Beta angle */}
                            <View>
                                <Text style={styles.valueTitle}>beta</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.value}>{beta.toFixed(2)}</Text>
                                    <Text style={styles.unit}>deg</Text>
                                </View>
                            </View>

                            {/* Gamma angle */}
                            <View>
                                <Text style={styles.valueTitle}>gamma</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.value}>{gamma.toFixed(2)}</Text>
                                    <Text style={styles.unit}>deg</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </>
            }

            {/* Display error if present */}
            {errorMsg &&
                <View style={styles.errorView}>
                    <Text>{errorMsg}</Text>
                </View>
            }
        </View>
    );
}
