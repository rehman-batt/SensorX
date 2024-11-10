import { Text, View, Image } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/SensorStyles';
import LiveChart from "../components/Chart";

export default function MagnetoGraph({ }) {
    const [status, setStatus] = useState(false);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access Magnetometer');
    const [magnatoData, setmagnatoData] = useState({
        x: Array(10).fill(0),
        y: Array(10).fill(0),
        z: Array(10).fill(0),
    });

    const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;
    const subscription = useRef(null);

    Magnetometer.setUpdateInterval(1000);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                try {
                    let permissionStatus = await Magnetometer.requestPermissionsAsync();
                    if (permissionStatus.status !== 'granted') {
                        setErrorMsg('Please provide permission to access Magnetometer');
                        return;
                    } else {
                        setStatus(true);
                        setErrorMsg(null);

                        try {
                            subscription.current = Magnetometer.addListener(({ x, y, z }) => {
                                try {
                                    if (isActive) {
                                        setmagnatoData((prevData) => ({
                                            x: [...prevData.x.slice(-9), roundToTwoDecimals(x)],
                                            y: [...prevData.y.slice(-9), roundToTwoDecimals(y)],
                                            z: [...prevData.z.slice(-9), roundToTwoDecimals(z)],
                                        }));
                                    }
                                } catch (e) {
                                    setErrorMsg('An error occurred while processing magnetometer data');
                                }
                            });
                        } catch (e) {
                            setErrorMsg('An error occurred while starting magnetometer listener');
                        }
                    }
                } catch (e) {
                    setErrorMsg('An error occurred while requesting magnetometer permission');
                }
            })();


            return () => {
                isActive = false;

                if (subscription.current) {
                    console.log('Magnetometer listener removed');
                    subscription.current.remove();
                    subscription.current = null;
                }
            };
        }, [])
    );

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            {errorMsg &&
                <View style={styles.errorContainer}>
                    <View style={styles.errorView}>
                        <Text style={styles.errorText}>{errorMsg}</Text>
                    </View>
                </View>
            }

            {!errorMsg &&
                <View style={styles.GraphContainer}>
                    <Text style={styles.GraphTitle}>Magnetometer</Text>
                    <LiveChart name1={'X-axis'} data1={magnatoData.x} name2={'Y-axis'} data2={magnatoData.y} name3={'Z-axis'} data3={magnatoData.z} />

                </View>
            }

        </View>
    );
}
