import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { buttonBackground, buttonForeground, foregroundColor1 } from '../styles/SensorStyles.js';
import { useState } from 'react';
import Gyro from '../components/Gyro.js';
import Accelero from '../components/Accelerometer.js';
import LatLong from '../components/LatLong.js';
import Magnet from '../components/Magnetometer.js';
import MotionAcc from '../components/MotionAcc.js';
import Slider from '@react-native-community/slider';
import MotionAccGrav from '../components/MotionAccGrav.js';
import Rotation from '../components/Rotation.js';
import RotationRate from '../components/RotationRate.js';
import MagnetUnc from '../components/MagnetometerUncalibrated.js';

export default function Home({ navigation }) {

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [delay, setDelay] = useState(200);
  const [collectData, setCollectData] = useState(false);
  const [user, SetUser] = useState('Abdul');

  function updateLatLong(lat, long) {
    setLatitude(lat);
    setLongitude(long);
  }

  return (

    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Accelero delay={delay} collectData={collectData} />
      <Gyro delay={delay} />
      <Magnet delay={delay} />
      <MagnetUnc delay={delay} />
      <MotionAcc delay={delay} />
      <MotionAccGrav delay={delay} />
      <Rotation delay={delay} />
      <RotationRate delay={delay} />
      <LatLong latitude={latitude} longitude={longitude} updateLatLong={updateLatLong} delay={delay} />
      <Slider
        style={{ width: '75%', height: 40 }}
        minimumValue={100}
        maximumValue={1000}
        minimumTrackTintColor={foregroundColor1}
        maximumTrackTintColor="#000000"
        thumbTintColor={foregroundColor1}
        value={200}
        onValueChange={(curr) => { setDelay(curr) }}
        step={50}
      />
      <Text>{delay}</Text>
      
      {!collectData && <Pressable style={styles.button} onPress={() => setCollectData(true)}>
        <Text style={styles.text}>Collect Data</Text>
      </Pressable>}

      {collectData && <Pressable style={styles.button} onPress={() => setCollectData(false)}>
        <Text style={styles.text}>Stop Collection</Text>
      </Pressable>}

    </ScrollView>

  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: '3%',
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
