import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const DriverCard = ({ driver, setModalVisible }) => {
  const router = useRouter();
  const statusStyle =
    driver.status === "Pending" ? styles.statusPending : styles.statusAvailable;

  const displayName =
    driver.name.length > 20
      ? driver.name.substring(0, 17) + "..."
      : driver.name;

  const handleDriverProfile = (details) => {
    console.log(details);
    setModalVisible(false);
    router.push({
      pathname: "/(dashboard)/ViewDriverProfile",
      params: {
        driverDetails: JSON.stringify(details),
        chargePerHour: details?.rate,
      },
    });
  };

  return (
    <View style={styles.card}>
      {/* Top content (Driver Image and Info) */}
      <View style={styles.topContent}>
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

      {/* Bottom content (line and Cancel Booking button) */}
      <View style={styles.bottomContent}>
        <View style={styles.line}></View>
        <TouchableOpacity
          style={styles.buttonView}
          onPress={() => handleDriverProfile(driver)}
        >
          <Text style={styles.ButtonText}>Show Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    padding: 15,
    marginBottom: 10,
    borderColor: "#ddd",
    shadowOffset: { width: 0, height: 2 },
  },
  topContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bottomContent: {
    alignItems: "center",
    marginTop: 10,
  },
  line: {
    width: "100%",
    borderBottomWidth: 0.5,
    borderColor: "#d8d6d6",
    marginVertical: 10,
  },
  buttonView: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  ButtonText: {
    color: "#3b3b3b",
    fontWeight: "bold",
    textAlign: "center",
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
