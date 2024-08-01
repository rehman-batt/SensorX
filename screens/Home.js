import { StyleSheet, View, Text, Pressable } from 'react-native';
import { buttonBackground, buttonForeground } from '../styles/SensorStyles.js';
import { useState } from 'react';
import Gyro from '../components/Gyro.js';
import Accelero from '../components/Accelerometer.js';
import LatLong from '../components/LatLong.js';

export default function Home({ navigation }) {
  
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  function updateLatLong(lat, long) {
    setLatitude(lat);
    setLongitude(long);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Data</Text>
      <Gyro />  
      <Accelero />
      <LatLong latitude={latitude} longitude={longitude} updateLatLong={updateLatLong} />
      <Pressable style={styles.button} onPress={() => navigation.navigate("Map", {latitude, longitude})}>
        <Text style={styles.text}>SHOW ON MAP</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: '6%',

  },
  button: {
    marginTop: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: buttonBackground,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: buttonForeground,
  },
});
