import { Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { styles } from '../styles/SensorStyles';
import { DeviceMotion } from 'expo-sensors';


export default function Rotation({ delay }) {


    const [errorMsg, setErrorMsg] = useState('Please provide permission to access device motion');
    const [{ alpha, beta, gamma }, setData] = useState({
        alpha: 0,
        beta: 0,
        gamma: 0,
    });

    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        (async () => {

            let { status } = await DeviceMotion.getPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Please provide permission to access device motion');
                return;
            }
            else {
                setErrorMsg(null);
                DeviceMotion.setUpdateInterval(delay);

                setSubscription(
                    DeviceMotion.addListener(motionData => {
                        setData(motionData.rotation);
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
