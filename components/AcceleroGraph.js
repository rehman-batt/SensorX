// Import necessary components and libraries
import { Text, View, Image } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/SensorStyles';
import LiveChart from "../components/Chart";

export default function AcceleroGraph({ }) {
    // State to track permission status and errors
    const [status, setStatus] = useState(false);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access Accelerometer');

    // State to store last 10 accelerometer readings for each axis
    const [accelerometerData, setAccelerometerData] = useState({
        x: Array(10).fill(0),
        y: Array(10).fill(0),
        z: Array(10).fill(0),
    });

    // Utility to round readings to 2 decimal places
    const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;

    // Reference to the accelerometer listener subscription
    const subscription = useRef(null);

    // Set sensor update interval to 1000ms (1 second)
    Accelerometer.setUpdateInterval(1000);

    // Hook that runs when the screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                try {
                    // Request permission to access the accelerometer
                    let permissionStatus = await Accelerometer.requestPermissionsAsync();
                    if (permissionStatus.status !== 'granted') {
                        setErrorMsg('Please provide permission to access Accelerometer');
                        return;
                    } else {
                        setStatus(true);
                        setErrorMsg(null);

                        // Start listening to accelerometer data
                        subscription.current = Accelerometer.addListener(({ x, y, z }) => {
                            if (isActive) {
                                setAccelerometerData((prevData) => ({
                                    x: [...prevData.x.slice(-9), roundToTwoDecimals(x)],
                                    y: [...prevData.y.slice(-9), roundToTwoDecimals(y)],
                                    z: [...prevData.z.slice(-9), roundToTwoDecimals(z)],
                                }));
                            }
                        });
                    }
                } catch (e) {
                    setErrorMsg('An error occurred while accessing the accelerometer');
                }
            })();

            // Cleanup listener when component loses focus
            return () => {
                isActive = false;
                if (subscription.current) {
                    console.log('Accelerometer listener removed');
                    subscription.current.remove();
                    subscription.current = null;
                }
            };
        }, [])
    );

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            {/* Display error message if permission is not granted or any error occurs */}
            {errorMsg &&
                <View style={styles.errorContainer}>
                    <View style={styles.errorView}>
                        <Text style={styles.errorText}>{errorMsg}</Text>
                    </View>
                </View>
            }

            {/* Display accelerometer graph when data is available */}
            {!errorMsg &&
                <View style={styles.GraphContainer}>
                    <Text style={styles.GraphTitle}>Accelerometer</Text>
                    <LiveChart
                        name1={'X-axis'} data1={accelerometerData.x}
                        name2={'Y-axis'} data2={accelerometerData.y}
                        name3={'Z-axis'} data3={accelerometerData.z}
                    />
                </View>
            }
        </View>
    );
}
