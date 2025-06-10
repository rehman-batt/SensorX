// import React, { useState, useEffect } from 'react';
// import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
// import { FIREBASE_AUTH } from '../config/firebase.js';
// import Icon from 'react-native-vector-icons/FontAwesome';

// //uncomment
// import { firebase } from '@react-native-firebase/database';
// import { foregroundColor1 } from '../styles/SensorStyles.js';

// const Dashboard = () => {
//     const [totalUsers, setTotalUsers] = useState('N/A');
//     const [userTime, setUserTime] = useState('N/A');
//     const [totalTime, setTotalTime] = useState('N/A');
//     const [avgTime, setAvgTime] = useState('N/A');
//     const [userDistance, setUserDistance] = useState('N/A');
//     const [totalDistance, setTotalDistance] = useState('N/A');
//     const [avgDistance, setAvgDistance] = useState('N/A');
//     const [loading, setLoading] = useState(true);

//     const convertMsToTime = (ms) => {
//         const hours = Math.floor(ms / 3600000);
//         const minutes = Math.floor((ms % 3600000) / 60000);
//         const seconds = Math.floor((ms % 60000) / 1000);
//         return `${hours}h ${minutes}m ${seconds}s`;
//     };

//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             try {
//                 // const userID = FIREBASE_AUTH.currentUser?.uid;

//                 // const db = firebase.app().database('https://roadinsight-default-rtdb.asia-southeast1.firebasedatabase.app/');

//                 // const [
//                 //     usersSnap,
//                 //     userTimeSnap,
//                 //     totalTimeSnap,
//                 //     userDistanceSnap,
//                 //     totalDistanceSnap
//                 // ] = await Promise.all([
//                 //     db.ref('totalUsers').get(),
//                 //     db.ref(`users/${userID}/time`).get(),
//                 //     db.ref('time').get(),
//                 //     db.ref(`users/${userID}/distance`).get(),
//                 //     db.ref('distance').get(),
//                 // ]);

//                 // setTotalUsers(usersSnap.exists() ? usersSnap.val() : 'N/A');
//                 // setUserTime(userTimeSnap.exists() ? convertMsToTime(userTimeSnap.val()) : 'N/A');
//                 // setTotalTime(totalTimeSnap.exists() ? convertMsToTime(totalTimeSnap.val()) : 'N/A');
//                 // setAvgTime(usersSnap.exists() && totalTimeSnap.exists() ?
//                 //     convertMsToTime(parseInt(totalTimeSnap.val() / usersSnap.val())) : 'N/A');

//                 // setUserDistance(userDistanceSnap.exists() ? (userDistanceSnap.val() / 1000).toFixed(5) : 'N/A');
//                 // setTotalDistance(totalDistanceSnap.exists() ? (totalDistanceSnap.val() / 1000).toFixed(5) : 'N/A');
//                 // setAvgDistance(usersSnap.exists() && totalDistanceSnap.exists() ?
//                 //     ((totalDistanceSnap.val() / usersSnap.val()) / 1000).toFixed(5) : 'N/A');

//                 const userID = FIREBASE_AUTH.currentUser?.uid;

//                 const db = firebase.app().database('https://roadinsight-default-rtdb.asia-southeast1.firebasedatabase.app/');

//                 const updateValues = (snapshot, setState, transform = (val) => val) => {
//                     setState(snapshot.exists() ? transform(snapshot.val()) : 'N/A');
//                 };

//                 // Set up listeners
//                 db.ref('totalUsers').on('value', (snapshot) => updateValues(snapshot, setTotalUsers));

//                 db.ref(`users/${userID}/time`).on('value', (snapshot) => updateValues(snapshot, setUserTime, convertMsToTime));

//                 db.ref('time').on('value', (snapshot) => updateValues(snapshot, setTotalTime, convertMsToTime));

//                 db.ref(`users/${userID}/distance`).on('value', (snapshot) =>
//                     updateValues(snapshot, setUserDistance, (val) => (val / 1000).toFixed(5))
//                 );

