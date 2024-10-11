import { CameraView, useCameraPermissions } from 'expo-camera';
import {  StyleSheet, Pressable, View, Text } from 'react-native';
import { camerBackground } from '../styles/SensorStyles';

export default function MobileCam() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    
    return (
      <View style={styles.container}>
        <Pressable onPress={requestPermission} style={styles.button} >
            <Text style={styles.text}>GRANT</Text>
            <Text style={styles.text}>PERMISSION</Text>    
        </Pressable>
      </View>
    );
  }



  return (
    <View style={styles.cameraContainer}>
      <CameraView style={styles.camera} facing={'back'}>
      </CameraView>
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
    
  },
  text: {
    color: 'white',
    fontSize: 17,
  }
});
