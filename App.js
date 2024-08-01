import { StyleSheet, View, Text } from 'react-native';
import Gyro from './components/Gyro.js';
import Accelero from './components/Accelerometer.js';

export default function App() {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Data</Text>
      <Gyro /> 
      <Accelero />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '15%',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: '3%',

  },
});
