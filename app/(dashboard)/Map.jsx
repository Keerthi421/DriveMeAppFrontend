import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { useRouter } from "expo-router";
import { setHandleSelectLocation } from "./FunctionStore";
import ScheduleDriver from "./scheduleDriver";

const Map = (props) => {
  const router = useRouter();
  const [pickUpLocation, setPickUpLocation] = useState("");
  const [dropOffLocation, setDropOffLocation] = useState("");
  const [routeCoords, setRouteCoords] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [region, setRegion] = useState({
    latitude: 44.41639,
    longitude: -79.66951,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [rideDetails, setRideDetails] = useState(props.rideDetails);

  const [locationPickup, setLocationPickup] = useState(() => {
    try {
      return props.rideDetails?.locationPickup
        ? JSON.parse(props.rideDetails.locationPickup)
        : null;
    } catch (e) {
      console.error("Failed to parse locationPickUp:", e);
      return null;
    }
  });

  const [locationDropOff, setLocationDropoff] = useState(() => {
    try {
      return props.rideDetails?.locationDropoff
        ? JSON.parse(props.rideDetails?.locationDropoff)
        : null;
    } catch (e) {
      console.error("Failed to parse locationDropOff:", e);
      return null;
    }
  });
  useEffect(() => {
    const requestAndLoadLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Permission to access location was denied"
        );
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      getReverseGeocodingData(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
      if (rideDetails) {
        setPickUpLocation(rideDetails.pickUpLocation);
        setDropOffLocation(rideDetails.dropOffLocation);
        setSelectedLocation(locationDropOff);

        getRoute(
          {
            latitude: locationPickup.coordinates[1],
            longitude: locationPickup.coordinates[0],
          },
          {
            latitude: locationDropOff.coordinates[1],
            longitude: locationDropOff.coordinates[0],
          }
        );
      }
    };

    requestAndLoadLocation();
  }, []);

  const getReverseGeocodingData = async (lat, lng) => {
    const apiKey = "5b3ce3597851110001cf624802f10318ff3244c68e1a1588ecd3fe27";
    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lat=${lat}&point.lon=${lng}&size=1`
      );
      if (response.data.features && response.data.features.length > 0) {
        const address = response.data.features[0].properties.label;
        setPickUpLocation(address);
        setLocationPickup({
          coordinates: [region.latitude, region.longitude],
          address,
        });
      }
    } catch (error) {
      console.error("Failed to fetch the address", error);
      Alert.alert("Error", "Unable to fetch address");
    }
  };

  const getRoute = async (start, end) => {
    const apiKey = "5b3ce3597851110001cf624802f10318ff3244c68e1a1588ecd3fe27";
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

  const handleSelectLocation = (location, type) => {
    if (type === "pickup") {
      setPickUpLocation(location.address);
      setLocationPickup(location);
      setBackendError((prevErrors) => ({
        ...prevErrors,
        pickUpLocation: null,
      }));
    } else if (type === "dropoff") {
      setDropOffLocation(location.address);
      setLocationDropoff(location);
      setBackendError((prevErrors) => ({
        ...prevErrors,
        dropOffLocation: null,
      }));
      setSelectedLocation(location);
      getRoute(
        {
          latitude: region.latitude,
          longitude: region.longitude,
        },
        {
          latitude: location.coordinates[1],
          longitude: location.coordinates[0],
        }
      );
    }
  };

  const scheduleDriver = async () => {
    if (!pickUpLocation || !dropOffLocation) {
      setBackendError({
        pickUpLocation: !pickUpLocation ? "Pickup Location is required." : null,
        dropOffLocation: !dropOffLocation
          ? "Dropoff location is required."
          : null,
      });
      return;
    }
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {selectedLocation && (
          <>
            <Marker coordinate={region} title="Current Location" />
            <Marker
              coordinate={{
                latitude: selectedLocation.coordinates[1],
                longitude: selectedLocation.coordinates[0],
              }}
              title="Drop Off Location"
            />
            <Polyline
              coordinates={routeCoords}
              strokeWidth={10}
              strokeColor="green"
            />
          </>
        )}
      </MapView>
      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          value={pickUpLocation}
          placeholder="Pick Up"
          editable={false}
          onTouchStart={() => {
            setHandleSelectLocation((location) =>
              handleSelectLocation(location, "pickup")
            );
            router.push("/LocationSearch?type=pickup");
          }}
        />
        {backendError.pickUpLocation && (
          <Text style={styles.errorText}>{backendError.pickUpLocation}</Text>
        )}
        <TextInput
          style={styles.input}
          value={dropOffLocation}
          placeholder="Drop Off"
          editable={false}
          onTouchStart={() => {
            setHandleSelectLocation((location) =>
              handleSelectLocation(location, "dropoff")
            );
            router.push("/LocationSearch?type=dropoff");
          }}
        />
        {backendError.dropOffLocation && (
          <Text style={styles.errorText}>{backendError.dropOffLocation}</Text>
        )}
        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={scheduleDriver}
        >
          <Text style={styles.scheduleText}>Schedule Now</Text>
        </TouchableOpacity>
      </View>
      {modalVisible && (
        <ScheduleDriver
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          pickUpLocation={pickUpLocation}
          dropOffLocation={dropOffLocation}
          locationDropOff={locationDropOff}
          locationPickUp={locationPickup}
        />
      )}
    </View>
  );
};

export default Map;
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
  controls: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
  },
  scheduleButton: {
    backgroundColor: "green",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  scheduleText: {
    color: "#fff",
    fontSize: 18,
  },
  errorText: {
    marginBottom: 10,
    width: width * 0.5,
    color: "red",
  },
});
