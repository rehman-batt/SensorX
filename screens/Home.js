// Import core and UI components
import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, Pressable, ScrollView,
  ActivityIndicator, Alert, PanResponder, Animated, Platform
} from 'react-native';

// Import custom color variables
import {
  buttonBackground,
  buttonForeground,
  foregroundColor1
} from '../styles/SensorStyles.js';

// Import sensor components
import Gyro from '../components/Gyro.js';
import Accelero from '../components/Accelerometer.js';
import LatLong from '../components/LatLong.js';
import Magnet from '../components/Magnetometer.js';
import MotionAcc from '../components/MotionAcc.js';
import MotionAccGrav from '../components/MotionAccGrav.js';
import Rotation from '../components/Rotation.js';
import RotationRate from '../components/RotationRate.js';
import MagnetUnc from '../components/MagnetometerUncalibrated.js';
import MobileCam from '../components/MobileCam.js';

// Firebase and navigation utilities
import { useDrawerStatus } from '@react-navigation/drawer';
import { FIREBASE_AUTH, db } from '../config/firebase.js';
import { ref, runTransaction } from 'firebase/database';
import { firebase } from '@react-native-firebase/database'; // Un-commented for realtime db

// Expo-specific libraries for camera, device info, media storage, and notifications
import * as MediaLibrary from "expo-media-library";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Configure how notifications are handled when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Home({ }) {
  // State hooks for various features
  const [collectData, setCollectData] = useState(false);         // Sensor data collection flag
  const [setCamera, setSetCamera] = useState(false);             // Toggle to show/hide camera
  const [delay, setDelay] = useState(1000);                      // Sensor polling delay
  const [loading, setLoading] = useState(false);                 // Loading indicator flag
  const [cameraPermissions, setCameraPermissions] = useState(false); // Camera access permission

  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(); // Media access permission

  // Push notification related state
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState([]);
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  // Run once on component mount
  useEffect(() => {
    // Register and get push notification token
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    // For Android, fetch available notification channels
    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }

    // Add listeners to handle incoming and interacted notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    // Cleanup listeners on component unmount
    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Schedules a push notification when data is uploaded
  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Data Uploaded",
        body: 'The Data has been successfully pushed to the database.',
      },
      trigger: null,
    });
  }

  // Registers the device for push notifications and returns token
  async function registerForPushNotificationsAsync() {
    let token;

    // Set up Android-specific notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Only allow on physical devices
    if (Device.isDevice) {
      // Check and request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // Abort if permission not granted
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        Linking.openSettings(); // Optionally redirect to settings
        return;
      }

      // Get project ID for push notification token generation
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }

        // Get the Expo push token
        token = (
          await Notifications.getExpoPushTokenAsync({ projectId })
        ).data;
        console.log(token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  }
  // Request permission to access media library (used for storing video)
  useEffect(() => {
    (async () => {
      try {
        const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
        setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
      } catch (error) {
        console.error('Error Getting Library Permission:', error?.message);
      }
    })();
  }, []);

  // Refs to store collected sensor data locally
  const acceleroData = useRef({ x: [], y: [], z: [], timestamp: [] });
  const gyroData = useRef({ x: [], y: [], z: [], timestamp: [] });
  const magnetData = useRef({ x: [], y: [], z: [], timestamp: [] });
  const magnetUncData = useRef({ x: [], y: [], z: [], timestamp: [] });
  const motionAccData = useRef({ x: [], y: [], z: [], timestamp: [] });
  const motionAccGravData = useRef({ x: [], y: [], z: [], timestamp: [] });
  const rotationData = useRef({ alpha: [], beta: [], gamma: [], timestamp: [] });
  const rotationRateData = useRef({ alpha: [], beta: [], gamma: [], timestamp: [] });
  const latLongData = useRef({ lat: [], long: [], alt: [], timestamp: [], speed: [], accuracy: [], distance: 0 });

  // Fetch sample rate from Firebase whenever drawer state changes
  const getSampleRate = async () => {
    const userID = FIREBASE_AUTH.currentUser?.uid;
    if (userID) {
      try {
        setLoading(true);
        firebase.app().database('https://roadinsight-default-rtdb.asia-southeast1.firebasedatabase.app/')
          .ref('users/' + userID)
          .on('value', snapshot => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              setDelay(userData.sampleRate || 1000); // Set delay from user data or fallback
            } else {
              console.log("No user data found");
            }
          });
      } catch (error) {
        console.log("Error fetching user data: ", error?.message);
        setDelay(1000);
      } finally {
        setLoading(false);
      }
    }
  };

  const isDrawerOpen = useDrawerStatus() === 'open';

  // Trigger sample rate fetch on drawer state change
  useEffect(() => {
    getSampleRate();
  }, [isDrawerOpen]);

  // Push sensor data to Firebase and update stats
  const setSensorData = async () => {
    try {
      setLoading(true);

      const dataToPush = {
        'Accelerometer': acceleroData.current,
        'Gyroscope': gyroData.current,
        'Magnetometer': magnetData.current,
        'Magnetometer Uncertainty': magnetUncData.current,
        'Motion Acceleration': motionAccData.current,
        'Motion Acceleration with Gravity': motionAccGravData.current,
        'Rotation': rotationData.current,
        'Rotation Rate': rotationRateData.current,
        'Latitude and Longitude': latLongData.current,
        'processed1': false,
        'processed2': false,
      };

      const userID = FIREBASE_AUTH.currentUser?.uid;

      if (userID) {
        // Calculate total time and distance
        const distanceTravelled = parseFloat(dataToPush['Latitude and Longitude']['distance']);
        const acceleroDataLength = dataToPush['Accelerometer']['timestamp'].length;

        let totalTime = 0;
        if (acceleroDataLength > 1) {
          totalTime = parseFloat(
            dataToPush['Accelerometer']['timestamp'][acceleroDataLength - 1] -
            dataToPush['Accelerometer']['timestamp'][0]);
        }

        dataToPush['time'] = totalTime;

        console.log('Updating distance by:', distanceTravelled);
        console.log('Updating time by:', totalTime);

        // Update global and user-specific time/distance in database
        runTransaction(ref(db, 'distance/'), curr => (curr || 0) + distanceTravelled);
        runTransaction(ref(db, `users/${userID}/distance/`), curr => (curr || 0) + distanceTravelled);
        runTransaction(ref(db, 'time/'), curr => (curr || 0) + totalTime);
        runTransaction(ref(db, `users/${userID}/time/`), curr => (curr || 0) + totalTime);

        // Push ride data to new entry under user's node
        const newReference = firebase
          .app()
          .database('https://roadinsight-default-rtdb.asia-southeast1.firebasedatabase.app/')
          .ref(`/users/${userID}/rides`).push();

        newReference.set(dataToPush).then(async () => await schedulePushNotification());
      }

    } catch (error) {
      console.log("Error Setting Data: ", error?.message);
      Alert.alert('Data Setting Error', error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle data collection stop and reset sensor data
  const handleDataCollection = async () => {
    await setSensorData();
    acceleroData.current = { x: [], y: [], z: [], timestamp: [] };
    gyroData.current = { x: [], y: [], z: [], timestamp: [] };
    magnetData.current = { x: [], y: [], z: [], timestamp: [] };
    magnetUncData.current = { x: [], y: [], z: [], timestamp: [] };
    motionAccData.current = { x: [], y: [], z: [], timestamp: [] };
    motionAccGravData.current = { x: [], y: [], z: [], timestamp: [] };
    rotationData.current = { alpha: [], beta: [], gamma: [], timestamp: [] };
    rotationRateData.current = { alpha: [], beta: [], gamma: [], timestamp: [] };
    latLongData.current = { lat: [], long: [], alt: [], timestamp: [], speed: [], accuracy: [], distance: 0 };
  };

  // If collection stops and data exists, save it
  useEffect(() => {
    if (!collectData) {
      if (
        acceleroData.current['x'].length ||
        gyroData.current['x'].length ||
        magnetData.current['x'].length ||
        magnetUncData.current['x'].length ||
        motionAccData.current['x'].length ||
        motionAccGravData.current['x'].length ||
        rotationData.current['alpha'].length ||
        rotationRateData.current['alpha'].length ||
        latLongData.current['lat'].length
      ) {
        handleDataCollection();
      }
    }
  }, [collectData]);

  return (
    <>
      {/* Show main UI only when not loading */}
      {!loading &&
        <>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Sensor data collection components */}
            <Accelero delay={delay} collectData={collectData} data={acceleroData} />
            <Gyro delay={delay} collectData={collectData} data={gyroData} />
            <Magnet delay={delay} collectData={collectData} data={magnetData} />
            <MagnetUnc delay={delay} collectData={collectData} data={magnetUncData} />
            <MotionAcc delay={delay} collectData={collectData} data={motionAccData} />
            <MotionAccGrav delay={delay} collectData={collectData} data={motionAccGravData} />
            <Rotation delay={delay} collectData={collectData} data={rotationData} />
            <RotationRate delay={delay} collectData={collectData} data={rotationRateData} />
            <LatLong delay={delay} collectData={collectData} data={latLongData} />

            {/* Button to enable camera setup */}
            {(!setCamera && !collectData) && <Pressable style={styles.button} onPress={() => setSetCamera(true)}>
              <Text style={styles.text}>Set Camera</Text>
            </Pressable>}

            {/* Button to start data collection */}
            {(!collectData && setCamera) && <Pressable style={cameraPermissions ? styles.button : styles.disabledButton} onPress={() => setCollectData(true)} disabled={!cameraPermissions}>
              <Text style={styles.text}>Collect Data</Text>
            </Pressable>}

            {/* Button to stop data collection */}
            {(collectData && setCamera) && <Pressable style={styles.button} onPress={() => { setCollectData(false) }}>
              <Text style={styles.text}>Stop Collection</Text>
            </Pressable>}

          </ScrollView>

          {/* Conditionally render camera preview if camera is set */}
          {setCamera && <View style={styles.cameraContainer}>
            <MobileCam collectData={collectData} setSetCamera={setSetCamera} setCameraPermissions={setCameraPermissions} hasMediaLibraryPermission={hasMediaLibraryPermission} />
          </View>}


        </>
      }

      {/* Show loading spinner while data is being processed */}
      {loading && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={foregroundColor1} size={60} />
      </View>}
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: '3%', // Prevents content from getting cut off at bottom
  },
  button: {
    marginTop: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '55%',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: buttonBackground, // Active button styling
  },
  disabledButton: {
    marginTop: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '55%',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: buttonBackground,
    opacity: 0.7, // Dim the button to indicate it's disabled
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: buttonForeground,
  },
  cameraContainer: {
    position: 'absolute',
    top: 45,
    right: 10,
    width: '30%',
    height: 200,
    backgroundColor: 'transparent',
    flex: 1, // Overlay camera view on top
  },
});
