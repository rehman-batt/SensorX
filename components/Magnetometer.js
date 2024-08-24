import { Text, View } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import { useState, useEffect } from 'react';
import { styles } from '../styles/SensorStyles';

export default function Magnet({delay}) {

    const [dataStream, setDataStream] = useState([]);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access Magnetometer');
    const [{ x, y, z }, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [subscription, setSubscription] = useState(null);
    Magnetometer.setUpdateInterval(delay);

    useEffect(() => {
        (async () => {
            let { status } = await Magnetometer.requestPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Please provide permission to access device motion');
                return;
            }
            else {
                setErrorMsg(null);

                setSubscription(
                    Magnetometer.addListener(
                        (magnetometerData) => {

                            if (dataStream.length == 50) {
                                // console.log(dataStream);
                                setDataStream([]);
                            }
                            setDataStream((old) => [...old, magnetometerData]);

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
            {!errorMsg &&
                <>
                    <Text style={styles.title}>Magnetometer</Text>
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


