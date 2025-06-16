import { Text, View } from 'react-native'; 
import { DeviceMotion } from 'expo-sensors';
import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/SensorStyles';
import LiveChart from "../components/Chart";

export default function RotationGraph({ }) {
    // State to track permission status
    const [status, setStatus] = useState(false);

    // Error message to show if permissions or motion reading fails
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access DeviceMotion');

    // Initialize rotation values as arrays with 10 zeros for alpha, beta, gamma
    const [rotationData, setRotationData] = useState({
        alpha: Array(10).fill(0),
        beta: Array(10).fill(0),
        gamma: Array(10).fill(0),
    });

    // Helper to round values to two decimal places
    const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;

    // Store the sensor listener subscription so we can clean it up later
    const subscription = useRef(null);

    // Set sensor data update interval (in ms)
    DeviceMotion.setUpdateInterval(1000);

    // Set up sensor listener on screen focus
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                try {
                    // Ask for motion sensor permission
                    let permissionStatus = await DeviceMotion.requestPermissionsAsync();

                    if (permissionStatus.status !== 'granted') {
                        setErrorMsg('Please provide permission to access DeviceMotion');
                        return;
                    } else {
                        setStatus(true);
                        setErrorMsg(null);

                        // Subscribe to DeviceMotion updates
                        subscription.current = DeviceMotion.addListener(motionData => {
                            try {
                                if (isActive && motionData.rotation) {
                                    // Maintain a sliding window of the last 10 values for each axis
                                    setRotationData((prevData) => ({
                                        alpha: [...prevData.alpha.slice(-9), roundToTwoDecimals(motionData.rotation.alpha)],
                                        beta: [...prevData.beta.slice(-9), roundToTwoDecimals(motionData.rotation.beta)],
                                        gamma: [...prevData.gamma.slice(-9), roundToTwoDecimals(motionData.rotation.gamma)],
                                    }));
                                }
                            } catch (e) {
                                setErrorMsg('An error occurred while processing rotation data');
                            }
                        });
                    }
                } catch (e) {
                    setErrorMsg('An error occurred while requesting DeviceMotion permission');
                }
            })();

            // Cleanup listener when component unmounts or loses focus
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
            {/* If there's an error, show the message */}
            {errorMsg &&
                <View style={styles.errorContainer}>
                    <View style={styles.errorView}>
                        <Text style={styles.errorText}>{errorMsg}</Text>
                    </View>
                </View>
            }

            {/* If no error, render the live rotation graph */}
            {!errorMsg &&
                <View style={styles.GraphContainer}>
                    <Text style={styles.GraphTitle}>Device Rotation</Text>
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