//                 db.ref('distance').on('value', (snapshot) =>
//                     updateValues(snapshot, setTotalDistance, (val) => (val / 1000).toFixed(5))
//                 );

//                 // Compute average time and distance dynamically
//                 db.ref('totalUsers').on('value', (usersSnap) => {
//                     db.ref('time').on('value', (totalTimeSnap) => {
//                         setAvgTime(
//                             usersSnap.exists() && totalTimeSnap.exists()
//                                 ? convertMsToTime(parseInt(totalTimeSnap.val() / usersSnap.val()))
//                                 : 'N/A'
//                         );
//                     });

//                     db.ref('distance').on('value', (totalDistanceSnap) => {
//                         setAvgDistance(
//                             usersSnap.exists() && totalDistanceSnap.exists()
//                                 ? ((totalDistanceSnap.val() / usersSnap.val()) / 1000).toFixed(5)
//                                 : 'N/A'
//                         );
//                     });
//                 });

//             } catch (error) {
//                 console.error('Error fetching dashboard data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDashboardData();
//     }, []);


//     const styles = {

//         container: {
//             flex: 1,
//             backgroundColor: '#f2f2f2',
//             padding: 16,
//             justifyContent: 'space-between'
//         },
//         card: {
//             flex: 1,
//             backgroundColor: '#e6e6e6',
//             padding: 16,
//             marginBottom: 12,
//             borderRadius: 12,
//             shadowColor: '#000',
//             shadowOpacity: 0.1,
//             shadowRadius: 4,
//             elevation: 4,
//             flexDirection: 'row',
//         },
//         lastCard:
//         {
//             flex: 1,
//             backgroundColor: '#e6e6e6',
//             padding: 16,
//             // marginBottom: 12,
//             borderRadius: 12,
//             shadowColor: '#000',
//             shadowOpacity: 0.1,
//             shadowRadius: 4,
//             elevation: 4,
//             flexDirection: 'row',
//         },

//         title: {
//             fontSize: 18,
//             fontWeight: 'bold',
//             color: '#0e4c92',
//             // marginBottom: 6,
//         },
//         value: {

//             fontSize: 20,
//             fontWeight: '600',
//             color: 'black',

//         },
//         loaderContainer: {
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center',
//             backgroundColor: '#f2f2f2',
//         },
//     };

//     return (

//         loading ? (
//             <View style={styles.loaderContainer}>
//                 <ActivityIndicator size={100} color="#0e4c92" />
//             </View>
//         ) : (
//             <View style={styles.container}>
//                 <View style={styles.card}>
//                     <Icon name="users" size={30} color={foregroundColor1} />
//                     <View>
//                         <Text style={styles.title}>Total Users</Text>
//                         <Text style={styles.value}>{totalUsers}</Text>
//                     </View>
//                 </View>
//                 <View style={styles.card}>
//                     <Icon name="road" size={40} color={foregroundColor1} />
//                     <View>
//                         <Text style={styles.title}>Total Distance Covered (km)</Text>
//                         <Text style={styles.value}>{totalDistance}</Text>
//                     </View>
//                 </View>
//                 <View style={styles.card}>
//                     <Icon name="users" size={40} color={foregroundColor1} />
//                     <View>
//                         <Text style={styles.title}>Total Time Spent</Text>
//                         <Text style={styles.value}>{totalTime}</Text>
//                     </View>
//                 </View>
//                 <View style={styles.card}>
//                     <Icon name="users" size={40} color={foregroundColor1} />
//                     <View>
//                         <Text style={styles.title}>Your Distance Covered (km)</Text>
//                         <Text style={styles.value}>{userDistance}</Text>
//                     </View>
//                 </View>
//                 <View style={styles.card}>
//                     <Icon name="users" size={40} color={foregroundColor1} />
//                     <View>
//                         <Text style={styles.title}>Your Time Spent</Text>
//                         <Text style={styles.value}>{userTime}</Text>
//                     </View>
//                 </View>
//                 <View style={styles.card}>
//                     <Icon name="users" size={40} color={foregroundColor1} />
//                     <View>
//                         <Text style={styles.title}>Average Distance per User (km)</Text>
//                         <Text style={styles.value}>{avgDistance}</Text>
//                     </View>
//                 </View>
//                 <View style={styles.lastCard}>
//                     <Icon name="users" size={40} color={foregroundColor1} />
//                     <View>
//                         <Text style={styles.title}>Average Time per User</Text>
//                         <Text style={styles.value}>{avgTime}</Text>
//                     </View>
//                 </View>
//             </View>
//         )

