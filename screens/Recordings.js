import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { ref, onValue } from "firebase/database";
import { db, FIREBASE_AUTH } from '../config/firebase.js';
import * as Location from "expo-location";

import {
    backgroundColor,
    foregroundColor1,
    buttonBackground,
    buttonForeground,
    foregroundColor2,
    camerBackground,
} from '../styles/SensorStyles';

const Card = ({ children }) => {
    return (
        <View style={styles.card}>
            {children}
        </View>
    );
};

const transformData = async (tempDataDict) => {
    // Function to format timestamp into "HH:MM AM/PM"
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    };

    // Function to format timestamp into "DD MMM, YYYY" (e.g., "12 Feb, 2025")
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
    };

    // Function to get address from lat/long, or return formatted coordinates if not found
    const getAddress = async (lat, long) => {
        try {
            let result = await Location.reverseGeocodeAsync({ latitude: lat, longitude: long });
            if (result.length > 0) {
                const { name, street, city, region, country, postalCode } = result[0];

                // Combine all available fields into a single formatted string
                return [name, street, city, region, postalCode, country]
                    .filter(Boolean) // Remove empty values
                    .join(", "); // Join with a comma and space
            }
        } catch (error) {
            console.log("Reverse Geocoding Error:", error);
        }
        return `Lat: ${lat.toFixed(4)}, Long: ${long.toFixed(4)}`; // Fallback formatted string
    };

    // Get addresses
    const startAddress = await getAddress(tempDataDict.startLat, tempDataDict.startLong);
    const endAddress = await getAddress(tempDataDict.endLat, tempDataDict.endLong);

    // Return transformed data
    return {
        startTime: formatTime(tempDataDict.startTime),
        endTime: formatTime(tempDataDict.endTime),
        date: formatDate(tempDataDict.startTime),
        startAddress,
        endAddress,
    };
};

const Recordings = () => {


    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const userID = FIREBASE_AUTH.currentUser?.uid;
        console.log(userID);
        const dataRef = ref(db, 'users/' + userID + '/rides');

        onValue(dataRef, (snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if (userData) {

                    const keys = Object.keys(userData);

                    let transformedData = [];

                    try {

                        keys.forEach((key) => {
                            let tempDataDict = {
                                'startTime': userData[key]['Accelerometer']['timestamp'][0],
                                'endTime': userData[key]['Accelerometer']['timestamp'][(userData[key]['Accelerometer']['timestamp']).length - 1],
                                'startLat': userData[key]['Latitude and Longitude']['lat'][0],
                                'endLat': userData[key]['Latitude and Longitude']['lat'][(userData[key]['Latitude and Longitude']['lat']).length - 1],
                                'startLong': userData[key]['Latitude and Longitude']['long'][0],
                                'endLong': userData[key]['Latitude and Longitude']['long'][(userData[key]['Latitude and Longitude']['long']).length - 1],
                            };




                            transformData(tempDataDict).then((transformedDataDict) => {
                                transformedData.push(transformedDataDict);

                                // Set state after processing all data to avoid multiple state updates
                                if (transformedData.length === keys.length) {
                                    setData(transformedData);
                                    setLoading(false);
                                }
                            });
                        });
                    } catch (e) {
                        console.log('Error fetching ride: ', e);
                    }

                }




            } else {
                console.log("No user data found");
                setLoading(false);
            }
        });

    }, []);



    return loading ? (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size={100} color="#0e4c92" />
        </View>
    ) : Array.isArray(data) && data.length > 0 ? (
        <ScrollView style={styles.container}>
            {data.map((item, index) => (
                <Card key={index}>
                    <View style={styles.row}>
                        <Text style={styles.time}>{item.startTime}</Text>
                        <Text style={styles.endTime}>{item.endTime}</Text>
                    </View>
                    <Text style={styles.location}>
                        {item.startAddress} {"\n\n"}to{"\n\n"}{item.endAddress}
                    </Text>
                    <Text style={styles.date}>{item.date}</Text>
                </Card>
            ))}
        </ScrollView>
    ) : (
        <View style={styles.noDataContainer}>
            <Text style={styles.message}>No User Data Found</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    noDataContainer: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        justifyContent: "center",
        alignItems: "center",
    },
    message: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#0e4c92",
    },
    container: {
        flex: 1,
        backgroundColor: backgroundColor,
        padding: 15,

    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 15,
        padding: 20,
        marginVertical: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        justifyContent: 'space-between',
        marginHorizontal: 10,
        paddingBottom: 25,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    time: {
        fontSize: 18,
        fontWeight: 'bold',
        color: foregroundColor1,
        marginBottom: 4,
    },
    endTime: {
        fontSize: 18,
        fontWeight: 'bold',
        color: buttonBackground,
        marginBottom: 12,
    },
    location: {
        fontSize: 14,
        color: foregroundColor2,
        lineHeight: 22,
        marginBottom: 10,
    },
    date: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ff5252',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 5,
    },
});



export default Recordings;