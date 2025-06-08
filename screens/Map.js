import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Circle } from "react-native-maps";
import { firebase } from "@react-native-firebase/database";
import { geohashQueryBounds, distanceBetween } from "geofire-common";

const MapScreen = () => {
  const [conditionData, setConditionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState({
    latitude: 33.656463,
    longitude: 73.015318,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  const mapRef = useRef(null);

  // Function to calculate dynamic search radius
  const getSearchRadius = (latitudeDelta) => {
    // Approximate search radius based on zoom level (latitudeDelta)
    // Math.min(200000, Math.max(1000, latitudeDelta * 50000));
    return Math.min(120000, Math.max(6000, latitudeDelta * 22000));
    // Min 500m when zoomed in, Max 1km when zoomed out
  };


  // Fetch slope data based on map center & zoom level
  const fetchConditionData = async () => {
    setLoading(true);
    const searchRadius = getSearchRadius(region.latitudeDelta);
    console.log(`Fetching data within ${searchRadius} meters`);

    try {
      const bounds = geohashQueryBounds([region.latitude, region.longitude], searchRadius);
      let conditionResults = [];

      const promises = bounds.map(([start, end]) => {
        return firebase
          .app()
          .database("https://roadinsight-default-rtdb.asia-southeast1.firebasedatabase.app/")
          .ref("conditions2")
          .orderByChild("geohash")
          .startAt(start)
          .endAt(end)
          .once("value");
      });

      const snapshots = await Promise.all(promises);

      snapshots.forEach((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((child) => {
            const condition = child.val();
            const distance = distanceBetween([region.latitude, region.longitude], [condition.lat, condition.long]);

            if (distance <= searchRadius) {
              conditionResults.push(condition);
            }
          });
        }
      });

      console.log("Points Checked:", conditionResults.length);
      setConditionData(conditionResults);
    } catch (error) {
      console.error("Error fetching condition data:", error);
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  // Called when the map region changes
  const onRegionChangeComplete = (newRegion) => {
    setRegion(newRegion);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={region}
        onRegionChangeComplete={onRegionChangeComplete}
        maxZoomLevel={20}
      >
        {conditionData.map((condition, index) => (
          <Circle
            key={index}
            center={{ latitude: condition.lat, longitude: condition.long }}
            radius={10}
            strokeWidth={1}
            strokeColor={condition.color}
            fillColor={`${condition.color}80`}
          />
        ))}
      </MapView>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0e4c92" style={{ transform: [{ scale: 1.5 }] }} />
        </View>
      )}

      {/* Styled Button */}
      <TouchableOpacity style={styles.button} onPress={fetchConditionData}>
        <Text style={styles.buttonText}>{loading ? "Fetching..." : "Fetch Conditions for This Area"}</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#0e4c92",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MapScreen;
