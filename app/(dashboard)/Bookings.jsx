import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import config from "../config/env";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import io from "socket.io-client";

const socket = io(config.host);
const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchData = async () => {
    try {
      const user = await AsyncStorage.getItem("token");
      const userId = jwtDecode(user).user_id;
      const response = await axios.get(`${config.host}/v1/users/bookings`, {
        params: { id: userId },
        headers: { "Content-Type": "application/json" },
      });
      if (response.data?.data) {
        const sortedBookings = response.data.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setBookings(sortedBookings);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headertext}> Bookings</Text>
      </View>
      <Text style={styles.sectionHeader}>Today</Text>
      {bookings ? (
        bookings.filter((booking) => isToday(booking.date)).length === 0 ? (
          <Text style={styles.noBookingsText}>No bookings for today</Text>
        ) : (
          bookings
            .filter((booking) => isToday(booking.date))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((booking) => {
              console.log(" Booking Status ", booking.bookingStatus);
              // Determine the statusStyle based on bookingStatus
              statusStyle =
                booking?.bookingStatus === 0
                  ? styles.statusPending
                  : booking?.bookingStatus === 1
                  ? styles.statusAvailable
                  : booking?.bookingStatus === 2
                  ? styles.statusRejected
                  : styles.statusCancelled;

              // Return the BookingCard component with appropriate props
              return (
                <BookingCard
                  key={booking.id}
                  item={booking}
                  statusStyle={statusStyle}
                  fetchData={() => fetchData()}
                />
              );
            })
        )
      ) : (
        <Text style={styles.noBookingsText}>No Bookings found</Text>
      )}

      <Text style={styles.sectionHeader}> Past Bookings</Text>
      {bookings ? (
        bookings.filter((booking) => !isToday(booking.date)).length === 0 ? (
          <Text style={styles.noBookingsText}>No past bookings found</Text>
        ) : (
          bookings
            .filter((booking) => !isToday(booking.date))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((booking) => {
              // Determine the statusStyle based on bookingStatus
              statusStyle =
                booking?.bookingStatus === 0
                  ? styles.statusPending
                  : booking?.bookingStatus === 1
                  ? styles.statusAvailable
                  : styles.statusRejected;

              // Return the BookingCard component with appropriate props
              return (
                <BookingCard
                  key={booking.id}
                  item={booking}
                  statusStyle={statusStyle}
                  fetchData={() => fetchData()}
                />
              );
            })
        )
      ) : (
        <Text style={styles.noBookingsText}>No Bookings found</Text>
      )}
    </ScrollView>
  );
};

