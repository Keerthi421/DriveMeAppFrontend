import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OngoingRide = () => {
  const [routeCoords, setRouteCoords] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({ latitude: 44.4001, longitude: -79.6663 });
  const [pickUpLocation, setPickUpLocation] = useState('1 Drive, Georgian College');
  const [dropOffLocation, setDropOffLocation] = useState('Bayfield Drive, Barrie');

  const start = { latitude: 44.4138, longitude: -79.6683 }; // Georgian College, Barrie
  const end = { latitude: 44.3894, longitude: -79.6903 }; // Bayfield Drive, Barrie

  const getRoute = async (start, end) => {
    const apiKey = "5b3ce3597851110001cf6248fc29b786f3804fa5893a8ba99ebb9546";
    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start.longitude},${start.latitude}&end=${end.longitude},${end.latitude}`
      );
      const coordinates = response.data.features[0].geometry.coordinates.map(
        (coord) => ({
          latitude: coord[1],
          longitude: coord[0],
        })
      );
      setRouteCoords(coordinates);
    } catch (error) {
      console.error("Failed to fetch route", error);
      Alert.alert("Error", "Unable to fetch route");
    }
  };

  // Simulate current location update
  useEffect(() => {
    getRoute(start, end);
    const interval = setInterval(() => {
      setCurrentLocation((prevLocation) => ({
        latitude: prevLocation.latitude + 0.0001,
        longitude: prevLocation.longitude + 0.0001,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 44.4001,
          longitude: -79.6663,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={start} />
        <Marker coordinate={end} />
        <Marker coordinate={currentLocation} pinColor="blue" />
        <Polyline coordinates={routeCoords} strokeColor="#1E90FF" strokeWidth={5} />
      </MapView>
      <View style={styles.infoBox}>
        <View style={styles.locationRow}>
          <Icon name="radio-button-checked" size={20} color="#808080" />
          <View style={styles.locationText}>
            <Text style={styles.label}>Pickup</Text>
            <Text style={styles.location}>{pickUpLocation}</Text>
          </View>
        </View>
        <View style={styles.locationRow}>
          <Icon name="place" size={20} color="#808080" />
          <View style={styles.locationText}>
            <Text style={styles.label}>Drop Off</Text>
            <Text style={styles.location}>{dropOffLocation}</Text>
          </View>
        </View>
        <View style={styles.tagContainer}>
          <Text style={styles.tag}>Hatchback</Text>
          <Text style={styles.tag}>Manual</Text>
          <Text style={styles.tag}>600m Away</Text>
        </View>
        <Text style={styles.status}>Ongoing Ride</Text>
      </View>
    </View>
  );
};

export default OngoingRide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  map: {
    flex: 1,
  },
  infoBox: {
    position: "absolute",
    bottom: 5,
    left: 1,
    right: 1,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  locationText: {
    marginLeft: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#808080",
  },
  location: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  tagContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    padding: 5,
    fontSize: 12,
    color: "#000",
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00B140",
    textAlign: "center",
    padding: 10,
  },
});
