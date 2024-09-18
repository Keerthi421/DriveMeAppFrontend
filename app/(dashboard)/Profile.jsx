import { Card } from "@rneui/base";
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

const Profile = () => {
  const [profile, setProfile] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await AsyncStorage.getItem("token");
        const userId = jwtDecode(user).user_id;
        const response = await axios.get(`${config.host}/v1/users/profile`, {
          params: { id: userId },
          headers: { "Content-Type": "application/json" },
        });
        console.log("Passenger Profile info", response.data?.data);
        if (response.data?.data) {
          setProfile(response.data.data);
          setEditableProfile({
            name: response.data.data.user?.name || "",
            tag: response.data.data.user?.tag || "",
            about: response.data.data.user?.about || "",
            model: response.data.data.vehicle?.model || "",
            shift: response.data.data.vehicle?.shift || "",
            walletBalance: response.data.data.user?.walletBalance || "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (name, value) => {
    setEditableProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const user = await AsyncStorage.getItem("token");
      const userId = jwtDecode(user).user_id;
      await axios.put(
        `${config.host}/v1/users/profile`,
        {
          id: userId,
          ...editableProfile,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setProfile({
        ...profile,
        user: {
          ...profile.user,
          ...editableProfile,
        },
        vehicle: {
          ...profile.vehicle,
          model: editableProfile.model,
          shift: editableProfile.shift,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleAdd = async () => {
    setExpiryDate(profile?.user?.expiryDate);
    setCardNumber(profile?.user?.cardNumber);
    setModalVisible(true);
  };
  const handleRecharge = async () => {
    try {
      const user = await AsyncStorage.getItem("token");
      const userId = jwtDecode(user).user_id;
      await axios.post(
        `${config.host}/v1/users/wallet`,
        {
          id: userId,
          amount: parseInt(rechargeAmount),
          cardNumber,
          expiryDate,
          cvv,
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
            parseInt(prevProfile.user.walletBalance) + parseInt(rechargeAmount),
        },
      }));
      setRechargeAmount("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error recharging wallet:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.avatar}
        source={require("../../assets/images/passenger_profile.jpg")}
      />
      <TextInput
        style={styles.text}
        value={editableProfile.name}
        editable={isEditing}
        onChangeText={(text) => handleInputChange("name", text)}
      />
      <TextInput
        style={styles.textTag}
        value={editableProfile.tag}
        editable={isEditing}
        onChangeText={(text) => handleInputChange("tag", text)}
      />

      <View style={styles.section}>
        <Text>About </Text>
        <TextInput
          style={styles.card}
          value={editableProfile.about}
          editable={isEditing}
          onChangeText={(text) => handleInputChange("about", text)}
        />
      </View>

      <View style={styles.rowsection}>
        <View style={styles.halfcard}>
          <Text>Model</Text>
          <TextInput
            style={styles.card}
            value={editableProfile.model}
            editable={isEditing}
            onChangeText={(text) => handleInputChange("model", text)}
          />
        </View>

        <View style={styles.halfcard}>
          <Text>Shift</Text>
          <TextInput
            style={styles.card}
            value={editableProfile.shift}
            editable={isEditing}
            onChangeText={(text) => handleInputChange("shift", text)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text>Wallet Balance </Text>
        <View style={styles.walletContainer}>
          <Text style={styles.walletBalance}>
            {profile?.user?.walletBalance}
          </Text>
          <TouchableOpacity onPress={handleAdd} style={styles.plusIcon}>
            <Icon name="add" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={handleEditToggle} style={styles.button}>
        <Text style={styles.buttonText}>{isEditing ? "Cancel" : "Edit"}</Text>
      </TouchableOpacity>
      {isEditing && (
        <TouchableOpacity onPress={handleSave} style={styles.button}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      )}

      {/* Modal for recharging wallet */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recharge Wallet</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={rechargeAmount}
              onChangeText={setRechargeAmount}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Card Number"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Expiry Date (MM/YY)"
              value={expiryDate}
              onChangeText={setExpiryDate}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="CVV"
              keyboardType="numeric"
              value={cvv}
              onChangeText={setCvv}
            />
            <TouchableOpacity
              onPress={handleRecharge}
              style={styles.modalButton}
            >
              <Text style={styles.buttonText}>Recharge</Text>
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

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
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
  },
  textTag: {
    fontSize: 14,
    fontWeight: "300",
    marginTop: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    justifyContent: "space-between",
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
