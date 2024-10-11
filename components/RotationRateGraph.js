import { Text, View } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/SensorStyles';
import LiveChart from "../components/Chart";

export default function RotationRateGraph({ }) {
    const [status, setStatus] = useState(false);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access DeviceMotion');
    const [rotationData, setRotationData] = useState({
        alpha: Array(10).fill(0),
        beta: Array(10).fill(0),
        gamma: Array(10).fill(0),
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
                        if (isActive  && motionData.rotationRate) {
                
                            setRotationData((prevData) => ({
                                alpha: [...prevData.alpha.slice(-10), roundToTwoDecimals(motionData.rotationRate.alpha)],
                                beta: [...prevData.beta.slice(-10), roundToTwoDecimals(motionData.rotationRate.beta)],
                                gamma: [...prevData.gamma.slice(-10), roundToTwoDecimals(motionData.rotationRate.gamma)],
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
                    <Text style={styles.GraphTitle}>Device Rotation Rate</Text>
                    <LiveChart name={'Alpha'} data={rotationData.alpha} />
                    <LiveChart name={'Beta'} data={rotationData.beta} />
                    <LiveChart name={'Gamma'} data={rotationData.gamma} />
                </View>
            }

        </>
    );
}
