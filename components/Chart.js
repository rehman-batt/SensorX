// import { LineChart } from "react-native-chart-kit";
// import { Text, View, Dimensions } from 'react-native';
// import { useState, useEffect } from "react";

// export default function Chart() {

//     const [data, setData] = useState(Array(15).fill(0));
//     const [st, setSt] = useState(false);

//     // useEffect(() => {
//     //     const timeoutId = setTimeout(() => {
//     //         if (st) {
//     //             setData((prev) => {
//     //                 let curr = [...prev, 1];
//     //                 curr.shift();
//     //                 return curr;
//     //             })
//     //         }
//     //         else {
//     //             setData((prev) => {
//     //                 let curr = [...prev, 2];
//     //                 curr.shift();
//     //                 return curr;
//     //             })
//     //         }

//     //     }, 1000);

//     //     return () => clearTimeout(timeoutId);
//     // }, []);

//     setTimeout(() => {
//         console.log('Hello2');
//     }, 1000);
    
//     useEffect(() => {
//         console.log('Effect triggered');
//         const timeoutId = setTimeout(() => {
//             console.log('Hello2');
//         }, 1000);
    
//         return () => {
//             console.log('Cleanup function called');
//             clearTimeout(timeoutId);
//         };
//     }, []);
    

//     console.log('Hello', data)

//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text>Test Line Chart</Text>
//             <LineChart
//                 data={{
//                     labels: Array.from({ length: 15 }, (_, index) => index + 1),
//                     datasets: [
//                         {
//                             data: data
//                         }
//                     ]
//                 }}
//                 width={Dimensions.get("window").width - Dimensions.get("window").width * (5 / 100)} // from react-native
//                 height={280}
//                 yAxisLabel=""
//                 yAxisSuffix=""
//                 yAxisInterval={1} // optional, defaults to 1
//                 chartConfig={{
//                     backgroundColor: "#e26a00",
//                     backgroundGradientFrom: "#fb8c00",
//                     backgroundGradientTo: "#ffa726",
//                     decimalPlaces: 2, // optional, defaults to 2dp
//                     color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//                     labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//                     style: {
//                         borderRadius: 16
//                     },
//                     propsForDots: {
//                         r: "6",
//                         strokeWidth: "2",
//                         stroke: "#ffa726"
//                     }
//                 }}
//                 bezier
//                 style={{
//                     marginVertical: 8,
//                     borderRadius: 16
//                 }}
//             />
//         </View>
//     )
// }

import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { LineChart } from 'react-native-chart-kit';

