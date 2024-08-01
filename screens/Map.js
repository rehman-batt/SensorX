import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function Map({ route }) {

  const { latitude, longitude } = route.params;

  return (
    <View style={styles.container}>
      <MapView style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }} >

        <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude
          }}
        />

      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
