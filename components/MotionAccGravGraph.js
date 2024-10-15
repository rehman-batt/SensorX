import { Text, View } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/SensorStyles';
import LiveChart from "../components/Chart";

export default function MotionAccGravGraph({ }) {
    const [status, setStatus] = useState(false);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access DeviceMotion');
    const [motionAccData, setMotionAccData] = useState({
        x: Array(10).fill(0),
        y: Array(10).fill(0),
        z: Array(10).fill(0),
    });

    const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;
    const subscription = useRef(null);

    DeviceMotion.setUpdateInterval(1000);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                let permissionStatus = await DeviceMotion.requestPermissionsAsync();
                if (permissionStatus.status !== 'granted') {
                    setErrorMsg('Please provide permission to access DeviceMotion');
                    return;
                } else {
                    setStatus(true);
                    setErrorMsg(null);

                    subscription.current = DeviceMotion.addListener(motionData => {
                        if (isActive && motionData.accelerationIncludingGravity) {

                            setMotionAccData((prevData) => ({
                                x: [...prevData.x.slice(-9), roundToTwoDecimals(motionData.accelerationIncludingGravity.x)],
                                y: [...prevData.y.slice(-9), roundToTwoDecimals(motionData.accelerationIncludingGravity.y)],
                                z: [...prevData.z.slice(-9), roundToTwoDecimals(motionData.accelerationIncludingGravity.z)],
                            }));
                        }

                    });
                }
            })();

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
            {errorMsg &&
                <View style={styles.errorContainer}>
                    <View style={styles.errorView}>
                        <Text style={styles.errorText}>{errorMsg}</Text>
                    </View>
                </View>
            }

            {!errorMsg &&
                <View style={styles.GraphContainer}>
                    <Text style={styles.GraphTitle}>Motion Acceleration (Gravity)</Text>
                    <LiveChart name1={'X-axis'} data1={motionAccData.x} name2={'Y-axis'} data2={motionAccData.y} name3={'Z-axis'} data3={motionAccData.z} />

                </View>
            }

        </View>
    );
}
