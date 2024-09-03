import { Text, View, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { styles } from '../styles/SensorStyles';
import * as Location from 'expo-location';


export default function LatLong({ updateLatLong, latitude, longitude, delay }) {

    const [errorMsg, setErrorMsg] = useState('Please provide permission to access location');
    const [dataStream, setDataStream] = useState([]);
    const [status, setStatus] = useState('denied');

    useEffect(() => {
        (async () => {

            let permissionStatus = await Location.requestForegroundPermissionsAsync();
            if (permissionStatus.status !== 'granted') {
                setErrorMsg('Please provide permission to access location');
                return;
            }

            else {
                setStatus('granted');
                await Location.enableNetworkProviderAsync();
                setErrorMsg(null);
                let location = await Location.getCurrentPositionAsync({});

                updateLatLong(location.coords.latitude, location.coords.longitude);
            }

        })();


    }, []);

    useEffect(() => {

        const fn = async () => {
            let location = await Location.getCurrentPositionAsync({});
            updateLatLong(location.coords.latitude, location.coords.longitude);
        }

        let update = setTimeout(fn, delay);

        return () => {
            clearTimeout(update);
        };
    })

    return (

        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.title}>Latitude Longitude</Text>
            </View>
            {!errorMsg &&
                <>
                    <View style={styles.subContainer}>
                        <View style={styles.sensorImageView}>
                            <Image
                                style={styles.sensorImage}
                                source={require('../assets/gps.png')}
                            />
                        </View>
                        <View style={styles.valueContainer}>
                            <View>
                                <Text style={styles.valueTitle}>Latitude</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.latLongValue}>
                                        {latitude}
                                    </Text>
                                    <Text style={styles.unit}>deg</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.valueTitle}>Longitude</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.latLongValue}>
                                        {longitude}
                                    </Text>
                                    <Text style={styles.unit}>deg</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </>
            }

            {
                errorMsg &&
                <View style={styles.errorView}>
                    <Text>{errorMsg}</Text>
                </View>
                
            }

        </View>

    );
}
