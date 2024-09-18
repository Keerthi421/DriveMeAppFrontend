import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import config from "../config/env";
import { useRouter } from "expo-router";
import { Image } from "react-native-elements";

const requests = () => {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await AsyncStorage.getItem("token");
        const userId = jwtDecode(user).user_id;
        const response = await axios.get(
          `${config.host}/v1/drivers/ride/requests`,
          {
            params: { driverId: userId },
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("Requests info", response.data?.data);
        if (response.data?.data) {
          const sortedRequests = response.data.data.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setRequests(sortedRequests);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const isToday = (dateString) => {
    const inputDate = new Date(dateString);
    const today = new Date();
    const inputDateMidnight = new Date(inputDate.setHours(0, 0, 0, 0));
    const todayMidnight = new Date(today.setHours(0, 0, 0, 0));

    // Compare if input date is today or in the future
    return inputDateMidnight >= todayMidnight;
  };

  const acceptOrRejectRide = async (ride, status) => {
    console.log(ride, status);
    try {
      await axios.put(
        `${config.host}/v1/drivers/booking`,
        {
          bookingId: ride,
          status: status,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const user = await AsyncStorage.getItem("token");
      const userId = jwtDecode(user).user_id;
      const response = await axios.get(
        `${config.host}/v1/drivers/ride/requests`,
        {
          params: { driverId: userId },
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Requests info", response.data?.data);
      if (response.data?.data) {
        const sortedRequests = response.data.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setRequests(sortedRequests);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const navigateToMap = async (request) => {
    console.log(request);
    router.push({
      pathname: "/rideComplete",
      params: {
        pickUpLocation: request.pickUpLocation,
        dropOffLocation: request.dropOffLocation,
        model: request?.vehicleDetails?.model,
        shift: request?.vehicleDetails?.shift,
        driverName: request?.driverDetails?.name,
        passengerName: request?.passengerDetails?.name,
        locationPickup: JSON.stringify(request.locationPickup),
        locationDropoff: JSON.stringify(request.locationDropoff),
      },
    });
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headertext}> Requests</Text>
      </View>
      <Text style={styles.sectionHeader}>Today</Text>
      {requests ? (
        requests.filter((request) => isToday(request.date)).length === 0 ? (
          <Text style={styles.noBookingsText}>No requests for today</Text>
        ) : (
          requests
            .filter((request) => isToday(request.date))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((request) => {
              return (
                <View style={styles.card}>
                  <View style={styles.profile}>
                    <Image
                      style={styles.avatar}
                      x
                      // source={{
                      //   uri:
                      //     request.passengerDetails?.profileImage ||
                      //     "https://randomuser.me/api/portraits/men/1.jpg",
                      // }}
                      source={require("../../assets/images/7309681.jpg")}
                    />
                    <View>
                      <Text style={styles.name}>
                        Passenger - {request.passengerDetails?.name}
                      </Text>
                      <Text style={styles.name}>
                        Email - {request.passengerDetails?.email}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.cardHeader}>
                    <View style={styles.pickupDropOff}>
                      <View style={styles.pickup}>
                        <MaterialIcons
                          name="radio-button-checked"
                          size={20}
                          color="gray"
                        />
                        <View style={styles.pickupText}>
                          <Text style={styles.label}>Pickup</Text>
                          <Text style={styles.value}>
                            {request.pickUpLocation}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.dottedLineContainer}>
                        <View style={styles.dottedLine}></View>
                      </View>
                      <View style={styles.dropoff}>
                        <MaterialIcons name="place" size={20} color="gray" />
                        <View style={styles.dropoffText}>
                          <Text style={styles.label}>Drop Off</Text>
                          <Text style={styles.value}>
                            {request.dropOffLocation}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.infoTags}>
                    <Text style={styles.infoTag}>
                      {request.vehicleDetails?.model}
                    </Text>
                    <Text style={styles.infoTag}>
                      {request.vehicleDetails?.shift}
                    </Text>
                    {/* <Text style={styles.infoTag}>600m Away</Text> */}
                  </View>
                  {request.bookingStatus == 0 ? (
                    <View style={styles.buttonActions}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => acceptOrRejectRide(request.id, 1)}
                      >
                        <Text style={styles.buttonText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.buttonRed}
                        onPress={() => acceptOrRejectRide(request.id, 2)}
                      >
                        <Text style={styles.buttonText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.buttonActions}>
                      {request.bookingStatus == 1 ? (
                        <>
                          {request.paymentDone ? (
                            <Text>Ride Completed</Text>
                          ) : (
                            <TouchableOpacity
                              style={styles.button}
                              onPress={() => navigateToMap(request)}
                            >
                              <Text style={styles.buttonText}>Navigate</Text>
                            </TouchableOpacity>
                          )}
                        </>
                      ) : (
                        <TouchableOpacity style={styles.buttonRed}>
                          <Text style={styles.buttonText}>Ride Rejected</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              );
            })
        )
      ) : (
        <Text style={styles.noBookingsText}>No Requests found</Text>
      )}

      <Text style={styles.sectionHeader}>Past Bookings</Text>
      {requests.length ? (
        requests.filter((request) => !isToday(request.date)).length === 0 ? (
          <Text style={styles.noBookingsText}>No past bookings found</Text>
        ) : (
          requests
            .filter((request) => !isToday(request.date))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((request) => {
              return (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.pickupDropOff}>
                      <View style={styles.pickup}>
                        <MaterialIcons
                          name="radio-button-checked"
                          size={20}
                          color="gray"
                        />
                        <View style={styles.pickupText}>
                          <Text style={styles.label}>Pickup</Text>
                          <Text style={styles.value}>
                            {request.pickUpLocation}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.dottedLineContainer}>
                        <View style={styles.dottedLine}></View>
                      </View>
                      <View style={styles.dropoff}>
                        <MaterialIcons name="place" size={20} color="gray" />
                        <View style={styles.dropoffText}>
                          <Text style={styles.label}>Drop Off</Text>
                          <Text style={styles.value}>
                            {request.dropOffLocation}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>$50</Text>
                    </View>
                  </View>
                  <View style={styles.infoTags}>
                    <Text style={styles.infoTag}>
                      {request.vehicleDetails?.model}
                    </Text>
                    <Text style={styles.infoTag}>
                      {request.vehicleDetails?.shift}
                    </Text>
                    {/* <Text style={styles.infoTag}>600m Away</Text> */}
                  </View>
                  {!isToday(request.date) && (
                    <Text style={styles.expired}>Expired</Text>
                  )}
                </View>
              );
            })
        )
      ) : (
        <Text style={styles.noBookingsText}>No Requests found</Text>
      )}
    </ScrollView>
  );
};

export default requests;

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "left",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    marginTop: 20,
  },

  header: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headertext: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "300",
    marginBottom: 10,
    marginTop: 10,
  },

  buttonView: {
    alignSelf: "center",
  },

  status: {
    fontSize: 14,
    color: "green",
    fontWeight: "400",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  noBookingsText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
  profile: {
    display: "flex",
    flexDirection: "row",
    margin: 20,
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  pickupDropOff: {
    flex: 1,
  },
  pickup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  pickupText: {
    marginLeft: 10,
  },
  dottedLineContainer: {
    alignItems: "flex-start",
    marginLeft: 10,
  },
  dottedLine: {
    width: 1,
    height: 30,
    borderStyle: "dotted",
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
  },
  dropoff: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropoffText: {
    marginLeft: 10,
  },
  label: {
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    color: "#333",
  },
  priceContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 60,
    alignSelf: "flex-start",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  infoTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  infoTag: {
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  statusTag: {
    backgroundColor: "#d3d3d3",
  },
  button: {
    backgroundColor: "#4caf50",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginRight: 10,
  },

  buttonRed: {
    backgroundColor: "#fa0404",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginRight: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  expired: {
    color: "#f44336",
    fontWeight: "bold",
    textAlign: "center",
  },
  headerText: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 25,
    padding: 10,
  },
  buttonActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
