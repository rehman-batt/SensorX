import { Text, View, Image } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/SensorStyles';

export default function Gyro({ delay, collectData, data }) {

    const [status, setStatus] = useState(false);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access Gyroscope');
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
    const subscription = useRef(null);

    if (collectData && status) {
        data.current['x'].push(x);
        data.current['y'].push(y);
        data.current['z'].push(z);
        data.current['timestamp'].push(Date.now());
    }

    Gyroscope.setUpdateInterval(delay);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                let permissionStatus = await Gyroscope.requestPermissionsAsync();
                if (permissionStatus.status !== 'granted') {
                    setErrorMsg('Please provide permission to access Gyroscope');
                    return;
                } else {
                    setStatus(true);
                    setErrorMsg(null);

                    subscription.current = Gyroscope.addListener((gyroscopeData) => {
                        if (isActive) {
                            setData(gyroscopeData);
                        }
                    });
                }
            })();

            return () => {
                isActive = false;
                if (subscription.current) {
                    console.log('Gyroscope listener removed');
                    subscription.current.remove();
                    subscription.current = null;
                }
            };
        }, [delay, collectData, status])
    );

    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.title}>Gyroscope</Text>
            </View>
            {!errorMsg && (
                <>
                    <View style={styles.subContainer}>
                        <View style={styles.sensorImageView}>
                            <Image
                                style={styles.sensorImage}
                                source={require('../assets/gyroscope-sensor.png')}
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
            )}

            {errorMsg && (
                <View style={styles.errorView}>
                    <Text>{errorMsg}</Text>
                </View>
            )}
        </View>
    );
}
