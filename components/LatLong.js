import { Text, View, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/SensorStyles';
import * as Location from 'expo-location';

export default function LatLong({ delay, collectData, data }) {

    const [errorMsg, setErrorMsg] = useState('Please provide permission to access location');
    const [status, setStatus] = useState(false);
    
    const [location, setLocation] = useState({ latitude: null, longitude: null, altitude: 0, speed: 0 });

    const locationWatcher = useRef(null);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                try {
                    let permissionStatus = await Location.requestForegroundPermissionsAsync();
                    if (permissionStatus.status !== 'granted') {
                        setErrorMsg('Please provide permission to access location');
                        return;
                    } else {
                        setStatus(true);
                        try {
                            await Location.enableNetworkProviderAsync();
                        } catch (e) {
                            setErrorMsg('An error occurred while enabling network provider');
                            return;
                        }
            
                        setErrorMsg(null);
            
                        try {
                            locationWatcher.current = await Location.watchPositionAsync({
                                accuracy: Location.Accuracy.BestForNavigation,
                                timeInterval: parseInt(delay/2),
                                distanceInterval: 0,
                            }, (loc) => {
                                try {
                                    if (isActive) {
                                        const { latitude, longitude, altitude, speed, altitudeAccuracy } = loc.coords;

                                        setLocation({ latitude, longitude, altitude, speed });
            
                                        if (status && collectData) {

                                            const { lat, long, alt, timestamp, speed: spd, accuracy, distance } = data.current;
                                            
                                            lat.push(latitude);
                                            long.push(longitude);
                                            timestamp.push(Date.now());
                                            spd.push(speed);
                                            alt.push(altitude);
                                            accuracy.push(altitudeAccuracy);
                                        }
                                    }
                                } catch (e) {
                                    console.log(e);
                                    setErrorMsg('An error occurred while processing location data');
                                }
                            });
                        } catch (e) {
                            console.log(e);
                            setErrorMsg('An error occurred while watching position');
                        }
                    }
                } catch (e) {
                    console.log(e);
                    setErrorMsg('An error occurred while requesting location permission');
                }
            })();
            

            return () => {
                isActive = false;
                locationWatcher.current?.remove();
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
                                        {location.latitude}
                                    </Text>
                                    <Text style={styles.unit}>deg</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.valueTitle}>Longitude</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.latLongValue}>
                                        {location.longitude}
                                    </Text>
                                    <Text style={styles.unit}>deg</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.valueTitle}>Altitude</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.latLongValue}>
                                        {(location.altitude ?? 0).toFixed(2)}

                                    </Text>
                                    <Text style={styles.unit}>m</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.valueTitle}>Speed</Text>
                                <View style={styles.flexRowUtility}>
                                    <Text style={styles.latLongValue}>
                                        {(location.speed ?? 0).toFixed(2)}
                                    </Text>
                                    <Text style={styles.unit}>m/s</Text>
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
