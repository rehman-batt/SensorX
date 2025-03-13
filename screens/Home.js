import React, { useRef } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, ActivityIndicator, Alert, PanResponder, Animated } from 'react-native';
import { buttonBackground, buttonForeground, foregroundColor1 } from '../styles/SensorStyles.js';
import { useState, useEffect } from 'react';
import Gyro from '../components/Gyro.js';
import Accelero from '../components/Accelerometer.js';
import LatLong from '../components/LatLong.js';
import Magnet from '../components/Magnetometer.js';
import MotionAcc from '../components/MotionAcc.js';
import MotionAccGrav from '../components/MotionAccGrav.js';
import Rotation from '../components/Rotation.js';
import RotationRate from '../components/RotationRate.js';
import MagnetUnc from '../components/MagnetometerUncalibrated.js';
import { useDrawerStatus } from '@react-navigation/drawer';
import { FIREBASE_AUTH } from '../config/firebase.js';
import MobileCam from '../components/MobileCam.js';
import * as MediaLibrary from "expo-media-library";

// uncomment
import { firebase } from '@react-native-firebase/database';


export default function Home({ }) {

  const [collectData, setCollectData] = useState(false);
  const [setCamera, setSetCamera] = useState(false);
  const [delay, setDelay] = useState(200);
  const [loading, setLoading] = useState(false);
  const [cameraPermissions, setCameraPermissions] = useState(false);

  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();

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

  const acceleroData = useRef({ x: [], y: [], z: [], timestamp: [] });
  const gyroData = useRef({ x: [], y: [], z: [], timestamp: [] });
  const magnetData = useRef({ x: [], y: [], z: [], timestamp: [] });
  const magnetUncData = useRef({ x: [], y: [], z: [], timestamp: [] });
  const motionAccData = useRef({ x: [], y: [], z: [], timestamp: [] });
  const motionAccGravData = useRef({ x: [], y: [], z: [], timestamp: [] });
  const rotationData = useRef({ alpha: [], beta: [], gamma: [], timestamp: [] });
  const rotationRateData = useRef({ alpha: [], beta: [], gamma: [], timestamp: [] });
  const latLongData = useRef({ lat: [], long: [], alt: [], timestamp: [], speed: [], accuracy: [], distance: 0 });

  const getSampleRate = async () => {
    const userID = FIREBASE_AUTH.currentUser?.uid;
    if (userID) {
      try {
        setLoading(true);

        // uncomment
        firebase.app().database('https://roadinsight-fyp-default-rtdb.asia-southeast1.firebasedatabase.app/')
          .ref('users/' + userID)
          .on('value', snapshot => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              setDelay(userData.sampleRate || 200);
            } else {
              console.log("No user data found");
            }
          });

      } catch (error) {
        console.log("Error fetching user data: ", error?.message);
        setDelay(200);
      } finally {
        setLoading(false);
      }
    }
  };

  const isDrawerOpen = useDrawerStatus() === 'open';

  useEffect(() => {
    getSampleRate();
  }, [isDrawerOpen]);

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
        'Latitude and Longitude': latLongData.current
      };

      const userID = FIREBASE_AUTH.currentUser?.uid;

      if (userID) {

        // ##Dashboard Stats

        // uncomment
        const newReference = firebase.app().database('https://roadinsight-fyp-default-rtdb.asia-southeast1.firebasedatabase.app/').ref(`users/${userID}/rides`).push();

        newReference
          .set(dataToPush)
          .then(() => console.log('Data updated.'));
      }

      
    } catch (error) {
      console.log("Error Setting Data: ", error?.message);
      Alert.alert('Data Setting Error', error?.message);
    } finally {
      setLoading(false);
    }
  };

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
      {!loading &&
        <>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Accelero delay={delay} collectData={collectData} data={acceleroData} />
            <Gyro delay={delay} collectData={collectData} data={gyroData} />
            <Magnet delay={delay} collectData={collectData} data={magnetData} />
            <MagnetUnc delay={delay} collectData={collectData} data={magnetUncData} />
            <MotionAcc delay={delay} collectData={collectData} data={motionAccData} />
            <MotionAccGrav delay={delay} collectData={collectData} data={motionAccGravData} />
            <Rotation delay={delay} collectData={collectData} data={rotationData} />
            <RotationRate delay={delay} collectData={collectData} data={rotationRateData} />
            <LatLong delay={delay} collectData={collectData} data={latLongData} />

            {(!setCamera && !collectData) && <Pressable style={styles.button} onPress={() => setSetCamera(true)}>
              <Text style={styles.text}>Set Camera</Text>
            </Pressable>}

            {(!collectData && setCamera) && <Pressable style={cameraPermissions ? styles.button : styles.disabledButton} onPress={() => setCollectData(true)} disabled={!cameraPermissions}>
              <Text style={styles.text}>Collect Data</Text>
            </Pressable>}

            {(collectData && setCamera) && <Pressable style={styles.button} onPress={() => { setCollectData(false) }}>
              <Text style={styles.text}>Stop Collection</Text>
            </Pressable>}
          </ScrollView>

          {setCamera && <View style={styles.cameraContainer}>
            <MobileCam collectData={collectData} setSetCamera={setSetCamera} setCameraPermissions={setCameraPermissions} hasMediaLibraryPermission={hasMediaLibraryPermission} />
          </View>}
        </>
      }

      {loading && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={foregroundColor1} size={60} />
      </View>}
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: '3%',
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
    backgroundColor: buttonBackground,
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
    opacity: 0.7,
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
    flex: 1,
  }

});
