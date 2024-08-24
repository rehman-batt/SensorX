import { Text, View, Image } from 'react-native';
import { MagnetometerUncalibrated } from 'expo-sensors';
import { useState, useEffect } from 'react';
import { styles } from '../styles/SensorStyles';

export default function MagnetUnc({delay}) {

    const [dataStream, setDataStream] = useState([]);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access Magnetometer');
    const [{ x, y, z }, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [subscription, setSubscription] = useState(null);
    MagnetometerUncalibrated.setUpdateInterval(delay);

    useEffect(() => {
        (async () => {
            let { status } = await MagnetometerUncalibrated.requestPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Please provide permission to access Magnetometer');
                return;
            }
            else {
                setErrorMsg(null);

                setSubscription(
                    MagnetometerUncalibrated.addListener(
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
                    <Text style={styles.title}>MagnetometerUncalibrated</Text>
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


