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
                    <LiveChart name={'X-axis'} data={accelerometerData.x} />
                    <LiveChart name={'Y-axis'} data={accelerometerData.y} />
                    <LiveChart name={'Z-axis'} data={accelerometerData.z} />
                </View>
            }

            {/* <View style={styles.container}>
                <View style={styles.titleView}>
                    <Text style={styles.title}>Accelerometer</Text>
                </View>
                {!errorMsg && (
                    <>
                        <View style={styles.subContainer}>
                            <View style={styles.sensorImageView}>
                                <Image
                                    style={styles.sensorImage}
                                    source={require('../assets/accelerometer-sensor.png')}
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
            </View> */}
        </>
    );
}
