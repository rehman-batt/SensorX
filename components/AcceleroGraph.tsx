// import { Text, View, Image } from 'react-native';
// import { Accelerometer } from 'expo-sensors';
// import React, { useState, useRef } from 'react';
// import { useFocusEffect } from '@react-navigation/native';
// import { styles } from '../styles/SensorStyles';
// import LiveChart from "../components/Chart";

// export default function AcceleroGraph({ }) {
//     const [status, setStatus] = useState(false);
//     const [errorMsg, setErrorMsg] = useState('Please provide permission to access Accelerometer');
//     const [accelerometerData, setAccelerometerData] = useState({
//         x: Array(10).fill(0),
//         y: Array(10).fill(0),
//         z: Array(10).fill(0),
//     });

//     const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;
//     const subscription = useRef(null);

//     Accelerometer.setUpdateInterval(1000);

//     useFocusEffect(
//         React.useCallback(() => {
//             let isActive = true;

//             (async () => {
//                 try {
//                     let permissionStatus = await Accelerometer.requestPermissionsAsync();
//                     if (permissionStatus.status !== 'granted') {
//                         setErrorMsg('Please provide permission to access Accelerometer');
//                         return;
//                     } else {
//                         setStatus(true);
//                         setErrorMsg(null);
            
//                         try {
//                             subscription.current = Accelerometer.addListener(({ x, y, z }) => {
//                                 try {
//                                     if (isActive) {
//                                         setAccelerometerData((prevData) => ({
//                                             x: [...prevData.x.slice(-9), roundToTwoDecimals(x)],
//                                             y: [...prevData.y.slice(-9), roundToTwoDecimals(y)],
//                                             z: [...prevData.z.slice(-9), roundToTwoDecimals(z)],
//                                         }));
//                                     }
//                                 } catch (e) {
//                                     setErrorMsg('An error occurred while processing accelerometer data');
//                                 }
//                             });
//                         } catch (e) {
//                             setErrorMsg('An error occurred while starting accelerometer listener');
//                         }
//                     }
//                 } catch (e) {
//                     setErrorMsg('An error occurred while requesting accelerometer permission');
//                 }
//             })();
            

//             return () => {
//                 isActive = false;

//                 if (subscription.current) {
//                     console.log('Accelerometer listener removed');
//                     subscription.current.remove();
//                     subscription.current = null;
//                 }
//             };
//         }, [])
//     );

//     return (
//         <View style={{ flex: 1, justifyContent: 'center' }}>
//             {errorMsg &&
//                 <View style={styles.errorContainer}>
//                     <View style={styles.errorView}>
//                         <Text style={styles.errorText}>{errorMsg}</Text>
//                     </View>
//                 </View>
//             }

//             {!errorMsg &&
//                 <View style={styles.GraphContainer}>
//                     <Text style={styles.GraphTitle}>Accelerometer</Text>
//                     <LiveChart name1={'X-axis'} data1={accelerometerData.x} name2={'Y-axis'} data2={accelerometerData.y} name3={'Z-axis'} data3={accelerometerData.z} />

//                 </View>
//             }

//         </View>
//     );
// }


