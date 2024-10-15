import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Button,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import config from "../config/env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import for icons

const driverProfile = () => {
  const [profile, setProfile] = useState();
  const [showPerHour, setShowPerHour] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [chargePerHour, setChargePerHour] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await AsyncStorage.getItem("token");
        const userId = jwtDecode(user).user_id;
        const response = await axios.get(`${config.host}/v1/users/profile`, {
          params: { id: userId },
          headers: { "Content-Type": "application/json" },
        });
        if (response.data?.data) {
          setProfile(response.data.data);
          setEditableProfile({
            name: response.data.data.user?.name || "",
            // tag: response.data.data.user?.tag || "",
            // about: response.data.data.user?.about || "",
            // model: response.data.data.vehicle?.model || "",
            email: response.data.data.user?.email || "",
            chargePerHour: response.data.data.user?.chargePerHour || "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    console.log("data is fetching");
  }, []);

  useEffect(() => {
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
          setShowPerHour(response.data.data.preference.chargePerHour);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPreference();
  }, []);

  const handleAdd = async () => {
    setModalVisible(true);
  };

  const handleRecharge = async () => {
    try {
      const user = await AsyncStorage.getItem("token");
      const userId = jwtDecode(user).user_id;
      await axios.post(
        `${config.host}/v1/drivers/preference`,
        {
          driverId: userId,
          chargePerHour: parseInt(chargePerHour),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // Update the wallet balance in the profile
      setProfile((prevProfile) => ({
        ...prevProfile,
        user: {
          ...prevProfile.user,
          walletBalance:
            parseInt(prevProfile.user.walletBalance) + parseInt(chargePerHour),
        },
      }));
      setChargePerHour("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error recharging wallet:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <Image
          style={styles.avatar}
          source={require("../../assets/images/7309681.jpg")}
        />
        <Text style={styles.text}>{editableProfile.name}</Text>
        <Text style={styles.smallText}>{editableProfile.email}</Text>
        <Text style={styles.smallText}>
          Charge Per Hour is {showPerHour} CAD
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.smallText}> Edit your Charge Per Hour </Text>
        <View style={styles.walletContainer}>
          <Text style={styles.walletBalance}>{showPerHour} CAD</Text>
          <TouchableOpacity onPress={handleAdd} style={styles.plusIcon}>
            <Icon name="add" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}> Charge per Hour </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={chargePerHour}
              onChangeText={setChargePerHour}
            />

            <TouchableOpacity
              onPress={handleRecharge}
              style={styles.modalButton}
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default driverProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingTop: 100,
    padding: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  smallText: {
    fontSize: 14,
    fontWeight: "regular",
    // marginTop: 10,
    marginBottom: 10,
  },
  textTag: {
    fontSize: 14,
    fontWeight: "300",
    marginTop: 5,
  },
  avatar: {
    width: 250,
    height: 250,
    borderRadius: 200,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 20,
    borderColor: "#b5b5b5",
    borderWidth: 0,
    borderRadius: 10,
    marginTop: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowColor: "black",
    marginVertical: 10,
  },
  section: {
    width: "100%",
    marginTop: 10,
    alignContent: "center",
    alignItems: "center",
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
    marginBottom: 0,
    marginTop: 30,
  },
  rowsection: {
    flexDirection: "row",
    margin: 10,
    justifyContent: "space-between",
    width: "100%",
  },
  halfcard: {
    width: "48%",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  walletContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    // justifyContent: "center",
  },
  walletBalance: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  plusIcon: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
});
