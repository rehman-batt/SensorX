import { Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { styles } from '../styles/SensorStyles';
import { DeviceMotion } from 'expo-sensors';


export default function MotionAcc({ delay }) {

    const [dataStream, setDataStream] = useState([]);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access device motion');
    const [{ x, y, z }, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [subscription, setSubscription] = useState(null);
    DeviceMotion.setUpdateInterval(delay);

    useEffect(() => {
        (async () => {

            let { status } = await DeviceMotion.requestPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Please provide permission to access device motion');
                return;
            }
            else {
                setErrorMsg(null);

                setSubscription(
                    DeviceMotion.addListener(motionData => {
                        if (dataStream.length == 50) {
                            setDataStream([]);
                        }
                        setDataStream((old) => [...old, motionData]);

                        if (motionData.acceleration) {
                            setData(motionData.acceleration);
                        } else {
                            setData({
                                x: 0,
                                y: 0,
                                z: 0,
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
            {!errorMsg &&
                <>
                    <Text style={styles.title}>Motion</Text>
                    <Text>
                        X: {x && x.toFixed(2)}
                    </Text>
                    <Text>
                        Y: {y && y.toFixed(2)}
                    </Text>
                    <Text>
                        Z: {z && z.toFixed(2)}
                    </Text>

                </>
            }

            {
                errorMsg && <Text>{errorMsg}</Text>
            }

        </View>

    );
}
