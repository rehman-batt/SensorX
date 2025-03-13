import { Text, View, Image } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { styles } from '../styles/SensorStyles';
import { DeviceMotion } from 'expo-sensors';
import { useFocusEffect } from '@react-navigation/native';


export default function Rotation({ delay, collectData, data }) {

    const [status, setStatus] = useState(false);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access device motion');
    const [{ alpha, beta, gamma }, setData] = useState({
        alpha: 0,
        beta: 0,
        gamma: 0,
    });

    const subscription = useRef(null);

    if (collectData && status) {

        data.current['alpha'].push(alpha);
        data.current['beta'].push(beta);
        data.current['gamma'].push(gamma);
        data.current['timestamp'].push(Date.now());
    }

    DeviceMotion.setUpdateInterval(delay);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            
            (async () => {
                try {
                    let permissionStatus = await DeviceMotion.requestPermissionsAsync();
                    if (permissionStatus.status !== 'granted') {
                        setErrorMsg('Please provide permission to access device motion');
                        return;
                    } else {
                        setStatus(true);
                        setErrorMsg(null);
            
                        subscription.current = DeviceMotion.addListener(motionData => {
                            try {
                                if (motionData.rotation) {
                                    setData(motionData.rotation);
                                } 
                            } catch (e) {
                                
                                setErrorMsg('An error occurred while processing device motion data');
                            }
                        });
                    }
                } catch (e) {
                    setErrorMsg('An error occurred while requesting device motion permission');
                }
            })();
            

            return () => {
                isActive = false;
                if (subscription.current) {
                    // console.log('Motion Acceleration listener removed');
                    subscription.current.remove();
                    subscription.current = null;
                }
            };
        }, [delay, collectData, status])
    );

    

    return (

        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.title}>Rotation</Text>
            </View>
            {!errorMsg &&
                <>
                    <View style={styles.subContainer}>
                        <View style={styles.sensorImageView}>
                            <Image
                                style={styles.sensorImage}
                                source={require('../assets/rotation.png')}
                            />
                        </View>
                        <View style={styles.valueContainer}>
                            <View>
                                <Text style={styles.valueTitle}>alpha</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.value}>
                                        {alpha.toFixed(2)}
                                    </Text>
                                    <Text style={styles.unit}>deg</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.valueTitle}>beta</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.value}>
                                        {beta.toFixed(2)}
                                    </Text>
                                    <Text style={styles.unit}>deg</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.valueTitle}>gamma</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.value}>
                                        {gamma.toFixed(2)}
                                    </Text>
                                    <Text style={styles.unit}>deg</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </>
            }

            {
                errorMsg &&
                <View style={styles.errorView}>
                    <Text>{errorMsg}</Text>
                </View>
            }

        </View>


    );
}
