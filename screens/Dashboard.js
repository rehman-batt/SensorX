import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH } from '../config/firebase.js';

//uncomment
import { firebase } from '@react-native-firebase/database';

const Dashboard = () => {
    const [totalUsers, setTotalUsers] = useState('N/A');
    const [userTime, setUserTime] = useState('N/A');
    const [totalTime, setTotalTime] = useState('N/A');
    const [avgTime, setAvgTime] = useState('N/A');
    const [userDistance, setUserDistance] = useState('N/A');
    const [totalDistance, setTotalDistance] = useState('N/A');
    const [avgDistance, setAvgDistance] = useState('N/A');
    const [loading, setLoading] = useState(true);

    const convertMsToTime = (ms) => {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // const userID = FIREBASE_AUTH.currentUser?.uid;

                // const db = firebase.app().database('https://roadinsight-default-rtdb.asia-southeast1.firebasedatabase.app/');

                // const [
                //     usersSnap,
                //     userTimeSnap,
                //     totalTimeSnap,
                //     userDistanceSnap,
                //     totalDistanceSnap
                // ] = await Promise.all([
                //     db.ref('totalUsers').get(),
                //     db.ref(`users/${userID}/time`).get(),
                //     db.ref('time').get(),
                //     db.ref(`users/${userID}/distance`).get(),
                //     db.ref('distance').get(),
                // ]);

                // setTotalUsers(usersSnap.exists() ? usersSnap.val() : 'N/A');
                // setUserTime(userTimeSnap.exists() ? convertMsToTime(userTimeSnap.val()) : 'N/A');
                // setTotalTime(totalTimeSnap.exists() ? convertMsToTime(totalTimeSnap.val()) : 'N/A');
                // setAvgTime(usersSnap.exists() && totalTimeSnap.exists() ?
                //     convertMsToTime(parseInt(totalTimeSnap.val() / usersSnap.val())) : 'N/A');

                // setUserDistance(userDistanceSnap.exists() ? (userDistanceSnap.val() / 1000).toFixed(5) : 'N/A');
                // setTotalDistance(totalDistanceSnap.exists() ? (totalDistanceSnap.val() / 1000).toFixed(5) : 'N/A');
                // setAvgDistance(usersSnap.exists() && totalDistanceSnap.exists() ?
                //     ((totalDistanceSnap.val() / usersSnap.val()) / 1000).toFixed(5) : 'N/A');

                const userID = FIREBASE_AUTH.currentUser?.uid;

                const db = firebase.app().database('https://roadinsight-default-rtdb.asia-southeast1.firebasedatabase.app/');

                const updateValues = (snapshot, setState, transform = (val) => val) => {
                    setState(snapshot.exists() ? transform(snapshot.val()) : 'N/A');
                };

                // Set up listeners
                db.ref('totalUsers').on('value', (snapshot) => updateValues(snapshot, setTotalUsers));

                db.ref(`users/${userID}/time`).on('value', (snapshot) => updateValues(snapshot, setUserTime, convertMsToTime));

                db.ref('time').on('value', (snapshot) => updateValues(snapshot, setTotalTime, convertMsToTime));

                db.ref(`users/${userID}/distance`).on('value', (snapshot) =>
                    updateValues(snapshot, setUserDistance, (val) => (val / 1000).toFixed(5))
                );

                db.ref('distance').on('value', (snapshot) =>
                    updateValues(snapshot, setTotalDistance, (val) => (val / 1000).toFixed(5))
                );

                // Compute average time and distance dynamically
                db.ref('totalUsers').on('value', (usersSnap) => {
                    db.ref('time').on('value', (totalTimeSnap) => {
                        setAvgTime(
                            usersSnap.exists() && totalTimeSnap.exists()
                                ? convertMsToTime(parseInt(totalTimeSnap.val() / usersSnap.val()))
                                : 'N/A'
                        );
                    });

                    db.ref('distance').on('value', (totalDistanceSnap) => {
                        setAvgDistance(
                            usersSnap.exists() && totalDistanceSnap.exists()
                                ? ((totalDistanceSnap.val() / usersSnap.val()) / 1000).toFixed(5)
                                : 'N/A'
                        );
                    });
                });

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);


    const styles = {
        container: {
            flex: 1,
            backgroundColor: '#f2f2f2',
            padding: 16,
        },
        card: {
            backgroundColor: '#e6e6e6',
            padding: 16,
            marginBottom: 12,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#0e4c92',
            marginBottom: 6,
        },
        value: {
            fontSize: 20,
            fontWeight: '600',
            color: 'black',
        },
        loaderContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f2f2f2',
        },
    };

    return (

        loading ? (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size={100} color="#0e4c92" />
            </View>
        ) : (
            <ScrollView style={styles.container}><View style={styles.card}>
                <Text style={styles.title}>Total Users</Text>
                <Text style={styles.value}>{totalUsers}</Text>
            </View><View style={styles.card}>
                    <Text style={styles.title}>Total Distance Covered (km)</Text>
                    <Text style={styles.value}>{totalDistance}</Text>
                </View><View style={styles.card}>
                    <Text style={styles.title}>Total Time Spent</Text>
                    <Text style={styles.value}>{totalTime}</Text>
                </View><View style={styles.card}>
                    <Text style={styles.title}>Your Distance Covered (km)</Text>
                    <Text style={styles.value}>{userDistance}</Text>
                </View><View style={styles.card}>
                    <Text style={styles.title}>Your Time Spent</Text>
                    <Text style={styles.value}>{userTime}</Text>
                </View><View style={styles.card}>
                    <Text style={styles.title}>Average Distance per User (km)</Text>
                    <Text style={styles.value}>{avgDistance}</Text>
                </View><View style={styles.card}>
                    <Text style={styles.title}>Average Time per User</Text>
                    <Text style={styles.value}>{avgTime}</Text>
                </View></ScrollView>
        )

    );
};

export default Dashboard;