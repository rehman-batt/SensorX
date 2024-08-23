import { Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { styles } from '../styles/SensorStyles';
import { DeviceMotion } from 'expo-sensors';


export default function RotationRate({ delay }) {

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
                            console.log(dataStream);
                            setDataStream([]);
                        }
                        setDataStream((old) => [...old, motionData]);

                        setData(motionData.rotationRate);
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
                    <Text style={styles.title}>Rotation Rate</Text>
                    <Text>
                        Alpha: {alpha.toFixed(2)}
                    </Text>
                    <Text>
                        Beta: {beta.toFixed(2)}
                    </Text>
                    <Text>
                        Gamma: {gamma.toFixed(2)}
                    </Text>

                </>
            }

            {
                errorMsg && <Text>{errorMsg}</Text>
            }

        </View>

    );
}
