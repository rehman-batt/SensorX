import { Text, View } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import { useState, useEffect } from 'react';
import { styles } from '../styles/SensorStyles';

export default function Gyro({ delay }) {

    const [dataStream, setDataStream] = useState([]);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access Gyroscope');
    const [{ x, y, z }, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [subscription, setSubscription] = useState(null);
    Gyroscope.setUpdateInterval(delay);

    useEffect(() => {
        (async () => {
            let { status } = await Gyroscope.requestPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Please provide permission to access device motion');
                return;
            }
            else {
                setErrorMsg(null);

                setSubscription(
                    Gyroscope.addListener(
                        (gyroscopeData) => {

                            if (dataStream.length == 50) {
                                console.log(dataStream);
                                setDataStream([]);
                            }
                            setDataStream((old) => [...old, gyroscopeData]);

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
                    <Text style={styles.title}>Gyroscope</Text>
                    <Text>
                        X: {x.toFixed(2)}
                    </Text>
                    <Text>
                        Y: {y.toFixed(2)}
                    </Text>
                    <Text>
                        Z: {z.toFixed(2)}
                    </Text>
                </>
            }

            {
                errorMsg && <Text>{errorMsg}</Text>
            }

        </View>

    );
}


