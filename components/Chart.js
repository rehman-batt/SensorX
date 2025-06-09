import React, { useState, useEffect, useRef } from 'react';
import { LineChart } from 'react-native-chart-kit';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

const backgroundColor = '#f2f2f2';
const foregroundColor1 = '#0e4c92';
const buttonBackground = '#0e4c92';
const buttonForeground = 'white';
const foregroundColor2 = 'black';

const cardBackground = '#ffffff';
const shadowColor = '#cbd5e1';
const xAxisColor = '#0e4c92';
const yAxisColor = '#059669';
const zAxisColor = '#6D28D9';
const textSecondary = '#64748b';



const LiveChart = ({ name1, data1, name2, data2, name3, data3 }) => {
  const length = data1.length;
  const chartConfig = {
    backgroundColor: cardBackground,
    backgroundGradientFrom: cardBackground,
    backgroundGradientTo: cardBackground,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '0',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#e2e8f0',
      strokeWidth: 1,
    },
  };

  return (
    <View style={styles.container}>

      {/* Current Readings */}
      <View style={styles.readingsContainer}>
        <View style={[styles.readingCard, { borderLeftColor: xAxisColor }]}>
          <Text style={styles.axisLabel}>X-Axis</Text>
          <Text style={[styles.readingValue, { color: xAxisColor }]}>
            {data1[length - 1].toFixed(2)}
          </Text>
          
        </View>
        <View style={[styles.readingCard, { borderLeftColor: yAxisColor }]}>
          <Text style={styles.axisLabel}>Y-Axis</Text>
          <Text style={[styles.readingValue, { color: yAxisColor }]}>
            {data2[length - 1].toFixed(2)}
          </Text>
         
        </View>
        <View style={[styles.readingCard, { borderLeftColor: zAxisColor }]}>
          <Text style={styles.axisLabel}>Z-Axis</Text>
          <Text style={[styles.readingValue, { color: zAxisColor }]}>
            {data3[length - 1].toFixed(2)}
          </Text>
          
        </View>
      </View>

      <LineChart
        bezier
        data={{
          labels: Array.from({ length: length }, (_, i) => i + 1),
          datasets: [
            {
              data: data1,
              strokeWidth: 2,
              color: () => xAxisColor,
            },
            {
              data: data2,
              strokeWidth: 2,
              color: () => yAxisColor,
            },
            {
              data: data3,
              strokeWidth: 2,
              color: () => zAxisColor,
            },
          ],
          legend: [name1, name2, name3],
        }}
        width={Dimensions.get('window').width - 10}
        height={300}
        chartConfig={chartConfig}
        fromZero={true}

        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        withDots={false}
        style={styles.chart}



      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    marginTop: 65,
  },
  readingsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  readingCard: {
    flex: 1,
    backgroundColor: cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  axisLabel: {
    fontSize: 14,
    color: textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  readingValue: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  chart: {
    borderRadius: 8,
  },
  
  
 
  
});


export default LiveChart;

















