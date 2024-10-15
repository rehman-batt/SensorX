import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const LiveChart = ({ name1, data1, name2, data2, name3, data3 }) => {

  const chartConfig = {
    backgroundGradientFrom: '#f2f2f2',
    backgroundGradientTo: '#f2f2f2',
    color: (opacity = 1) => `rgba(14, 76, 146, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <View style={styles.container}>
      <LineChart
        bezier
        data={{
          labels: Array.from({ length: data1.length }, (_, i) => i + 1),
          datasets: [
            {
              data: data1,
              strokeWidth: 2,
              color: (opacity = 1) => `rgba(237, 96, 62, ${opacity})`,
            },
            {
              data: data2,
              strokeWidth: 2,
              color: (opacity = 1) => `rgba(235, 193, 84, ${opacity})`,
            },
            {
              data: data3,
              strokeWidth: 2,
              color: (opacity = 1) => `rgba(54, 193, 190, ${opacity})`,
            },
          ],
          legend: [name1, name2, name3],
        }}
        width={Dimensions.get('window').width - 10}
        height={300}
        chartConfig={chartConfig}
        fromZero={true}
        style={{
          borderRadius: 16,
          marginRight: 25,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    marginTop: 50,
  },
});

export default LiveChart;
