import { Text, View, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { styles } from '../styles/SensorStyles';
import { DeviceMotion } from 'expo-sensors';


export default function Rotation({ delay, collectData}) {

    const [dataStream, setDataStream] = useState([]);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access device motion');
    const [{ alpha, beta, gamma }, setData] = useState({
        alpha: 0,
        beta: 0,
        gamma: 0,
    });

    const [subscription, setSubscription] = useState(null);
    const [status, setStatus] = useState('denied');
    DeviceMotion.setUpdateInterval(delay);

    useEffect(() => {
        (async () => {

            let permissionStatus = await DeviceMotion.requestPermissionsAsync();
            if (permissionStatus.status !== 'granted') {
                setErrorMsg('Please provide permission to access device motion');
                return;
            }
            else {
                setStatus('granted');
                setErrorMsg(null);

                setSubscription(
                    DeviceMotion.addListener(motionData => {

                        if (motionData.rotation) {
                            setData(motionData.rotation);
                        } else {
                            setData({
                                alpha: 0,
                                beta: 0,
                                gamma: 0,
                            });
                        }
                    })
                );

                return () => {
                    subscription && subscription.remove();
                    setSubscription(null);
                };
            }

        })();

    }, []);

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
