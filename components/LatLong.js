import { Text, View, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/SensorStyles';
import * as Location from 'expo-location';

export default function LatLong({ delay, collectData, data }) {

    const [errorMsg, setErrorMsg] = useState('Please provide permission to access location');
    const [status, setStatus] = useState(false);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const locationWatcher = useRef(null);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                let permissionStatus = await Location.requestForegroundPermissionsAsync();
                if (permissionStatus.status !== 'granted') {
                    setErrorMsg('Please provide permission to access location');
                    return;
                } else { 
                    setStatus(true);
                    await Location.enableNetworkProviderAsync();
                    setErrorMsg(null);

                    locationWatcher.current = await Location.watchPositionAsync({
                        accuracy: Location.Accuracy.High,
                        timeInterval: delay,
                        distanceInterval: 0,
                    }, (location) => {
                        if (isActive) {
                            setLatitude(location.coords.latitude);
                            setLongitude(location.coords.longitude);

                            if (status && collectData) {
                                data.current['lat'].push(location.coords.latitude);
                                data.current['long'].push(location.coords.longitude);
                                data.current['timestamp'].push(Date.now());
                            }
                        }
                    });
                }
            })();

            return () => {
                isActive = false;
                if (locationWatcher.current) {
                    console.log('Location Watcher Removed');
                    locationWatcher.current.remove();
                }
            };
        }, [delay, collectData, status])
    );

    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.title}>Latitude Longitude</Text>
            </View>
            {!errorMsg && (
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
            )}

            {errorMsg && (
                <View style={styles.errorView}>
                    <Text>{errorMsg}</Text>
                </View>
            )}
        </View>
    );
}
