import { Text, View, Image } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import { useState, useEffect } from 'react';
import { styles } from '../styles/SensorStyles';

export default function Gyro({ delay, collectData }) {

    const [dataStream, setDataStream] = useState([]);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access Gyroscope');
    const [{ x, y, z }, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [subscription, setSubscription] = useState(null);
    const [status, setStatus] = useState('denied');

    Gyroscope.setUpdateInterval(delay);

    useEffect(() => {
        (async () => {
            let { status } = await Gyroscope.requestPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Please provide permission to access device motion');
                return;
            }
            else {
                setStatus('granted');
                setErrorMsg(null);

                setSubscription(
                    Gyroscope.addListener(
                        (gyroscopeData) => {
                            setData(gyroscopeData);
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
            {!errorMsg &&
                <>
                    <View style={styles.titleView}>
                        <Text style={styles.title}>Gyroscope</Text>
                    </View>
                    <View style={styles.subContainer}>
                        <View style={styles.sensorImageView}>
                            <Image
                                style={styles.sensorImage}
                                source={require('../assets/gyroscope-sensor.png')}
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
                errorMsg && <Text>{errorMsg}</Text>
            }

        </View>

    );
}


