import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useState, useLayoutEffect, useEffect } from "react";
import HamburgerMenu from "../components/HamburgerMenu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import io from "socket.io-client";
import Notification from "./Notification";
import config from "../config/env";
import { jwtDecode } from "jwt-decode";
const socket = io(config.host); // Replace with your server's IP address

const DashboardLayout = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [user, setUser] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [role, setRole] = useState("");

  const driverNotification = async () => {
    console.log("Role", role);
    const user = await AsyncStorage.getItem("token");
    const userId = jwtDecode(user).user_id;
    console.log("userId", userId);
    // Register driver with server
    socket.emit("registerDriver", userId);

    // Listen for notifications from the server
    socket.on("receiveNotification", () => {
      setNotificationMessage("You received a booking");
    });
    // Listen for cancel notifications from the server
    socket.on("receiveCancelNotification", () => {
      setNotificationMessage("One recent booking is cancelled");
    });

    // Clean up the effect
    return () => {
      socket.off("receiveNotification");
      socket.off("receiveCancelNotification");
    };
  };

  const passengerNotification = async () => {
    console.log("Passenger notification called");
    const user = await AsyncStorage.getItem("token");
    const userId = jwtDecode(user).user_id;
    console.log("userId", userId);
    // Register driver with server
    socket.emit("registerPassenger", userId);

    // Listen for notifications from the server
    socket.on("BookingRejected", () => {
      setNotificationMessage("You Ride is not confirmed 😕, Please reschedule");
    });

    socket.on("BookingAccepted", () => {
      setNotificationMessage(
        "You Ride is confirmed, Driver will reach you soon 😃 "
      );
    });
    // Clean up the effect
    return () => {
      socket.off("BookingRejected");
      socket.off("BookingAccepted");
    };
  };

  const handleCloseNotification = () => {
    setNotificationMessage(null); // Close the notification
  };
  const toggleDrawer = () => {
    setDrawerVisible(!isDrawerVisible);
  };

  const fetchUserData = async () => {
    const userdata = await AsyncStorage.getItem("userData");
    let userData = JSON.parse(userdata);
    setRole(userData.userRole);
    setUser(userData);
  };

  useLayoutEffect(() => {
    fetchUserData();
  }, [user]);

  useLayoutEffect(() => {
    console.log("Role", role);
    if (role == "Passenger") {
      passengerNotification();
    } else {
      driverNotification();
    }
  }, [role]);

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
      {notificationMessage && (
        <Notification
          message={notificationMessage}
          onClose={handleCloseNotification}
        />
      )}
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
        <Stack.Screen
          name="ViewDriverProfile"
          options={{ headerShown: false }}
        />
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
