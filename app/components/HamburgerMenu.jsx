import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HamburgerMenu = ({ isVisible, toggleDrawer, setDrawerVisible }) => {
  const router = useRouter();
  const [role, setRole] = useState("");

  // Fetching the Role from Database

  const fetchUserData = async () => {
    const userdata = await AsyncStorage.getItem("userData");
    let userRole = JSON.parse(userdata).userRole;
    setRole(userRole);
  };

  useEffect(() => {
    fetchUserData();
  }, [role]);

  if (!isVisible) return null;

  const navigateAndCloseDrawer = (path) => {
    router.push(path);
    toggleDrawer(); // Close the drawer after navigation
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userData");
      setDrawerVisible(false);
      navigateAndCloseDrawer("/(auth)/sign-in");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Passenger Menu

  const renderPassengerMenu = () => (
    <>
      <TouchableOpacity
        onPress={() => navigateAndCloseDrawer("/(dashboard)/Bookings")}
        style={styles.linkContainer}
      >
        <Image
          source={require("../../assets/images/wheel.png")}
          style={styles.icon}
        />
        <Text style={styles.link}>Bookings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigateAndCloseDrawer("/(dashboard)/Payments")}
        style={styles.linkContainer}
      >
        <Image
          source={require("../../assets/images/payments.png")}
          style={styles.icon}
        />
        <Text style={styles.link}>Payments</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigateAndCloseDrawer("/(dashboard)/Profile")}
        style={styles.linkContainer}
      >
        <Image
          source={require("../../assets/images/profile.png")}
          style={{ width: 35, height: 38, marginRight: 20 }}
        />
        <Text style={styles.link}>Profile</Text>
      </TouchableOpacity>
    </>
  );

  const renderDriverMenu = () => (
    <>
      <TouchableOpacity
        onPress={() => navigateAndCloseDrawer("/(dashboard)/requests")}
        style={styles.linkContainer}
      >
        <Image
          source={require("../../assets/images/wheel.png")}
          style={styles.icon}
        />
        <Text style={styles.link}>Requests</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigateAndCloseDrawer("/(dashboard)/DriverPayments")}
        style={styles.linkContainer}
      >
        <Image
          source={require("../../assets/images/payments.png")}
          style={styles.icon}
        />
        <Text style={styles.link}>Payments</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigateAndCloseDrawer("/driverProfile")}
        style={styles.linkContainer}
      >
        <Image
          source={require("../../assets/images/profile.png")}
          style={{ width: 35, height: 38, marginRight: 20 }}
        />
        <Text style={styles.link}>Profile</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.drawerContainer}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Text style={styles.closeButton}></Text>
      </TouchableOpacity>

      {role === "Driver" ? renderDriverMenu() : renderPassengerMenu()}

      {/* <TouchableOpacity
        onPress={() => navigateAndCloseDrawer("/(dashboard)/Bookings")}
        style={styles.linkContainer}
      >
        <Image
          source={require("../../assets/images/wheel.png")}
          style={styles.icon}
        />
        <Text style={styles.link}>Bookings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigateAndCloseDrawer("/(dashboard)/Payments")}
        style={styles.linkContainer}
      >
        <Image
          source={require("../../assets/images/payments.png")}
          style={styles.icon}
        />
        <Text style={styles.link}>Payments</Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity
        onPress={() => navigateAndCloseDrawer("/(dashboard)/Profile")}
        style={styles.linkContainer}
      >
        <Image
          source={require("../../assets/images/profile.png")}
          style={{ width: 35, height: 38, marginRight: 20 }}
        />
        <Text style={styles.link}>Profile</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        onPress={() => navigateAndCloseDrawer("/(dashboard)/Settings")}
        style={styles.linkContainer}
      >
        <Image
          source={require("../../assets/images/settings.png")}
          style={styles.icon}
        />
        <Text style={styles.link}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigateAndCloseDrawer("/")}
        style={styles.linkContainerBottom}
      >
        <Text style={styles.link2}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.link2}>Logout</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        onPress={() => navigateAndCloseDrawer("/(dashboard)/requests")}
      >
        <Text style={styles.link2}>RequestScreen</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigateAndCloseDrawer("/(dashboard)/rideComplete")}
      >
        <Text style={styles.link2}>Ridecomplete</Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity
        onPress={() => navigateAndCloseDrawer("/(dashboard)/RideReview")}
      >
        <Text style={styles.link2}>Review</Text>
      </TouchableOpacity> */}

      <TouchableOpacity>
        <Text style={styles.link3}>Version - Dev Mode</Text>
      </TouchableOpacity>
      {/* <Link href="/(dashboard)/Bookings" style={styles.link}>Bookings</Link>
      <Link href="(dashboard)/Payments" style={styles.link}>Payments</Link>
      <Link href="(dashboard)/Profile" style={styles.link}>Profile </Link>
      <Link href="(dashboard)/Settings" style={styles.link}>Settings</Link> */}
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "75%",
    height: "100%",
    backgroundColor: "#fff",

    padding: 20,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  closeButton: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 100,
  },
  link: {
    fontSize: 30,
    fontWeight: "500",
    color: "#6B6B6B",
  },

  link2: {
    fontSize: 20,
    fontWeight: "300",
    color: "#6B6B6B",
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  linkContainerBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 350,
  },

  icon: {
    width: 35,
    height: 35,
    marginRight: 20,
  },
  link3: {
    fontSize: 15,
    fontWeight: "300",
    color: "#6B6B6B",
    bottom: 1,
    padding: 20,
    alignSelf: "center",
  },
});

export default HamburgerMenu;
