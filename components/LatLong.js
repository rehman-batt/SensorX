import { Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { styles } from '../styles/SensorStyles';
import * as Location from 'expo-location';


export default function LatLong({updateLatLong, latitude, longitude}) {

    
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access location');

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Please provide permission to access location');
                return;
            }
            else {
                setErrorMsg(null);
            }

            let location = await Location.getCurrentPositionAsync({});

            updateLatLong(location.coords.latitude, location.coords.longitude);
           
        })();

        
    }, []);

    return (

        <View style={styles.container}>
            {!errorMsg &&
                <>
                    <Text style={styles.title}>LatLong</Text>
                    <Text>
                        Lat: {latitude}
                    </Text>
                    <Text>
                        Long: {longitude}
                    </Text>
                    
                </>
            }

            {
                errorMsg && <Text>{errorMsg}</Text>
            }

        </View>

    );
}
