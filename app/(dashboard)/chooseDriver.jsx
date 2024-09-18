import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import DriverCard from "./component/driverCard";
import axios from "axios";
import config from "../config/env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const { width, height } = Dimensions.get("window");

const ChooseDriver = (props) => {
  console.log("props choose", props);
  const router = useRouter();
  const [selectedDriver, setSelectedDriver] = useState({});
  const [pickUpLocation, setPickUpLocation] = useState(props.pickUpLocation);
  const [dropOffLocation, setDropOffLocation] = useState(props.dropOffLocation);
  const [data, setData] = useState(props.drivers);

  const handleSubmit = async () => {
    try {
      props.setModalVisible(!props.modalVisible);
      props.setScheduleModalVisible(!props.modalVisible);
      const user = await AsyncStorage.getItem("token");
      const userId = jwtDecode(user).user_id;
      const response = await axios.post(
        `${config.host}/v1/users/schedule`,
        {
          vehicleId: props.vehicle,
          date: props.day,
          time: props.time,
          instructions: props.instructions ?? "",
          driverId: selectedDriver?.id,
          passengerId: userId,
          pickUp: pickUpLocation,
          dropOff: dropOffLocation,
          locationPickup: props.locationPickup,
          locationDropoff: props.locationDropoff,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(props, selectedDriver.id, pickUpLocation, dropOffLocation);
      console.log("schedule", response.data.data);
      router.push({
        pathname: "/BookingSuccess",
        params: {
          selectedDriver: JSON.stringify(selectedDriver),
          pickUpLocation: pickUpLocation,
          dropOffLocation: dropOffLocation,
          rideId: response.data?.data?.id,
        },
      });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const modalClose = () => {
    props.setModalVisible(false);
    router.push("/");
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.header}>Choose Driver</Text>
            <Pressable onPress={modalClose}>
              <Text style={styles.cancelButton}>&lt;</Text>
            </Pressable>
            <View style={styles.driversContainer}>
              <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedDriver(item)}
                    style={[
                      styles.cardContainer,
                      item.id === selectedDriver?.id && styles.selectedCard,
                    ]}
                  >
                    <DriverCard driver={item} />
                  </TouchableOpacity>
                )}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChooseDriver;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  groupMargin: {
    marginTop: 20,
  },
  driversContainer: {
    marginTop: 50,
    height: height * 0.65,
    marginBottom: 30,
  },
  header: {
    position: "absolute",
    top: height * 0.05,
    left: width * 0.4,
  },
  modalView: {
    marginTop: 240,
    width: width,
    height: height,
    borderRadius: 10,
    backgroundColor: "white",
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  button: {
    width: width * 0.9,
    paddingVertical: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    position: "absolute",
    top: height * 0.01,
    left: width * -0.01,
    right: "50%",
    fontSize: 25,
    textAlign: "center",
    width: 20,
  },
  cardContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
  selectedCard: {
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
});