const LiveChart = () => {
    const [accelerometerData, setAccelerometerData] = useState({
        x: Array(20).fill(0),
        y: Array(20).fill(0),
        z: Array(20).fill(0),
      });
      
    const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;

  useEffect(() => {
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      setAccelerometerData((prevData) => ({
        x: [...prevData.x.slice(-20), roundToTwoDecimals(x)], 
        y: [...prevData.y.slice(-20), roundToTwoDecimals(y)],
        z: [...prevData.z.slice(-20), roundToTwoDecimals(z)],
      }));
      
    });

    Accelerometer.setUpdateInterval(1000);

    return () => {
      subscription && subscription.remove();
    };
  }, []);

  const chartConfig = {
    backgroundGradientFrom: '#f2f2f2',
    backgroundGradientTo: '#f2f2f2',
    color: (opacity = 1) => `rgba(14, 76, 146, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, 
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Live Accelerometer Data</Text>

        <Text style={styles.chartTitle}>X-axis</Text>
        <LineChart
          data={{
            labels: Array.from({ length: accelerometerData.x.length }, (_, i) => i + 1),
            datasets: [{ data: accelerometerData.x }],
          }}
          width={Dimensions.get('window').width - 20}
          height={220}
          chartConfig={chartConfig}
          bezier
        />

        <Text style={styles.chartTitle}>Y-axis</Text>
        <LineChart
          data={{
            labels: Array.from({ length: accelerometerData.y.length }, (_, i) => i + 1),
            datasets: [{ data: accelerometerData.y }],
          }}
          width={Dimensions.get('window').width - 20}
          height={220}
          chartConfig={chartConfig}
          bezier
        />

        <Text style={styles.chartTitle}>Z-axis</Text>
        <LineChart
          data={{
            labels: Array.from({ length: accelerometerData.z.length }, (_, i) => i + 1),
            datasets: [{ data: accelerometerData.z }],
          }}
          width={Dimensions.get('window').width - 20}
          height={220}
          chartConfig={chartConfig}
          bezier
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#0e4c92',
  },
  chartTitle: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
    color: 'black',
  },
});

export default LiveChart;


// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
// import { Accelerometer } from 'expo-sensors';
// import { LineChart } from 'react-native-chart-kit';

// const DATA_SIZE = 20;  // Keep 30 data points

// const LiveChart = () => {
//   const [accelerometerData, setAccelerometerData] = useState({
//     x: Array(DATA_SIZE).fill(0),
//     y: Array(DATA_SIZE).fill(0),
//     z: Array(DATA_SIZE).fill(0),
//   });

//   // Memoized chart configuration to avoid re-renders
//   const chartConfig = useMemo(() => ({
//     backgroundGradientFrom: '#f2f2f2',
//     backgroundGradientTo: '#f2f2f2',
//     color: (opacity = 1) => `rgba(14, 76, 146, ${opacity})`,
//     labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//     strokeWidth: 2,
//   }), []);

//   const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;

//   // Function to update accelerometer data with rounded values
//   const updateData = useCallback(({ x, y, z }) => {
//     setAccelerometerData((prevData) => {
//       const newX = [...prevData.x.slice(1), roundToTwoDecimals(x)];
//       const newY = [...prevData.y.slice(1), roundToTwoDecimals(y)];
//       const newZ = [...prevData.z.slice(1), roundToTwoDecimals(z)];
//       return { x: newX, y: newY, z: newZ };
//     });

//   }, []);

//   useEffect(() => {
//     const subscription = Accelerometer.addListener(updateData);
//     Accelerometer.setUpdateInterval(1000); 

//     return () => subscription && subscription.remove(); 
//   }, [updateData]);

//   return (
//     <ScrollView>
//       <View style={styles.container}>
//         <Text style={styles.title}>Live Accelerometer Data</Text>

//         {/* X-axis Chart */}
//         <Text style={styles.chartTitle}>X-axis</Text>
//         <LineChart
//           data={{
//             labels: Array.from({ length: DATA_SIZE }, (_, i) => i + 1),
//             datasets: [{ data: accelerometerData.x }],
//           }}
//           width={Dimensions.get('window').width - 20}
//           height={220}
//           chartConfig={chartConfig}
//           bezier
//         />

//         {/* Y-axis Chart */}
//         <Text style={styles.chartTitle}>Y-axis</Text>
//         <LineChart
//           data={{
//             labels: Array.from({ length: DATA_SIZE }, (_, i) => i + 1),
//             datasets: [{ data: accelerometerData.y }],
//           }}
//           width={Dimensions.get('window').width - 20}
//           height={220}
//           chartConfig={chartConfig}
//           bezier
//         />

//         {/* Z-axis Chart */}
//         <Text style={styles.chartTitle}>Z-axis</Text>
//         <LineChart
//           data={{
//             labels: Array.from({ length: DATA_SIZE }, (_, i) => i + 1),
//             datasets: [{ data: accelerometerData.z }],
//           }}
//           width={Dimensions.get('window').width - 20}
//           height={220}
//           chartConfig={chartConfig}
//           bezier
//         />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//     backgroundColor: '#f2f2f2',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginVertical: 10,
//     color: '#0e4c92',
//   },
//   chartTitle: {
//     fontSize: 18,
//     marginVertical: 10,
//     textAlign: 'center',
//     color: 'black',
//   },
// });

// export default LiveChart;


// import React from "react";
// import { Line } from "react-chartjs-2";
// import Chart from "chart.js/auto";
// import { StreamingPlugin, RealTimeScale } from "chartjs-plugin-streaming";
// Chart.register(StreamingPlugin, RealTimeScale);

// export const IotChart = () => {
//   const data = {
//     datasets: [
//       {
//         label: "Dataset 1",

//         fill: false,
//         lineTension: 0.4,
//         backgroundColor: "#f44336",
//         borderColor: "#f44336",
//         borderJoinStyle: "miter",
//         pointRadius: 0,
//         showLine: true,
//         data: [],
//       },
//     ],
//   };

//   const options = {
//     scales: {
//       xAxes: [
//         {
//           type: "realtime",
//           realtime: {
//             onRefresh: function () {
//               data.datasets[0].data.push({
//                 x: Date.now(),
//                 y: Math.random() * 100,
//               });
//             },
//             delay: 300,
//             refresh: 300,
//           },
//         },
//       ],
//       yAxes: [
//         {
//           scaleLabel: {
//             display: true,
//             fontFamily: "Arial",
//             labelString: "Moment",
//             fontSize: 20,
//             fontColor: "#6c757d",
//           },
//           ticks: {
//             max: 100,
//             min: 0,
//           },
//         },
//       ],
//     },
//   };

//   return (
//     <div>
//       <div>
//         <Line data={data} options={options} width={400} height={200} />
//       </div>
//     </div>
//   );
// };