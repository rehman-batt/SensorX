import { Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { styles } from '../styles/SensorStyles';
import { DeviceMotion } from 'expo-sensors';


export default function MotionAcc({ delay }) {


    const [errorMsg, setErrorMsg] = useState('Please provide permission to access device motion');
    const [{ x, y, z }, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
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
                        setData(motionData.acceleration);
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
