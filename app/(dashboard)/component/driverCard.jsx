import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const DriverCard = ({ driver }) => {
  const statusStyle =
    driver.status === "Pending" ? styles.statusPending : styles.statusAvailable;
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.rate}>${driver.rate} CAD/hr</Text>
        {/* <Text style={styles.distance}>
          <Image
            source={require("../../../assets/distance.png")}
            style={styles.distanceIcon}
          />
          {driver.distance}
        </Text> */}
        <Text style={[styles.status, statusStyle]}>{driver.status}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          // source={{ uri: driver.avatar }}
          source={require("../../../assets/images/7309681.jpg")}
          style={styles.avatar}
        />
        <Text style={styles.name}>{driver.name}</Text>
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
    marginBottom: 10,
  },
  infoContainer: {
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    padding: 10,
    width: width * 0.4,
  },
  rate: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  distance: {
    fontSize: 14,
    color: "#ACACAC",
    marginBottom: 10,
  },
  distanceIcon: {
    height: 15,
    width: 15,
    marginRight: 10,
  },
  status: {
    padding: 5,
    textAlign: "center",
    width: 80,
  },
  statusPending: {
    borderColor: "#FFD710",
    color: "#030303",
    backgroundColor: "#FFD710",
  },
  statusAvailable: {
    borderColor: "#1BA953",
    color: "white",
    backgroundColor: "#1BA953",
  },
});

export default DriverCard;