//     );
// };

// export default Dashboard;

import { FIREBASE_AUTH } from '../config/firebase.js';

// //uncomment
import { firebase } from '@react-native-firebase/database';

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const Colors = {
    backgroundColor: '#f9fafb',
    cardBackground: '#ffffff',
    primaryColor: '#0e4c92',
    successColor: '#059669',
    purpleAccent: '#6D28D9',
    violetAccent: '#6D28D9',
    greenAccent: '#059669',

    buttonBackground: '#0e4c92',
    buttonForeground: '#ffffff',
    foregroundColor1: '#0e4c92',
    foregroundColor2: '#1f2937',
    textGray: '#333333',

    statBgBlue: '#DBF0FF',
    statBgGreen: '#DCFCE7',
    statBgPurple: '#F3E8FF',

    summaryBlue: '#DBF0FF',
    summaryGreen: '#DCFCE7',
    summaryViolet: '#F3E8FF',

    borderColor: '#d1d5db',
    darkGray: '#4B5563',
};

const windowWidth = Dimensions.get('window').width;
const cardWidth = (windowWidth - 54) / 2;

function MetricCard({
    title,
    value,
    unit,
    iconName,
    color = Colors.foregroundColor1,
    size = 'normal',
    fullWidth = false,
}) {
    const cardStyle = fullWidth ? styles.fullWidthCard : styles.card;
    const valueSize = size === 'large' ? 32 : 28;

    return (
        <View style={[cardStyle, { backgroundColor: Colors.cardBackground }]}>
            <View style={[styles.cardHeader, { backgroundColor: color }]}>
                <Ionicons name={iconName} size={24} color={Colors.buttonForeground} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <View style={styles.valueContainer}>
                    <Text style={[styles.cardValue, { fontSize: valueSize }]}>
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </Text>
                    {unit && <Text style={styles.cardUnit}>{unit}</Text>}
                </View>
            </View>
        </View>
    );
}

