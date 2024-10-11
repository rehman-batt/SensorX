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

    // console.log('Gyro Rerendered');

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
                    // console.log('Gyro Rerendered 2');
                    subscription.current = Gyroscope.addListener(({ x, y, z }) => {
                        if (isActive) {
                            setGyroData((prevData) => ({
                                x: [...prevData.x.slice(-10), roundToTwoDecimals(x)],
                                y: [...prevData.y.slice(-10), roundToTwoDecimals(y)],
                                z: [...prevData.z.slice(-10), roundToTwoDecimals(z)],
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
        <>
            {errorMsg &&
                <View style={styles.container}>
                    <View style={styles.errorView}>
                        <Text>{errorMsg}</Text>
                    </View>
                </View>
            }

            {!errorMsg &&
                <View style={styles.GraphContainer}>
                    <Text style={styles.GraphTitle}>Gyroscope</Text>
                    <LiveChart name={'X-axis'} data={gyroData.x} />
                    <LiveChart name={'Y-axis'} data={gyroData.y} />
                    <LiveChart name={'Z-axis'} data={gyroData.z} />
                </View>
            }

        </>
    );
}
