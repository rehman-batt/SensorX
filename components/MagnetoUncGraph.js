import { Text, View, Image } from 'react-native';
import { MagnetometerUncalibrated } from 'expo-sensors';
import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/SensorStyles';
import LiveChart from "../components/Chart";

export default function MagnetoUncGraph({ }) {
    // Track permission status and error message
    const [status, setStatus] = useState(false);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access MagnetometerUncalibrated');

    // Store rolling magnetometer data (last 10 values)
    const [magnatoData, setmagnatoData] = useState({
        x: Array(10).fill(0),
        y: Array(10).fill(0),
        z: Array(10).fill(0),
    });

    // Helper to round values to 2 decimal places
    const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;

    // Ref to hold the magnetometer subscription instance
    const subscription = useRef(null);

    // Set update frequency for the sensor (1 reading per second)
    MagnetometerUncalibrated.setUpdateInterval(1000);

    // Handle mounting/unmounting with focus-aware effect
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                try {
                    // Request permission to use the sensor
                    let permissionStatus = await MagnetometerUncalibrated.requestPermissionsAsync();
                    if (permissionStatus.status !== 'granted') {
                        setErrorMsg('Please provide permission to access MagnetometerUncalibrated');
                        return;
                    }

                    setStatus(true);
                    setErrorMsg(null);

                    // Subscribe to sensor updates
                    subscription.current = MagnetometerUncalibrated.addListener(({ x, y, z }) => {
                        if (isActive) {
                            setmagnatoData((prevData) => ({
                                x: [...prevData.x.slice(-9), roundToTwoDecimals(x)],
                                y: [...prevData.y.slice(-9), roundToTwoDecimals(y)],
                                z: [...prevData.z.slice(-9), roundToTwoDecimals(z)],
                            }));
                        }
                    });
                } catch (e) {
                    setErrorMsg('An error occurred while requesting MagnetometerUncalibrated permission');
                }
            })();

            // Clean up the sensor listener on unmount or unfocus
            return () => {
                isActive = false;
                if (subscription.current) {
                    console.log('MagnetometerUncalibrated listener removed');
                    subscription.current.remove();
                    subscription.current = null;
                }
            };
        }, [])
    );

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            {/* Display error message if permission or listener failed */}
            {errorMsg &&
                <View style={styles.errorContainer}>
                    <View style={styles.errorView}>
                        <Text style={styles.errorText}>{errorMsg}</Text>
                    </View>
                </View>
            }

            {/* If no error, show the live magnetometer graph */}
            {!errorMsg &&
                <View style={styles.GraphContainer}>
                    <Text style={styles.GraphTitle}>Magnetometer Uncalibrated</Text>
                    <LiveChart 
                        name1={'X-axis'} data1={magnatoData.x}
                        name2={'Y-axis'} data2={magnatoData.y}
                        name3={'Z-axis'} data3={magnatoData.z}
                    />
                </View>
            }
        </View>
    );
}