const BookingCard = ({ item, statusStyle, past, fetchData }) => {
  const router = useRouter();

  const handleRide = async (request) => {
    console.log("Handle Ride:", request.driverId);
    const response = await axios.get(`${config.host}/v1/drivers/preference`, {
      params: { driverId: request?.driverId },
      headers: { "Content-Type": "application/json" },
    });

    router.push({
      pathname: "/(dashboard)/rideComplete",
      params: {
        bookingId: request.id,
        pickUpLocation: request.pickUpLocation,
        dropOffLocation: request.dropOffLocation,
        model: request?.vehicleDetails?.model,
        shift: request?.vehicleDetails?.shift,
        driverName: request?.driverDetails?.name,
        driverId: request?.driverId,
        locationPickup: JSON.stringify(request.locationPickup),
        locationDropoff: JSON.stringify(request.locationDropoff),
        passengerName: request?.passengerDetails?.name,
        chargePerHour: response?.data?.data?.preference?.chargePerHour || 0,
      },
    });
  };

  const handleRideCancel = async (ride, status) => {
    console.log(ride.id);
    socket.emit("bookingCancelled", ride);
    try {
      await axios.put(
        `${config.host}/v1/drivers/booking`,
        {
          bookingId: ride.id,
          status: status,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      fetchData();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleDriverProfile = (details, item) => {
    console.log(item.preferences);
    router.push({
      pathname: "/(dashboard)/ViewDriverProfile",
      params: {
        driverDetails: JSON.stringify(details),
        charge: JSON.stringify(item.preferences),
      },
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image
          style={styles.avatar}
          // source={{
          //   uri:
          //     item.driverDetails?.profileImage ||
          //     "https://randomuser.me/api/portraits/men/1.jpg",
          // }}
          source={require("../../assets/images/7309681.jpg")}
        />
        <View style={styles.detailsContainer}>
          <View>
            <Text
              style={styles.name}
              onPress={() => handleDriverProfile(item.driverDetails, item)}
            >
              {item.driverDetails?.name}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>
                {item?.driverDetails?.averageRating || 0}
              </Text>
              <FontAwesome name="star" size={14} color="#FFD700" />
            </View>
          </View>
          <View style={styles.chargeVerified}>
            <Text style={styles.rate}>
              ${item.preferences?.chargePerHour ?? 0} CAD/hr
            </Text>
            <Text
              style={
                item.driverDetails?.isDocumentsSubmitted
                  ? styles.statusVerified
                  : styles.statusVerificationPending
              }
            >
              {item.driverDetails?.isDocumentsSubmitted
                ? "Verified"
                : "Pending"}
            </Text>
          </View>
        </View>
      </View>
      {past ? (
        <View>
          <View style={styles.location}>
            <Ionicons name="location-outline" size={16} color="gray" />
            <Text style={styles.locationText}>
              Pickup {item.pickUpLocation}
            </Text>
          </View>
          <View style={styles.location}>
            <Ionicons name="location-outline" size={16} color="gray" />
            <Text style={styles.locationText}>
              DropOff {item.dropOffLocation}
            </Text>
          </View>
          <View style={styles.line}></View>
          <TouchableOpacity style={styles.buttonView}>
            <Text style={styles.rebookButtonText}>Rebook</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status</Text>
            <Text style={[styles.status, statusStyle]}>
              {item?.bookingStatus === 0
                ? "Waiting for Confirmation"
                : item?.bookingStatus === 1
                ? "Accepted"
                : item?.bookingStatus === 2
                ? "Booking not Accepted"
                : "Booking cancelled"}
            </Text>
          </View>
          {item.bookingStatus == 1 ? (
            <>
              <View style={styles.line}></View>
              <TouchableOpacity
                style={styles.buttonView}
                onPress={() => handleRide(item)}
              >
                <Text style={styles.rebookButtonText}>View Details</Text>
              </TouchableOpacity>
            </>
          ) : (
            item.bookingStatus === 0 && (
              <>
                <View style={styles.line}></View>
                <TouchableOpacity
                  style={styles.buttonView}
                  onPress={() => handleRideCancel(item, 3)}
                >
                  <Text style={styles.cancelButtonText}>Cancel Booking?</Text>
                </TouchableOpacity>
              </>
            )
          )}
        </View>
      )}
    </View>
  );
};

export default Bookings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#000",
    shadowColor: "black",
    shadowOpacity: 0.1,
    padding: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  statusPending: {
    color: "#a88e0a",
  },
  statusAvailable: {
    color: "#1BA953",
  },
  statusRejected: {
    color: "#FF0000",
  },
  statusCancelled: {
    color: "gray",
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
    marginTop: 40,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  rate: {
    color: "gray",
    marginBottom: 10,
  },
  carddetail: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
    marginTop: 10,
  },
  line: {
    borderWidth: 0.5,
    borderColor: "#d8d6d6",
    marginTop: 10,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  locationText: {
    marginLeft: 5,
    color: "gray",
  },
  rebookButtonText: {
    color: "green",
    fontWeight: "600",
    marginTop: 20,
  },
  cancelButtonText: {
    color: "red",
    fontWeight: "600",
    marginTop: 20,
  },
  buttonView: {
    alignSelf: "center",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 14,
    color: "gray",
  },
  status: {
    fontSize: 14,
    color: "green",
    fontWeight: "400",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
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
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    marginRight: 4,
    color: "#333",
  },
  statusVerificationPending: {
    backgroundColor: "#FFD710",
    color: "#fff",
    padding: 5,
    textAlign: "center",
  },
  statusVerified: {
    backgroundColor: "#1BA953",
    color: "#fff",
    padding: 5,
    textAlign: "center",
  },
});
