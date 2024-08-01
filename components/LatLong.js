import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

export default function LatLong({setLatitude, setLongitude, latitude, longitude}) {

    
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
            setLatitude(location.coords.latitude);
            setLongitude(location.coords.longitude);
           
        })();

        let timer = setInterval(async () => {
            let location = await Location.getCurrentPositionAsync({});
            setLatitude(location.coords.latitude);
            setLongitude(location.coords.longitude);
          

            
        }, 1000);

        return () => clearInterval(timer);
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

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        marginBottom: '3%',
        color: 'blue'
    },
    container: {
        flex: 0.15,
        width: '80%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 20,
        marginBottom: '3%',

    },
});
