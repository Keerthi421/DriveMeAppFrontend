import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import DriverCard from "./component/driverCard";
import axios from "axios";
import config from "../config/env";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";

const socket = io(config.host); // Replace with your server's IP address

const BookingSuccess = () => {
  const params = useLocalSearchParams();
  const selectedDriver = JSON.parse(params.selectedDriver); // Parse the stringified object

  const [driver, setDriver] = useState(selectedDriver);
  const [pickUpLocation, setPickUpLocation] = useState(params.pickUpLocation);
  const [dropOffLocation, setDropOffLocation] = useState(
    params.dropOffLocation
  );
  const [rideData, setRideData] = useState(null);
  const [rideId, setRideId] = useState(params.rideId);
  let statusStyle;
  console.log("rideId", rideId);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.host}/v1/users/schedule`, {
          params: {
            id: rideId,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.data?.data) {
          setRideData(response.data.data);
          socket.emit("bookingSuccess", response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  statusStyle =
    rideData?.bookingStatus === 0
      ? styles.statusPending
      : rideData?.bookingStatus === 1
      ? styles.statusAvailable
      : styles.statusRejected;

  return (
    <SafeAreaView>
      <View style={styles.asset}>
        <Image
          source={require("../../assets/bookingSuccess.png")}
          style={styles.image}
        ></Image>
      </View>
      <View style={styles.wrapper}>
        <Text style={styles.smalltexttitle}>
          You’ve successfully requested the booking, we will notify you when
          driver accepts it.
        </Text>
      </View>
      <View style={styles.locationContainer}>
        <View>
          <View style={styles.card}>
            <View style={styles.location}>
              <Text style={styles.pickup}>
                {" "}
                <Image source={require("../../assets/locationPin.jpg")}></Image>
                {"  "}
                Pickup
              </Text>
            </View>
            <View style={styles.locationText}>
              <Text>{rideData?.pickUpLocation}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.locationContainer}>
        <View>
          <View style={styles.card}>
            <View style={styles.location}>
              <Text style={styles.pickup}>
                {" "}
                <Image source={require("../../assets/locationPin.jpg")}></Image>
                {"  "}
                Dropoff
              </Text>
            </View>
            <View style={styles.locationText}>
              <Text>{rideData?.dropOffLocation}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.driversContainer}>
        <FlatList
          data={[driver]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DriverCard driver={item} isShow={true} />}
        />
      </View>

      <View style={styles.statusContainer}>
        <View>
          <View style={styles.card}>
            <View style={styles.infoContainer}>
              <Text style={styles.rate}>Status</Text>
            </View>
            <View style={styles.imageContainer}>
              <Text style={[styles.status, statusStyle]}>
                {rideData?.bookingStatus === 0
                  ? "Waiting for Confirmation"
                  : rideData?.bookingStatus === 1
                  ? "Accepted"
                  : "Booking not Accepted"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Link href={"/home"} style={styles.signupText}>
        Go Back
      </Link>
    </SafeAreaView>
  );
};

export default BookingSuccess;
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  infoContainer: {
    flex: 1,
  },
  asset: {
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    padding: 5,
    width: width * 0.4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 10,
  },

  title: {
    fontSize: 45,
    fontWeight: "bold",
    marginBottom: 340,
    paddingLeft: 20,
  },
  smalltext: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  driversContainer: {
    padding: 20,
    paddingBottom: 10,
    paddingTop: 0,
  },
  statusContainer: {
    marginBottom: 10,
    padding: 20,
    paddingTop: 0,
  },
  locationContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 0,
  },
  wrapper: {
    backgroundColor: "#e4e4e4",
    borderRadius: 20,
    marginBottom: 18,
    padding: 20,
    marginHorizontal: 20,
  },
  highlight: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  image: {
    marginTop: 10,
    // marginLeft: width * 0.2,
    marginBottom: 20,
    justifyContent: "center",
    width: 200,
    height: 200,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    marginHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
  },
  loginText: {
    marginTop: 300,
    color: "#888",
    fontSize: 14,
    textAlign: "center",
  },
  signupText: {
    marginTop: 10,
    color: "#888",
    fontSize: 14,
    textAlign: "center",
  },
  signupLink: {
    color: "#4CAF50",
    fontWeight: "bold",
    textAlign: "center",
  },
  status: {
    padding: 5,
    textAlign: "center",
    width: width * 0.45,
    marginRight: 10,
  },
  statusPending: {
    borderColor: "#FFD710",
    color: "#000000",
    backgroundColor: "#FFD710",
  },
  statusAvailable: {
    borderColor: "#1BA953",
    color: "white",
    backgroundColor: "#1BA953",
  },
  statusRejected: {
    borderColor: "#FF0000",
    color: "white",
    backgroundColor: "#FF0000",
  },
  location: {
    flex: 1,
    textAlign: "center",
  },
  pickup: {
    color: "#979797",
  },
  locationText: {
    width: width * 0.6,
  },
});
