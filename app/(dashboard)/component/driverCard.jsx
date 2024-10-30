import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Make sure to install @expo/vector-icons if using Expo
import { TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");

const DriverCard = ({ driver }) => {
  const statusStyle =
    driver.status === "Pending" ? styles.statusPending : styles.statusAvailable;

  // Truncate driver name if it’s longer than 20 characters, including ellipsis
  const displayName =
    driver.name.length > 20
      ? driver.name.substring(0, 17) + "..."
      : driver.name;

  return (
    <View style={styles.card}>
      <View style={styles.container}>
        {/* Driver Image */}
        <Image
          source={require("../../../assets/images/7309681.jpg")}
          style={styles.avatar}
        />

        {/* Driver Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{displayName}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{driver?.averageRating}</Text>
            <FontAwesome name="star" size={14} color="#FFD700" />
          </View>
        </View>

        {/* Rate and Status on the Right */}
        <View style={styles.rightContainer}>
          <Text style={styles.rate}>${driver.rate} CAD/hr</Text>
          <Text style={[styles.status, statusStyle]}>{driver.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <TouchableOpacity>
        <Text style={styles.showprofile}>Show Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  showprofile: {
    color: "#797979",
  },
  card: {
    flexDirection: "column",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1, // Adds border width
    borderColor: "#D3D3D3", // Sets border color (light gray)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, // Increased for a more visible shadow
    shadowRadius: 5, // Increased for a softer shadow spread
    elevation: 6, // For Android shadow
    marginBottom: 10,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 30,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
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
  rightContainer: {
    alignItems: "flex-end",
  },
  rate: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  status: {
    padding: 5,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  statusPending: {
    backgroundColor: "#d58309",
    color: "#fbfbfb",
    borderRadius: 10,
    padding: 5,
  },
  statusAvailable: {
    backgroundColor: "#1BA953",
    color: "white",
    borderRadius: 10,
    padding: 5,
  },
});

export default DriverCard;
