import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Make sure to install @expo/vector-icons if using Expo

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
  );
};

const styles = StyleSheet.create({
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
  avatar: {
    width: 60,
    height: 60,
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
    width: 80,
    borderRadius: 5,
  },
  statusPending: {
    backgroundColor: "#FFD710",
    color: "#030303",
  },
  statusAvailable: {
    backgroundColor: "#1BA953",
    color: "white",
  },
});

export default DriverCard;
