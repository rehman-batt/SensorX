import { Text, View, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/SensorStyles';
import * as Location from 'expo-location';
import haversine from 'haversine';

export default function LatLong({ delay, collectData, data }) {
    // Track permission and status
    const [errorMsg, setErrorMsg] = useState('Please provide permission to access location');
    const [status, setStatus] = useState(false);

    // Current location data
    const [location, setLocation] = useState({ latitude: null, longitude: null, altitude: 0, speed: 0 });

    // Ref to store the location subscription
    const locationWatcher = useRef(null);

    // Request permission and start location tracking on focus
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            (async () => {
                try {
                    // Ask for location permission
                    let permissionStatus = await Location.requestForegroundPermissionsAsync();
                    if (permissionStatus.status !== 'granted') {
                        setErrorMsg('Please provide permission to access location');
                        return;
                    }

                    setStatus(true);

                    try {
                        // Ensure network provider is enabled
                        await Location.enableNetworkProviderAsync();
                    } catch (e) {
                        setErrorMsg('An error occurred while enabling network provider');
                        return;
                    }

                    setErrorMsg(null);

                    // Begin watching position with given interval
                    locationWatcher.current = await Location.watchPositionAsync({
                        accuracy: Location.Accuracy.BestForNavigation,
                        timeInterval: parseInt(delay / 2),
                        distanceInterval: 0,
                    }, (loc) => {
                        if (!isActive) return;

                        const { latitude, longitude, altitude, speed, altitudeAccuracy } = loc.coords;

                        // Update UI state with latest location
                        setLocation({ latitude, longitude, altitude, speed });

                        // If data collection is enabled, store values in shared data object
                        if (status && collectData) {
                            const { lat, long, alt, timestamp, speed: spd, accuracy, distance } = data.current;

                            lat.push(latitude);
                            long.push(longitude);
                            timestamp.push(Date.now());
                            spd.push(speed);
                            alt.push(altitude);
                            accuracy.push(altitudeAccuracy);

                            // Calculate and add incremental distance using haversine formula
                            if (lat.length > 1) {
                                const prevIndex = lat.length - 2;
                                const lastIndex = lat.length - 1;

                                const start = { latitude: lat[prevIndex], longitude: long[prevIndex] };
                                const end = { latitude: lat[lastIndex], longitude: long[lastIndex] };

                                data.current.distance += haversine(start, end, { unit: 'meter' });
                            }
                        }
                    });
                } catch (e) {
                    setErrorMsg('An error occurred while requesting location permission');
                }
            })();

            // Cleanup on unmount/focus loss
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

            {/* If permission granted, show location data */}
            {!errorMsg && (
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
                                <Text style={styles.latLongValue}>{location.latitude}</Text>
                                <Text style={styles.unit}>deg</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.valueTitle}>Longitude</Text>
                            <View style={styles.flexRowUtility}>
                                <Text style={styles.latLongValue}>{location.longitude}</Text>
                                <Text style={styles.unit}>deg</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.valueTitle}>Altitude</Text>
                            <View style={styles.flexRowUtility}>
                                <Text style={styles.latLongValue}>{(location.altitude ?? 0).toFixed(2)}</Text>
                                <Text style={styles.unit}>m</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.valueTitle}>Speed</Text>
                            <View style={styles.flexRowUtility}>
                                <Text style={styles.latLongValue}>{(location.speed ?? 0).toFixed(2)}</Text>
                                <Text style={styles.unit}>m/s</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}

            {/* Display error message if permission is denied or something went wrong */}
            {errorMsg && (
                <View style={styles.errorView}>
                    <Text>{errorMsg}</Text>
                </View>
            )}
        </View>
    );
}
