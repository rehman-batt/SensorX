import { Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { styles } from '../styles/SensorStyles';
import * as Location from 'expo-location';


export default function LatLong({ updateLatLong, latitude, longitude, delay }) {


    const [errorMsg, setErrorMsg] = useState('Please provide permission to access location');
    const [dataStream, setDataStream] = useState([])
    
    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Please provide permission to access location');
                return;
            }

            else {
                await Location.enableNetworkProviderAsync();
                setErrorMsg(null);
                let location = await Location.getCurrentPositionAsync({});

                updateLatLong(location.coords.latitude, location.coords.longitude);
                dataStream.push(location.coords)
            }

        })();


    }, []);

    useEffect(() => {
       
        const fn = async () => {
            let location = await Location.getCurrentPositionAsync({});
            updateLatLong(location.coords.latitude, location.coords.longitude);

            if (dataStream.length == 50) {
                console.log(dataStream);
                setDataStream([]);
            }
            setDataStream((old) => [...old, location.coords]);
        }

        let update = setTimeout(fn, delay);

        return () => {
            clearTimeout(update);
        };
    })

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
