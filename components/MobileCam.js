import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { StyleSheet, Pressable, View, Text, Linking, Alert, Platform } from 'react-native';
import { camerBackground } from '../styles/SensorStyles';
import React, { useState, useEffect, useRef } from 'react';
import * as MediaLibrary from "expo-media-library";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useFocusEffect } from '@react-navigation/native';
import { FIREBASE_AUTH, db } from '../config/firebase.js';
import { Svg, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { firebase } from '@react-native-firebase/database';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function MobileCam({ collectData, setSetCamera, setCameraPermissions, hasMediaLibraryPermission }) {
  const [permission, requestPermission, getPermission] = useCameraPermissions();
  const [mPermissions, useMPermissions, getMPermissions] = useMicrophonePermissions();
  const [recording, setRecording] = useState(false);
  const cameraRef = useRef(null);

  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState([]);
  const [notification, setNotification] = useState(
    undefined
  );
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Video Saved",
        body: 'The Video has been saved to the RoadInSight Album in the Media Gallery',

      },
      trigger: null,
    });
  }

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        Linking.openSettings();

        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      // EAS projectId is used here.
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
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

  const videoRecording = async () => {

    if (collectData && !recording && cameraRef.current) {
      setRecording(true);

      const options = {
        quality: '480p',
        mute: false,
      };

      try {
        const video = await cameraRef.current.recordAsync(options);
        setRecording(false);
        setSetCamera(false);
        try {
          console.log(video.uri);

          let album = await MediaLibrary.getAlbumAsync('RoadInSight');
          let asset = await MediaLibrary.createAssetAsync(video.uri);

          if (album == null) {
            try {
              const result = await MediaLibrary.createAlbumAsync('RoadInSight', asset, false);
              if (result) {
                await schedulePushNotification();
                console.log('Asset added to album successfully.');
              } else {
                console.log('Failed to add asset to album.');
              }
            } catch (error) {
              console.error('Error adding asset to album:', error);
            }

          } else {

            try {
              const result = await MediaLibrary.addAssetsToAlbumAsync(asset, album, false);
              if (result) {
                await schedulePushNotification();
                console.log('Asset added to album successfully.');

                try {
                  const userID = FIREBASE_AUTH.currentUser?.uid;
                  if (userID) {

                    const parts = video.uri.split("/");
                    const fileName = parts[parts.length - 1];


                    // uncomment
                    const newReference = firebase.app().database('https://roadinsight-default-rtdb.asia-southeast1.firebasedatabase.app/').ref(`users/${userID}/videos`).push();

                    newReference
                      .set(fileName)
                      .then(() => console.log('Data updated.'));
                  }
                } catch (error) {
                  console.log("Error Setting Data: ", error);
                  Alert.alert('Data Setting Error', error);
                }

              } else {
                console.log('Failed to add asset to album.');
              }
            } catch (error) {
              console.error('Error adding asset to album:', error);
            }

          }


        } catch {
          console.error("Saving error:", error);
          Alert.alert("Error", error.message || "An unknown error occurred");

        }
      } catch (error) {
        console.error("Recording error:", error);
        Alert.alert("Error", error.message || "An unknown error occurred");
      }
    } else if (!collectData && recording && cameraRef.current) {
      cameraRef.current.stopRecording();
      setRecording(false);
      setSetCamera(false); 
    }
  };

  useEffect(() => {
    videoRecording();
  }, [collectData]);


  useFocusEffect(
    React.useCallback(() => {
      if (permission?.granted == true && mPermissions?.granted == true && hasMediaLibraryPermission) {
        setCameraPermissions(permission && mPermissions && hasMediaLibraryPermission);
      }
    }, [permission, mPermissions, hasMediaLibraryPermission])
  );


  if ((!permission) || (!mPermissions)) {
    return <View />;
  }

  if ((!permission.granted) || (!mPermissions.granted)) {
    return (
      <View style={styles.container}>
        <Pressable
          onPress={async () => {
            try {
              const camPermission = await requestPermission();
              const micPermission = await useMPermissions();
              if (camPermission.granted && micPermission.granted && hasMediaLibraryPermission) {
                setCameraPermissions(true);
              } else {
                Alert.alert(
                  "Permissions Required",
                  "This app needs access to the camera, microphone, and gallery. Please grant these permissions to proceed.",
                  [
                    { text: "Go to Settings", onPress: () => Linking.openSettings() },
                    { text: "Cancel" },
                  ]
                );
              }
            } catch (error) {
              console.error("Permission error:", error);
            }
          }}
          style={styles.button}
        >

          <Text style={styles.text}>GRANT</Text>
          <Text style={styles.text}>PERMISSION</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView mode="video" style={styles.camera} type={'back'} ref={cameraRef} />
      <Svg style={styles.overlay} height="100%" width="100%">
      
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">

          <Stop offset="100%" stopColor="red" stopOpacity="0.4" />
            <Stop offset="50%" stopColor="green" stopOpacity="0.4" />
            <Stop offset="0%" stopColor="yellow" stopOpacity="0.4" />
            
          </LinearGradient>
        </Defs>
        <Line x1="10%" y1="20%" x2="10%" y2="80%" stroke="url(#grad)" strokeWidth="10" />
        <Line x1="90%" y1="20%" x2="90%" y2="80%" stroke="url(#grad)" strokeWidth="10" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: camerBackground,
    borderRadius: 10,
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 10,
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,

  },
  camera: {
    width: '100%',
    flex: 1,
    borderRadius: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
  },
  text: {
    color: 'white',
    fontSize: 15,
  },
});
