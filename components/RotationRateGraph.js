import { Text, View } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/SensorStyles';
import LiveChart from "../components/Chart";

export default function RotationRateGraph({ }) {
    // Track permission status
    const [status, setStatus] = useState(false);

    // Holds any error messages (e.g., permission issues)
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access DeviceMotion');

    // Store the last 10 values of rotationRate for each axis
    const [rotationData, setRotationData] = useState({
        alpha: Array(10).fill(0),
        beta: Array(10).fill(0),
        gamma: Array(10).fill(0),
    });

    // Helper to round values to two decimal places
    const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;

    // Ref to hold the DeviceMotion listener so it can be removed
    const subscription = useRef(null);

    // Set update interval to 1 second (1000ms)
    DeviceMotion.setUpdateInterval(1000);

    // Handle subscription and cleanup when screen gains or loses focus
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                try {
                    // Request permission for device motion access
                    let permissionStatus = await DeviceMotion.requestPermissionsAsync();
                    if (permissionStatus.status !== 'granted') {
                        setErrorMsg('Please provide permission to access DeviceMotion');
                        return;
                    } else {
                        setStatus(true);
                        setErrorMsg(null);

                        try {
                            // Start listening to rotationRate data
                            subscription.current = DeviceMotion.addListener(motionData => {
                                try {
                                    if (isActive && motionData.rotationRate) {
                                        // Push new values while keeping array length at 10
                                        setRotationData((prevData) => ({
                                            alpha: [...prevData.alpha.slice(-9), roundToTwoDecimals(motionData.rotationRate.alpha)],
                                            beta:  [...prevData.beta.slice(-9),  roundToTwoDecimals(motionData.rotationRate.beta)],
                                            gamma: [...prevData.gamma.slice(-9), roundToTwoDecimals(motionData.rotationRate.gamma)],
                                        }));
                                    }
                                } catch (e) {
                                    setErrorMsg('An error occurred while processing rotation data');
                                }
                            });
                        } catch (e) {
                            setErrorMsg('An error occurred while setting up DeviceMotion listener');
                        }
                    }
                } catch (e) {
                    setErrorMsg('An error occurred while requesting DeviceMotion permission');
                }
            })();

            // Cleanup listener when component unmounts or screen loses focus
            return () => {
                isActive = false;
                if (subscription.current) {
                    console.log('DeviceMotion listener removed');
                    subscription.current.remove();
                    subscription.current = null;
                }
            };
        }, []) // Run once when screen is focused
    );

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            {/* Show error if any */}
            {errorMsg &&
                <View style={styles.errorContainer}>
                    <View style={styles.errorView}>
                        <Text style={styles.errorText}>{errorMsg}</Text>
                    </View>
                </View>
            }

            {/* Display live chart when there's no error */}
            {!errorMsg &&
                <View style={styles.GraphContainer}>
                    <Text style={styles.GraphTitle}>Device Rotation Rate</Text>
                    <LiveChart
                        name1={'Alpha'} data1={rotationData.alpha}
                        name2={'Beta'} data2={rotationData.beta}
                        name3={'Gamma'} data3={rotationData.gamma}
                    />
                </View>
            }
        </View>
    );
}