export default function Dashboard() {

    const [totalUsers, setTotalUsers] = useState('N/A');
    const [userTime, setUserTime] = useState('N/A');
    const [totalTime, setTotalTime] = useState('N/A');
    const [avgTime, setAvgTime] = useState('N/A');
    const [userDistance, setUserDistance] = useState('N/A');
    const [totalDistance, setTotalDistance] = useState('N/A');
    const [avgDistance, setAvgDistance] = useState('N/A');
    const [loading, setLoading] = useState(true);

    const convertMsToTime = (ms) => {
        const hours = ms / 3600000;
        // const minutes = Math.floor((ms % 3600000) / 60000);
        // const seconds = Math.floor((ms % 60000) / 1000);
        return hours.toFixed(2);
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {


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
                    updateValues(snapshot, setUserDistance, (val) => (val / 1000).toFixed(2))
                );

                db.ref('distance').on('value', (snapshot) =>
                    updateValues(snapshot, setTotalDistance, (val) => (val / 1000).toFixed(2))
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
                                ? ((totalDistanceSnap.val() / usersSnap.val()) / 1000).toFixed(2)
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


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Colors.backgroundColor }]}>
            <StatusBar style="dark" />
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}></View>

                {/* Global Statistics */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="bar-chart" size={20} color={Colors.foregroundColor1} />
                        <Text style={[styles.sectionTitle, { color: Colors.foregroundColor2 }]}>
                            Global Statistics
                        </Text>
                    </View>

                    <MetricCard
                        title="Total Users"
                        value={totalUsers}
                        iconName="people"
                        color={Colors.foregroundColor1}
                        size="large"
                        fullWidth={true}
                    />

                    <View style={styles.row}>
                        <MetricCard
                            title="Total Distance"
                            value={totalDistance}
                            unit="km"
                            iconName="location"
                        />
                        <MetricCard
                            title="Total Time"
                            value={totalTime}
                            unit="hrs"
                            iconName="time"
                        />
                    </View>
                </View>

                {/* Your Statistics */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="person" size={20} color={Colors.greenAccent} />
                        <Text style={[styles.sectionTitle, { color: Colors.foregroundColor2 }]}>
                            Your Statistics
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <MetricCard
                            title="Your Distance"
                            value={userDistance}
                            unit="km"
                            iconName="location"
                            color={Colors.successColor}
                        />
                        <MetricCard
                            title="Your Time"
                            value={userTime}
                            unit="hrs"
                            iconName="time"
                            color={Colors.successColor}
                        />
                    </View>
                </View>

                {/* Community Averages */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="trending-up" size={20} color={Colors.purpleAccent} />
                        <Text style={[styles.sectionTitle, { color: Colors.foregroundColor2 }]}>
                            Community Averages
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <MetricCard
                            title="Avg Distance"
                            value={avgDistance}
                            unit="km"
                            iconName="location"
                            color={Colors.purpleAccent}
                        />
                        <MetricCard
                            title="Avg Time"
                            value={avgTime}
                            unit="hrs"
                            iconName="time"
                            color={Colors.purpleAccent}
                        />
                    </View>
                </View>

                {/* Performance Summary */}
                <View style={[styles.summaryCard, { backgroundColor: Colors.cardBackground }]}>
                    <Text style={[styles.summaryTitle, { color: Colors.foregroundColor2 }]}>
                        Performance Summary
                    </Text>
                    <View style={styles.summaryRow}>
                        <View style={[styles.summaryItem, { backgroundColor: Colors.summaryBlue }]}>
                            <Text style={[styles.summaryValue, { color: Colors.foregroundColor1 }]}>
                                {userDistance === 'N/A' || totalDistance === 'N/A'
                                    ? 'N/A'
                                    : ((userDistance / totalDistance) * 100).toFixed(2) + '%'}
                            </Text>
                            <Text style={styles.summaryLabel}>of total distance</Text>
                        </View>

                        <View style={[styles.summaryItem, { backgroundColor: Colors.summaryGreen }]}>
                            <Text style={[styles.summaryValue, { color: Colors.greenAccent }]}>
                                {userTime === 'N/A' || totalTime === 'N/A'
                                    ? 'N/A'
                                    : ((userTime / totalTime) * 100).toFixed(2) + '%'}
                            </Text>
                            <Text style={styles.summaryLabel}>of total time</Text>
                        </View>

                        <View style={[styles.summaryItem, { backgroundColor: Colors.summaryViolet }]}>
                            <Text style={[styles.summaryValue, { color: Colors.violetAccent }]}>
                                {userDistance === 'N/A' || avgDistance === 'N/A'
                                    ? 'N/A'
                                    : (userDistance / avgDistance).toFixed(1) + 'x'}
                            </Text>
                            <Text style={styles.summaryLabel}>
                                average
                            </Text>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    header: {
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 12,
    },
    section: { marginBottom: 20, paddingHorizontal: 24 },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        width: cardWidth,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    fullWidthCard: {
        width: '100%',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    cardContent: { padding: 16 },
    cardTitle: { fontSize: 14, color: Colors.darkGray, marginBottom: 4 },
    cardValue: { fontWeight: 'bold', color: Colors.foregroundColor2 },
    cardUnit: { marginLeft: 4, color: Colors.darkGray },
    valueContainer: { flexDirection: 'row', alignItems: 'flex-end' },
    summaryCard: {
        marginHorizontal: 24,
        padding: 16,
        borderRadius: 12,
        marginBottom: 32,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryItem: {
        flex: 1,
        marginHorizontal: 4,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    summaryValue: { fontSize: 16, fontWeight: 'bold' },
    summaryLabel: { fontSize: 12, color: Colors.darkGray },
});
