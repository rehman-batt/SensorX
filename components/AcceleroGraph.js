import { Text, View, Image } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/SensorStyles';
import LiveChart from "../components/Chart";

export default function AcceleroGraph({ }) {
    const [status, setStatus] = useState(false);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access Accelerometer');
    const [accelerometerData, setAccelerometerData] = useState({
        x: Array(10).fill(0),
        y: Array(10).fill(0),
        z: Array(10).fill(0),
    });

    const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;
    const subscription = useRef(null);

    Accelerometer.setUpdateInterval(1000);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                let permissionStatus = await Accelerometer.requestPermissionsAsync();
                if (permissionStatus.status !== 'granted') {
                    setErrorMsg('Please provide permission to access Accelerometer');
                    return;
                } else {
                    setStatus(true);
                    setErrorMsg(null);
                    
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
            })();

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
                    <Text style={styles.GraphTitle}>Accelerometer</Text>
                    <LiveChart name1={'X-axis'} data1={accelerometerData.x} name2={'Y-axis'} data2={accelerometerData.y} name3={'Z-axis'} data3={accelerometerData.z}/>
                    
                </View>
            }

        </>
    );
}
