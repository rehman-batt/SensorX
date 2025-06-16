import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Circle } from "react-native-maps";
import { firebase } from "@react-native-firebase/database";
import { geohashQueryBounds, distanceBetween } from "geofire-common";
import Icon from 'react-native-vector-icons/FontAwesome6';

const MapScreen = () => {
  const [conditionData, setConditionData] = useState([]); // Stores fetched road condition data
  const [loading, setLoading] = useState(false);          // Controls activity indicator visibility
  const [region, setRegion] = useState({                  // Initial map region
    latitude: 33.656463,
    longitude: 73.015318,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  const mapRef = useRef(null); // Reference to the MapView instance

  // Calculates search radius based on map zoom level (region deltas)
  const getSearchRadius = (region) => {
    const earthRadius = 6371000; // Earth's radius in meters

    const latDeltaInRad = region.latitudeDelta * (Math.PI / 180);
    const lonDeltaInRad = region.longitudeDelta * (Math.PI / 180);

    const latRadius = (latDeltaInRad / 2) * earthRadius;
    const lonRadius = (lonDeltaInRad / 2) * earthRadius * Math.cos(region.latitude * (Math.PI / 180));

    return Math.min(latRadius, lonRadius, 2500); // Limit max radius to 2.5km
  };

  // Fetch condition data from Firebase within computed geohash bounds
  const fetchConditionData = async () => {
    setLoading(true); // Show loader
    const searchRadius = getSearchRadius(region);
    console.log(`Fetching data within ${searchRadius} meters`);

    try {
      const bounds = geohashQueryBounds([region.latitude, region.longitude], searchRadius);
      let conditionResults = [];

      // Query Firebase for each geohash bound range
      const promises = bounds.map(([start, end]) => {
        return firebase
          .app()
          .database("https://roadinsight-default-rtdb.asia-southeast1.firebasedatabase.app/")
          .ref("conditions")
          .orderByChild("geohash")
          .startAt(start)
          .endAt(end)
          .once("value");
      });

      const snapshots = await Promise.all(promises);

      // Filter results within actual distance radius
      snapshots.forEach((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((child) => {
            const condition = child.val();
            const distance = distanceBetween(
              [region.latitude, region.longitude],
              [condition.lat, condition.long]
            );

            if (distance <= searchRadius) {
              conditionResults.push(condition);
            }
          });
        }
      });

      console.log("Points Checked:", conditionResults.length);
      setConditionData(conditionResults); // Update map markers
    } catch (error) {
      console.error("Error fetching condition data:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  // Update region state when map view changes
  const onRegionChangeComplete = (newRegion) => {
    setRegion(newRegion);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* MapView showing terrain and current location */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={region}
        onRegionChangeComplete={onRegionChangeComplete}
        maxZoomLevel={20}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Render condition circles on map */}
        {conditionData.map((condition, index) => (
          <Circle
            key={index}
            center={{ latitude: condition.lat, longitude: condition.long }}
            radius={12}
            strokeWidth={1}
            strokeColor={condition.color}
            fillColor={`${condition.color}80`} // Add transparency to fill
          />
        ))}
      </MapView>

      {/* Loading spinner during data fetch */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0e4c92" style={{ transform: [{ scale: 1.5 }] }} />
        </View>
      )}

      {/* Floating button to trigger data fetch */}
      <TouchableOpacity style={styles.button} onPress={fetchConditionData} disabled={loading}>
        <Icon name="road-circle-exclamation" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: '#EF4444',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)", // Dark semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MapScreen;
