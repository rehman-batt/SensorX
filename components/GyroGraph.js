import { Text, View, Image } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/SensorStyles';
import LiveChart from "../components/Chart";

export default function GyroGraph({ }) {
    const [status, setStatus] = useState(false);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access Gyroscope');
    const [gyroData, setGyroData] = useState({
        x: Array(10).fill(0),
        y: Array(10).fill(0),
        z: Array(10).fill(0),
    });

    const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;
    const subscription = useRef(null);

    Gyroscope.setUpdateInterval(1000);

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

                    subscription.current = Gyroscope.addListener(({ x, y, z }) => {
                        if (isActive) {
                            setGyroData((prevData) => ({
                                x: [...prevData.x.slice(-9), roundToTwoDecimals(x)],
                                y: [...prevData.y.slice(-9), roundToTwoDecimals(y)],
                                z: [...prevData.z.slice(-9), roundToTwoDecimals(z)],
                            }));
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
                    <Text style={styles.GraphTitle}>Gyroscope</Text>
                    <LiveChart name1={'X-axis'} data1={gyroData.x} name2={'Y-axis'} data2={gyroData.y} name3={'Z-axis'} data3={gyroData.z} />

                </View>
            }

        </View>
    );
}