import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { LineChart } from 'react-native-chart-kit';
import { Play, Pause, RotateCcw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export default function AcceleroGraph() {
  const [data, setData] = useState<AccelerometerData[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentReading, setCurrentReading] = useState<AccelerometerData>({
    x: 0,
    y: 0,
    z: 0,
    timestamp: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const subscription = useRef<any>(null);
  const maxDataPoints = 50;

  useEffect(() => {
    checkAvailability();
    return () => {
      if (subscription.current) {
        subscription.current.remove();
      }
    };
  }, []);

  const checkAvailability = async () => {
    if (Platform.OS === 'web') {
      setIsAvailable(false);
      setError('Accelerometer is not available on web platform');
      return;
    }

    try {
      const available = await Accelerometer.isAvailableAsync();
      setIsAvailable(available);
      if (!available) {
        setError('Accelerometer is not available on this device');
      }
    } catch (err) {
      setIsAvailable(false);
      setError('Error checking accelerometer availability');
    }
  };

  const startRecording = () => {
    if (!isAvailable) return;

    setError(null);
    Accelerometer.setUpdateInterval(100); // 10 Hz

    subscription.current = Accelerometer.addListener((accelerometerData) => {
      const newReading: AccelerometerData = {
        x: accelerometerData.x,
        y: accelerometerData.y,
        z: accelerometerData.z,
        timestamp: Date.now(),
      };

      setCurrentReading(newReading);
      setData((prevData) => {
        const newData = [...prevData, newReading];
        return newData.slice(-maxDataPoints);
      });
    });

    setIsRecording(true);
  };

  const stopRecording = () => {
    if (subscription.current) {
      subscription.current.remove();
      subscription.current = null;
    }
    setIsRecording(false);
  };

  const resetData = () => {
    setData([]);
    setCurrentReading({ x: 0, y: 0, z: 0, timestamp: 0 });
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getChartData = (axis: 'x' | 'y' | 'z') => ({
    labels: data.map((_, index) => (index % 10 === 0 ? index.toString() : '')),
    datasets: [
      {
        data: data.length > 0 ? data.map((d) => d[axis]) : [0],
        color: (opacity = 1) => {
          const colors = {
            x: `rgba(59, 130, 246, ${opacity})`, // Blue
            y: `rgba(34, 197, 94, ${opacity})`, // Green
            z: `rgba(239, 68, 68, ${opacity})`, // Red
          };
          return colors[axis];
        },
        strokeWidth: 2,
      },
    ],
  });

  const chartConfig = {
    backgroundColor: '#1a1a1a',
    backgroundGradientFrom: '#1a1a1a',
    backgroundGradientTo: '#2a2a2a',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '0',
    },
  };

  if (!isAvailable) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Accelerometer Unavailable</Text>
          <Text style={styles.errorText}>
            {Platform.OS === 'web'
              ? 'The accelerometer sensor is not available on web browsers. Please try this app on a mobile device.'
              : 'This device does not support accelerometer functionality.'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Accelerometer Live Data</Text>
          <Text style={styles.subtitle}>Real-time sensor monitoring</Text>
        </View>

        {/* Current Readings */}
        <View style={styles.readingsContainer}>
          <View style={styles.readingCard}>
            <Text style={styles.axisLabel}>X-Axis</Text>
            <Text style={[styles.readingValue, { color: '#3b82f6' }]}>
              {currentReading.x.toFixed(3)}
            </Text>
          </View>
          <View style={styles.readingCard}>
            <Text style={styles.axisLabel}>Y-Axis</Text>
            <Text style={[styles.readingValue, { color: '#22c55e' }]}>
              {currentReading.y.toFixed(3)}
            </Text>
          </View>
          <View style={styles.readingCard}>
            <Text style={styles.axisLabel}>Z-Axis</Text>
            <Text style={[styles.readingValue, { color: '#ef4444' }]}>
              {currentReading.z.toFixed(3)}
            </Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.controlButton, isRecording && styles.stopButton]}
            onPress={toggleRecording}
          >
            {isRecording ? (
              <Pause size={24} color="white" />
            ) : (
              <Play size={24} color="white" />
            )}
            <Text style={styles.controlButtonText}>
              {isRecording ? 'Stop' : 'Start'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={resetData}>
            <RotateCcw size={24} color="#6b7280" />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Charts */}
        {data.length > 0 && (
          <View style={styles.chartsContainer}>
            <View style={styles.chartWrapper}>
              <Text style={styles.chartTitle}>X-Axis (Blue)</Text>
              <LineChart
                data={getChartData('x')}
                width={screenWidth - 40}
                height={180}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>

            <View style={styles.chartWrapper}>
              <Text style={styles.chartTitle}>Y-Axis (Green)</Text>
              <LineChart
                data={getChartData('y')}
                width={screenWidth - 40}
                height={180}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>

            <View style={styles.chartWrapper}>
              <Text style={styles.chartTitle}>Z-Axis (Red)</Text>
              <LineChart
                data={getChartData('z')}
                width={screenWidth - 40}
                height={180}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>
          </View>
        )}

        {/* Status */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, isRecording && styles.recordingIndicator]} />
          <Text style={styles.statusText}>
            {isRecording ? 'Recording...' : 'Stopped'} • {data.length} samples
          </Text>
        </View>

        {error && (
          <View style={styles.inlineErrorContainer}>
            <Text style={styles.inlineErrorText}>{error}</Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  readingsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  readingCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  axisLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '500',
  },
  readingValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  controlsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  controlButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minWidth: 100,
  },
  resetButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  chartsContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  chartWrapper: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
    paddingLeft: 4,
  },
  chart: {
    borderRadius: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6b7280',
    marginRight: 8,
  },
  recordingIndicator: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
  },
  inlineErrorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 20,
    marginTop: 20,
  },
  inlineErrorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
  },
});