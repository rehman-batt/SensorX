import { Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { styles } from '../styles/SensorStyles';
import { DeviceMotion } from 'expo-sensors';


export default function Rotation({ delay }) {

    const [dataStream, setDataStream] = useState([]);
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access device motion');
    const [{ alpha, beta, gamma }, setData] = useState({
        alpha: 0,
        beta: 0,
        gamma: 0,
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
                            // console.log('yes');
                            setDataStream([]);
                        }
                        setDataStream((old) => [...old, motionData]);

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
            {!errorMsg &&
                <>
                    <Text style={styles.title}>Rotation</Text>
                    <Text>
                        Alpha: {alpha && alpha.toFixed(2)}
                    </Text>
                    <Text>
                        Beta: {beta && beta.toFixed(2)}
                    </Text>
                    <Text>
                        Gamma: {gamma && gamma.toFixed(2)}
                    </Text>

                </>
            }

            {
                errorMsg && <Text>{errorMsg}</Text>
            }

        </View>

    );
}
