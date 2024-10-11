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

const LiveChart = ({ name, data }) => {

  const chartConfig = {
    backgroundGradientFrom: '#f2f2f2',
    backgroundGradientTo: '#f2f2f2',
    color: (opacity = 1) => `rgba(14, 76, 146, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
  };

  return (
    
    <View style={styles.container}>
      <Text style={styles.chartTitle}>{name}</Text>
      <LineChart
        data={{
          labels: Array.from({ length: data.length }, (_, i) => i + 1),
          datasets: [{ data: data }],
        }}
        width={Dimensions.get('window').width - 100}
        height={160}
        chartConfig={chartConfig}
        bezier
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    // marginVertical: 10,
    color: '#0e4c92',
  },
  chartTitle: {
    fontSize: 18,
    marginVertical: 8,
    textAlign: 'center',
    color: 'black',
  },
});

export default LiveChart;


