import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapComponent from "./Map";

const Home = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log("Params", params);
  const rideDetails = params; // Parse the stringified object
  // Temporarily retrieving data
  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      if (value !== null) {
        // We have data!!
        // console.log(value);
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error("Error retrieving data", error);
    }
  };
  retrieveData();

  //logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userData");
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <MapComponent style={styles.mapView} rideDetails={rideDetails} />
      {/* <Text onPress={handleLogout}>logout</Text> */}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    width: "100%",
    flex: 0.7,
  },
});
