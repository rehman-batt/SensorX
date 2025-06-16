import { Text, View, Image } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { styles } from '../styles/SensorStyles';
import { DeviceMotion } from 'expo-sensors';
import { useFocusEffect } from '@react-navigation/native';

export default function MotionAcc({ delay, collectData, data }) {
    // State to track permission and error
    const [status, setStatus] = useState(false);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access device motion');

    // State to store motion values
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });

    // Ref to manage subscription lifecycle
    const subscription = useRef(null);

    // If data collection is enabled and permission granted, push current values
    if (collectData && status) {
        data.current['x'].push(x);
        data.current['y'].push(y);
        data.current['z'].push(z);
        data.current['timestamp'].push(Date.now());
    }

    // Set device motion update interval
    DeviceMotion.setUpdateInterval(delay);

    // Manage permission and listener lifecycle using useFocusEffect
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                try {
                    // Request permission
                    let permissionStatus = await DeviceMotion.requestPermissionsAsync();
                    if (permissionStatus.status !== 'granted') {
                        setErrorMsg('Please provide permission to access device motion');
                        return;
                    }

                    setStatus(true);
                    setErrorMsg(null);

                    // Start listening to motion data
                    subscription.current = DeviceMotion.addListener(motionData => {
                        try {
                            if (isActive && motionData.acceleration) {
                                setData(motionData.acceleration);
                            }
                        } catch (e) {
                            setErrorMsg('An error occurred while accessing device motion data');
                        }
                    });
                } catch (e) {
                    setErrorMsg('An error occurred while requesting device motion permission');
                }
            })();

            // Cleanup listener on blur/unmount
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
                <Text style={styles.title}>Acceleration</Text>
            </View>

            {!errorMsg ? (
                // Render acceleration data if permission granted
                <View style={styles.subContainer}>
                    <View style={styles.sensorImageView}>
                        <Image
                            style={styles.sensorImage}
                            source={require('../assets/acceleration.png')}
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
            ) : (
                // Show error if permission not granted or any error occurs
                <View style={styles.errorView}>
                    <Text>{errorMsg}</Text>
                </View>
            )}
        </View>
    );
}
