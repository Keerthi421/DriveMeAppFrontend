import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import config from "../config/env";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Payments = () => {
  const [bookings, setBookings] = useState();
  const [preference, setPreference] = useState();
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
        if (response.data?.data) {
          setBookings(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchPreference = async () => {
      try {
        const user = await AsyncStorage.getItem("token");
        const userId = jwtDecode(user).user_id;
        const response = await axios.get(
          `${config.host}/v1/drivers/preference`,
          {
            params: { driverId: userId },
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.data?.data) {
          setPreference(response.data.data?.preference);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchPreference();
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
        <Text style={styles.headertext}> Payments</Text>
      </View>
      <Text style={styles.sectionHeader}>Today</Text>
      {bookings ? (
        bookings.filter((booking) => isToday(booking.date)).length === 0 ? (
          <Text style={styles.noBookingsText}>No Payments for today</Text>
        ) : (
          bookings
            .filter((booking) => isToday(booking.date))
            .map((booking) => {
              if (booking.paymentDone)
                return (
                  <PaymentCard
                    key={booking.id}
                    item={booking}
                    preference={preference}
                  />
                );
            })
        )
      ) : (
        <Text style={styles.noBookingsText}>No Payments found</Text>
      )}

      <Text style={styles.sectionHeader}> Past Payments</Text>
      {bookings ? (
        bookings.filter((booking) => !isToday(booking.date)).length === 0 ? (
          <Text style={styles.noBookingsText}>No past payments found</Text>
        ) : (
          bookings
            .filter((booking) => !isToday(booking.date))
            .map((booking) => {
              if (booking.paymentDone)
                return (
                  <PaymentCard
                    key={booking.id}
                    item={booking}
                    preference={preference}
                  />
                );
            })
        )
      ) : (
        <Text style={styles.noBookingsText}>No Payments found</Text>
      )}
    </ScrollView>
  );
};

const PaymentCard = ({ item, preference }) => (
  <View style={styles.card}>
    <View style={styles.statusRow}>
      <Text style={styles.text}> Amount Paid </Text>
      <Text style={styles.text}> From Passenger</Text>
    </View>
    <View style={styles.statusRow}>
      <Text style={styles.btext}> {preference.chargePerHour || 0} CAD</Text>
      <Text style={styles.btext}> {item?.passengerDetails?.name}</Text>
    </View>
  </View>
);
export default Payments;

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
  statusPending: {
    color: "#a88e0a",
  },
  statusAvailable: {
    color: "#1BA953",
  },
  statusRejected: {
    color: "#FF0000",
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
});
