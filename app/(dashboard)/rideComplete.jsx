import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";

import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import config from "../config/env";

const RideComplete = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [routeCoords, setRouteCoords] = useState([]);
  const [pickUpLocation, setPickUpLocation] = useState(params.pickUpLocation);
  const [dropOffLocation, setDropOffLocation] = useState(
    params.dropOffLocation
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [model] = useState(params.model);
  const [shift] = useState(params.shift);
  const [chargePerHour] = useState(params.chargePerHour);
  const [bookingId] = useState(params.bookingId);
  const [isPaymentDone, setIsPaymentDone] = useState();

  const [user, setUser] = useState("");

  const [locationPickup, setLocationPickup] = useState(() => {
    try {
      return params?.locationPickup ? JSON.parse(params.locationPickup) : null;
    } catch (e) {
      console.error("Failed to parse locationPickUp:", e);
      return null;
    }
  });

  const [locationDropOff, setLocationDropoff] = useState(() => {
    try {
      return params?.locationDropoff
        ? JSON.parse(params?.locationDropoff)
        : null;
    } catch (e) {
      console.error("Failed to parse locationDropOff:", e);
      return null;
    }
  });

  const start = {
    latitude: locationPickup.coordinates[0],
    longitude: locationPickup.coordinates[1],
  }; // Georgian College, Barrie
  const end = {
    latitude: locationDropOff.coordinates[1],
    longitude: locationDropOff.coordinates[0],
  }; // Bayfield Drive, Barrie

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

  useEffect(() => {
    const getUser = async () => {
      const userDetails = await AsyncStorage.getItem("userData");
      // console.log("user detail", JSON.parse(userDetails).userRole);
      const role = JSON.parse(userDetails).userRole;
      setUser(role);
    };
    getUser();
    getRoute(start, end);
  }, []);

  useEffect(() => {
    const fetchRide = async () => {
      const response = await axios.get(`${config.host}/v1/users/schedule`, {
        params: { id: bookingId },
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.data) {
        setIsPaymentDone(response.data?.data?.paymentDone);
      }
    };

    fetchRide();
  }, []);

  const handleCompleteRidePress = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handlePay = async () => {
    console.log("Entered");
    const user = await AsyncStorage.getItem("token");

    const userId = jwtDecode(user).user_id;
    console.log(userId);

    const response = await axios.get(`${config.host}/v1/users/wallet`, {
      params: { id: userId },
      headers: { "Content-Type": "application/json" },
    });

    let walletBalance = 0;
    if (response.data.data) {
      walletBalance = response.data.data?.walletBalance;
    }
    if (walletBalance < parseInt(chargePerHour)) {
      return Alert.alert("Balance Low", "Please recharge wallet to continue");
    }
    console.log("update wallet");

    await axios.put(
      `${config.host}/v1/users/wallet`,
      {
        id: userId,
        purchaseAmount: parseInt(chargePerHour),
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Update payment");

    await axios.put(
      `${config.host}/v1/users/payment`,
      {
        bookingId: bookingId,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    Alert.alert("Payment Done");
    setIsModalVisible(false);
    setIsPaymentDone(true);
    router.push("/(dashboard)/RideReview");
  };

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
        <Polyline
          coordinates={routeCoords}
          strokeColor="#1E90FF"
          strokeWidth={5}
        />
      </MapView>
      <View style={styles.infoBox}>
        <View style={styles.locationRow}>
          <Icon name="radio-button-checked" size={20} color="#808080" />
          <View style={styles.locationText}>
            <Text style={styles.label}>Pickup</Text>
            <Text style={styles.location}>{params.pickUpLocation}</Text>
          </View>
        </View>
        <View style={styles.locationRow}>
          <Icon name="place" size={20} color="#808080" />
          <View style={styles.locationText}>
            <Text style={styles.label}>Drop Off</Text>
            <Text style={styles.location}>{params.dropOffLocation}</Text>
          </View>
        </View>
        <View style={styles.tagContainer}>
          <Text style={styles.tag}>{model}</Text>
          <Text style={styles.tag}>{shift}</Text>
          {/* <Text style={styles.tag}>600m Away</Text> */}
        </View>
        {user == "Passenger" && (
          <>
            {isPaymentDone ? (
              <Text style={styles.status}>Ride Completed</Text>
            ) : (
              <TouchableOpacity onPress={handleCompleteRidePress}>
                <Text style={styles.status}> Make Payment</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Paying To: {params.driverName}</Text>
            <Text style={styles.modalText}>
              Paying By: {params.passengerName}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={chargePerHour}
              editable={false}
            />
            <TouchableOpacity style={styles.payButton} onPress={handlePay}>
              <Text style={styles.payButtonText}>Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCloseModal}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RideComplete;

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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#000",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  payButton: {
    backgroundColor: "#00B140",
    borderRadius: 5,
    width: "80%",
    padding: 10,
    marginTop: 10,
  },
  payButtonText: {
    color: "#FFF",
    fontSize: 16,
    alignSelf: "center",
    fontWeight: "bold",
  },
  closeButton: {
    color: "#007BFF",
    fontSize: 16,
    marginTop: 15,
  },
});
