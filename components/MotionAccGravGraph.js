import { Text, View } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/SensorStyles';
import LiveChart from "../components/Chart";

export default function MotionAccGravGraph({ }) {
    // Track permission status
    const [status, setStatus] = useState(false);

    // Error message if permission is denied or something fails
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access DeviceMotion');

    // Store motion acceleration (with gravity) data for x, y, z axes
    const [motionAccData, setMotionAccData] = useState({
        x: Array(10).fill(0),
        y: Array(10).fill(0),
        z: Array(10).fill(0),
    });

    // Helper to round values to 2 decimal places
    const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;

    // Reference to the motion subscription
    const subscription = useRef(null);

    // Set DeviceMotion polling interval (1 second)
    DeviceMotion.setUpdateInterval(1000);

    // Manage lifecycle: setup when screen is focused
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                try {
                    // Request permission to access motion sensors
                    let permissionStatus = await DeviceMotion.requestPermissionsAsync();
                    if (permissionStatus.status !== 'granted') {
                        setErrorMsg('Please provide permission to access DeviceMotion');
                        return;
                    }

                    setStatus(true);
                    setErrorMsg(null);

                    // Subscribe to DeviceMotion updates
                    try {
                        subscription.current = DeviceMotion.addListener(motionData => {
                            try {
                                if (isActive && motionData.accelerationIncludingGravity) {
                                    // Update chart data by appending new value and keeping latest 10 samples
                                    setMotionAccData((prevData) => ({
                                        x: [...prevData.x.slice(-9), roundToTwoDecimals(motionData.accelerationIncludingGravity.x)],
                                        y: [...prevData.y.slice(-9), roundToTwoDecimals(motionData.accelerationIncludingGravity.y)],
                                        z: [...prevData.z.slice(-9), roundToTwoDecimals(motionData.accelerationIncludingGravity.z)],
                                    }));
                                }
                            } catch (e) {
                                setErrorMsg('An error occurred while processing motion data');
                            }
                        });
                    } catch (e) {
                        setErrorMsg('An error occurred while starting DeviceMotion listener');
                    }
                } catch (e) {
                    setErrorMsg('An error occurred while requesting DeviceMotion permission');
                }
            })();

            // Clean up the subscription on unmount or blur
            return () => {
                isActive = false;
                if (subscription.current) {
                    console.log('DeviceMotion listener removed');
                    subscription.current.remove();
                    subscription.current = null;
                }
            };
        }, [])
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

            {/* Render graph if there's no error */}
            {!errorMsg &&
                <View style={styles.GraphContainer}>
                    <Text style={styles.GraphTitle}>Motion Acceleration (Gravity)</Text>
                    <LiveChart
                        name1={'X-axis'}
                        data1={motionAccData.x}
                        name2={'Y-axis'}
                        data2={motionAccData.y}
                        name3={'Z-axis'}
                        data3={motionAccData.z}
                    />
                </View>
            }
        </View>
    );
}
