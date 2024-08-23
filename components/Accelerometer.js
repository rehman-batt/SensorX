import { Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { useState, useEffect } from 'react';
import { styles } from '../styles/SensorStyles';

export default function Accelero({ delay }) {

    const [dataStream, setDataStream] = useState([]);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access device motion');
    const [{ x, y, z }, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [subscription, setSubscription] = useState(null);

    Accelerometer.setUpdateInterval(delay);

    useEffect(() => {
        (async () => {

            let { status } = await Accelerometer.requestPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Please provide permission to access Accelerometer');
                return;
            }
            else {
                setErrorMsg(null);

                setSubscription(
                    Accelerometer.addListener(
                        (accelerometerData) => {
                            
                            if (dataStream.length == 50) {
                                console.log(dataStream);
                                setDataStream([]);
                            }
                            setDataStream((old) => [...old, accelerometerData]);

                            setData(accelerometerData);
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
                    <Text style={styles.title}>Accelerometer</Text>
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