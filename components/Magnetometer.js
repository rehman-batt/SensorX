import { Text, View, Image } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import { useState, useEffect } from 'react';
import { styles } from '../styles/SensorStyles';

export default function Magnet({ delay, collectData }) {

    const [dataStream, setDataStream] = useState([]);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access Magnetometer');
    const [{ x, y, z }, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [subscription, setSubscription] = useState(null);
    const [status, setStatus] = useState('denied');
    Magnetometer.setUpdateInterval(delay);

    useEffect(() => {
        (async () => {
            let { permissionStatus } = await Magnetometer.requestPermissionsAsync();
            if (permissionStatus !== 'granted') {
                setErrorMsg('Please provide permission to access Magnetometer');
                return;
            }
            else {
                setStatus('granted');
                setErrorMsg(null);

                setSubscription(
                    Magnetometer.addListener(
                        (magnetometerData) => {
                            setData(magnetometerData);
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
                <Text style={styles.title}>Magnetometer</Text>
            </View>
            {!errorMsg &&
                <>
                    <View style={styles.subContainer}>
                        <View style={styles.sensorImageView}>
                            <Image
                                style={styles.sensorImage}
                                source={require('../assets/magnatometer-sensor.png')}
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


