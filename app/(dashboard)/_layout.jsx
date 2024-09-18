import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useState, useLayoutEffect } from "react";
import HamburgerMenu from "../components/HamburgerMenu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";

const DashboardLayout = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [user, setUser] = useState("");

  const toggleDrawer = () => {
    setDrawerVisible(!isDrawerVisible);
  };

  const fetchUserData = async () => {
    const userdata = await AsyncStorage.getItem("userData");
    let userData = JSON.parse(userdata);

    setUser(userData);
  };

  useLayoutEffect(() => {
    fetchUserData();
  }, [user]);

  return (
    <View style={styles.container}>
      {user && (
        <TouchableOpacity onPress={toggleDrawer} style={styles.hamburger}>
          <View style={styles.button}>
            <Text style={styles.hamburgerText}>
              {isDrawerVisible ? "X" : "☰"}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      <HamburgerMenu
        setDrawerVisible={setDrawerVisible}
        isVisible={isDrawerVisible}
        toggleDrawer={toggleDrawer}
      />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="Bookings" options={{ headerShown: false }} />
        <Stack.Screen name="Payments" options={{ headerShown: false }} />
        <Stack.Screen name="Profile" options={{ headerShown: false }} />
        <Stack.Screen name="Settings" options={{ headerShown: false }} />
        <Stack.Screen name="Map" options={{ headerShown: false }} />
        <Stack.Screen name="LocationSearch" options={{ headerShown: false }} />
        <Stack.Screen name="chooseDriver" options={{ headerShown: false }} />
        <Stack.Screen
          name="verificationInProgress"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="requests" options={{ headerShown: false }} />
        <Stack.Screen name="rideComplete" options={{ headerShown: false }} />
        <Stack.Screen name="RideReview" options={{ headerShown: false }} />
        <Stack.Screen name="driverProfile" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
};

export default DashboardLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hamburger: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1001,
  },
  hamburgerText: {
    fontSize: 30,
    fontWeight: "bold",
    backgroundColor: "#fff",
    color: "#6B6B6B",
    borderRadius: 30,
  },

  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});
