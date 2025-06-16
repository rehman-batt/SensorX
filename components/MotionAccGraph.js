import { Text, View, Image } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/SensorStyles';
import LiveChart from "../components/Chart";

export default function MotionAccGraph({ }) {
    // Track permission status
    const [status, setStatus] = useState(false);

    // Error message for permission or runtime errors
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access DeviceMotion');

    // Motion acceleration data (last 10 values for each axis)
    const [motionAccData, setMotionAccData] = useState({
        x: Array(10).fill(0),
        y: Array(10).fill(0),
        z: Array(10).fill(0),
    });

    // Utility function to round to two decimal places
    const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;

    // Reference to manage the DeviceMotion listener
    const subscription = useRef(null);

    // Set update interval for motion data (in ms)
    DeviceMotion.setUpdateInterval(1000);

    // Manage permission and sensor subscription lifecycle
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                try {
                    // Request DeviceMotion permission
                    let permissionStatus = await DeviceMotion.requestPermissionsAsync();
                    if (permissionStatus.status !== 'granted') {
                        setErrorMsg('Please provide permission to access DeviceMotion');
                        return;
                    }

                    setStatus(true);
                    setErrorMsg(null);

                    // Add listener for motion data
                    try {
                        subscription.current = DeviceMotion.addListener(motionData => {
                            if (isActive && motionData.acceleration) {
                                // Update motion data with latest reading (preserve last 9 values)
                                setMotionAccData((prevData) => ({
                                    x: [...prevData.x.slice(-9), roundToTwoDecimals(motionData.acceleration.x)],
                                    y: [...prevData.y.slice(-9), roundToTwoDecimals(motionData.acceleration.y)],
                                    z: [...prevData.z.slice(-9), roundToTwoDecimals(motionData.acceleration.z)],
                                }));
                            }
                        });
                    } catch (e) {
                        setErrorMsg('An error occurred while starting DeviceMotion listener');
                    }
                } catch (e) {
                    setErrorMsg('An error occurred while requesting DeviceMotion permission');
                }
            })();

            // Cleanup: remove listener on blur/unmount
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
            {/* Show error if permission not granted or other issue */}
            {errorMsg &&
                <View style={styles.errorContainer}>
                    <View style={styles.errorView}>
                        <Text style={styles.errorText}>{errorMsg}</Text>
                    </View>
                </View>
            }

            {/* Show live chart if permission granted and no error */}
            {!errorMsg &&
                <View style={styles.GraphContainer}>
                    <Text style={styles.GraphTitle}>Motion Acceleration</Text>
                    <LiveChart 
                        name1={'X-axis'} data1={motionAccData.x}
                        name2={'Y-axis'} data2={motionAccData.y}
                        name3={'Z-axis'} data3={motionAccData.z}
                    />
                </View>
            }
        </View>
    );
}
