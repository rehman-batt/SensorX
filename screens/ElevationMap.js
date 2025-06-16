import React, { useState, useRef } from "react";
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Circle } from "react-native-maps";
import { firebase } from "@react-native-firebase/database";
import { geohashQueryBounds, distanceBetween } from "geofire-common";
import Icon from 'react-native-vector-icons/Entypo';

const ElevationMap = () => {
  const [slopeData, setSlopeData] = useState([]); // Stores fetched slope data
  const [loading, setLoading] = useState(false);  // Loading indicator for fetch
  const [region, setRegion] = useState({         // Initial map region
    latitude: 33.656463,
    longitude: 73.015318,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  const mapRef = useRef(null); // Reference to the MapView

  // Dynamically calculates the search radius based on map zoom
  const getSearchRadius = (region) => {
    const earthRadius = 6371000; // in meters
    const latDeltaInRad = region.latitudeDelta * (Math.PI / 180);
    const lonDeltaInRad = region.longitudeDelta * (Math.PI / 180);

    const latRadius = (latDeltaInRad / 2) * earthRadius;
    const lonRadius = (lonDeltaInRad / 2) * earthRadius * Math.cos(region.latitude * (Math.PI / 180));

    return Math.min(latRadius, lonRadius, 2500); // Limit max radius to 2500m
  };

  // Fetch slope data from Firebase within geohash bounds
  const fetchSlopeData = async () => {
    setLoading(true);
    const searchRadius = getSearchRadius(region);
    console.log(`Fetching data within ${searchRadius} meters`);

    try {
      const bounds = geohashQueryBounds([region.latitude, region.longitude], searchRadius);
      let slopeResults = [];

      // Create a Firebase query for each geohash range
      const promises = bounds.map(([start, end]) => {
        return firebase
          .app()
          .database("https://roadinsight-default-rtdb.asia-southeast1.firebasedatabase.app/")
          .ref("slopes")
          .orderByChild("geohash")
          .startAt(start)
          .endAt(end)
          .once("value");
      });

      const snapshots = await Promise.all(promises);

      // Filter results by actual distance
      snapshots.forEach((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((child) => {
            const slope = child.val();
            const distance = distanceBetween(
              [region.latitude, region.longitude],
              [slope.lat, slope.long]
            );

            if (distance <= searchRadius) {
              slopeResults.push(slope);
            }
          });
        }
      });

      console.log("Points Checked:", slopeResults.length);
      setSlopeData(slopeResults); // Update state with valid slopes
    } catch (error) {
      console.error("Error fetching slope data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update region when map drag/zoom ends
  const onRegionChangeComplete = (newRegion) => {
    setRegion(newRegion);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Terrain map view with slope points overlay */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={region}
        onRegionChangeComplete={onRegionChangeComplete}
        maxZoomLevel={20}
        mapType="terrain"
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {slopeData.map((slope, index) => (
          <Circle
            key={index}
            center={{ latitude: slope.lat, longitude: slope.long }}
            radius={12}
            strokeWidth={1}
            strokeColor={slope.color}
            fillColor={`${slope.color}80`} // Slight transparency
          />
        ))}
      </MapView>

      {/* Loader overlay during fetch */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0e4c92" style={{ transform: [{ scale: 1.5 }] }} />
        </View>
      )}

      {/* Button to trigger slope data fetch */}
      <TouchableOpacity style={styles.button} onPress={fetchSlopeData} disabled={loading}>
        <Icon name="area-graph" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: '#EF4444', // Red color
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    paddingRight: 4,
    paddingBottom: 2,
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

export default ElevationMap;
