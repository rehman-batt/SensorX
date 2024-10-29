import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import { camerBackground } from '../styles/SensorStyles';
import { useState, useEffect, useRef } from 'react';
import * as MediaLibrary from "expo-media-library";

export default function MobileCam({ collectData, setSetCamera }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [mPermissions, useMPermissions] = useMicrophonePermissions();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [recording, setRecording] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);



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
        try {
          console.log(video.uri);
          await MediaLibrary.saveToLibraryAsync(video.uri);
          
        } catch {
          console.error("Saving error:", error);
        } finally {
          setSetCamera(false);
        }
      } catch (error) {
        console.error("Recording error:", error);
      }
    } else if (!collectData && recording && cameraRef.current) {
      cameraRef.current.stopRecording();
      setRecording(false);
    }
  };

  useEffect(() => {
    videoRecording();
  }, [collectData]);

  if ((!permission) || (!mPermissions)) {
    return <View />;
  }

  if ((!permission.granted) || (!mPermissions.granted)) {
    return (
      <View style={styles.container}>
        <Pressable onPress={() => { requestPermission(); useMPermissions(); }} style={styles.button}>
          <Text style={styles.text}>GRANT</Text>
          <Text style={styles.text}>PERMISSION</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView mode="video" style={styles.camera} type={'back'} ref={cameraRef} />
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
  camera: {
    width: '100%',
    flex: 1,
    borderRadius: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
  },
  text: {
    color: 'white',
    fontSize: 17,
  },
});
