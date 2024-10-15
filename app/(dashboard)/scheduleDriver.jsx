import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ModalDropdown from "react-native-modal-dropdown";
import { useRouter } from "expo-router";
import ChooseDriver from "./chooseDriver";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../config/env";
import { jwtDecode } from "jwt-decode";

const ScheduleDriver = (props) => {
  const router = useRouter();
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleShift, setVehicleShift] = useState("");
  const [driverModalVisible, setDriverModalVisible] = useState(false);
  const [day, setDay] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [instruction, setInstruction] = useState("");
  const [backendError, setBackendError] = useState("");
  const [pickUpLocation, setPickUpLocation] = useState(props.pickUpLocation);
  const [dropOffLocation, setDropOffLocation] = useState(props.dropOffLocation);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [drivers, setDrivers] = useState([]);

  const vehicleModels = [
    "Hatchback",
    "Sedan",
    "SUV",
    "Coupe",
    "Convertible",
    "Wagon",
    "Van",
    "Truck",
    "Minivan",
  ];

  const vehicleShifts = [
    "Manual",
    "Automatic",
    "Semi-Automatic",
    "CVT (Continuously Variable Transmission)",
    "Dual-Clutch Transmission (DCT)",
  ];

  // Handler for vehicle model input change
  const handleVehicleModelChange = (index, value) => {
    setVehicleModel(value);
    setBackendError((prevErrors) => ({ ...prevErrors, vehicleModel: null }));
  };

  // Handler for vehicle shift input change
  const handleVehicleShiftChange = (index, value) => {
    setVehicleShift(value);
    setBackendError((prevErrors) => ({ ...prevErrors, vehicleShift: null }));
  };

  // Handler for date change
  const handleDayChange = (event, selectedDate) => {
    const currentDate = selectedDate || day;
    setShowDatePicker(false);
    setDay(currentDate);
    setBackendError((prevErrors) => ({ ...prevErrors, day: null }));
  };

  // Handler for time change
  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
    setBackendError((prevErrors) => ({ ...prevErrors, time: null }));
  };

  // Handler for instruction input change
  const handleInstructionChange = (text) => {
    setInstruction(text);
    setBackendError((prevErrors) => ({ ...prevErrors, instruction: null }));
  };

  // Handler for form submission
  const handleSubmit = async () => {
    if (!vehicleModel || !vehicleShift || !day || !time) {
      setBackendError({
        vehicleModel: !vehicleModel ? "Vehicle model is required." : null,
        vehicleShift: !vehicleShift ? "Vehicle shift is required." : null,
      });
      return;
    }
    const user = await AsyncStorage.getItem("token");
    const userId = jwtDecode(user).user_id;
    try {
      const response = await axios.post(
        `${config.host}/v1/users/vehicle`,
        {
          passengerId: userId,
          model: vehicleModel,
          shift: vehicleShift,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.data) {
        setVehicle(response.data?.data?.id);
      }

      const driversRes = await axios.get(`${config.host}/v1/drivers/list`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (driversRes?.data?.data) {
        setDrivers(driversRes?.data.data);
      }

      setDriverModalVisible(true);
    } catch (error) {
      console.log("Error:", error);
      setBackendError({ message: "An unexpected error occurred." });
    }
  };

  // Calculate minimum time based on current date
  const minTimeForToday = new Date();
  minTimeForToday.setSeconds(0);
  minTimeForToday.setMilliseconds(0);

  return (
    <View style={styles.centeredView}>
      {driverModalVisible && (
        <ChooseDriver
          modalVisible={driverModalVisible}
          setScheduleModalVisible={props.setModalVisible}
          setModalVisible={setDriverModalVisible}
          pickUpLocation={pickUpLocation}
          dropOffLocation={dropOffLocation}
          locationPickup={props.locationPickUp}
          locationDropoff={props.locationDropOff}
          day={day}
          time={time}
          vehicle={vehicle}
          instruction={instruction}
          drivers={drivers}
        />
      )}
      {!driverModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={props.modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.header}>DATE AND TIME</Text>
              <Pressable
                onPress={() => props.setModalVisible(!props.modalVisible)}
              >
                <Text style={styles.cancelButton}>&lt;</Text>
              </Pressable>
              <View style={styles.groupMargin}>
                <View style={styles.group}>
                  <Text style={styles.title}>Tell us about your Car</Text>
                  <View style={styles.vehicleGroup}>
                    <View style={styles.pickerContainer}>
                      <ModalDropdown
                        options={vehicleModels}
                        defaultValue="Select Model"
                        style={styles.dropdown}
                        textStyle={styles.dropdownText}
                        dropdownStyle={styles.dropdownDropdown}
                        onSelect={handleVehicleModelChange}
                      />
                      {backendError.vehicleModel && (
                        <Text style={styles.errorText}>
                          {backendError.vehicleModel}
                        </Text>
                      )}
                    </View>
                    <View style={styles.pickerContainer}>
                      <ModalDropdown
                        options={vehicleShifts}
                        defaultValue="Select Shift"
                        style={styles.dropdown}
                        textStyle={styles.dropdownText}
                        dropdownStyle={styles.dropdownDropdown}
                        onSelect={handleVehicleShiftChange}
                      />
                      {backendError.vehicleShift && (
                        <Text style={styles.errorText}>
                          {backendError.vehicleShift}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                <View style={styles.group}>
                  <Text style={styles.title}>Pick a Date and Time</Text>
                  <View style={styles.vehicleGroup2}>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      style={styles.datePickerButton}
                    >
                      <Text style={styles.pickerText}>
                        {day ? day.toDateString() : "Select Day"}
                      </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                      <DateTimePicker
                        value={day}
                        mode="date"
                        display="default"
                        minimumDate={new Date()}
                        onChange={handleDayChange}
                      />
                    )}

                    <TouchableOpacity
                      onPress={() => setShowTimePicker(true)}
                      style={styles.datePickerButton}
                    >
                      <Text style={styles.pickerText}>
                        {time ? time.toLocaleTimeString() : "Select Time"}
                      </Text>
                    </TouchableOpacity>
                    {showTimePicker && (
                      <DateTimePicker
                        value={time}
                        mode="time"
                        display="default"
                        minimumDate={
                          day.getTime() === new Date().getTime()
                            ? minTimeForToday
                            : null
                        }
                        onChange={handleTimeChange}
                      />
                    )}
                  </View>
                </View>
                <View style={styles.group}>
                  <Text style={styles.title}>
                    Any Delivery Instructions (Optional)
                  </Text>
                  <TextInput
                    onChangeText={handleInstructionChange}
                    value={instruction}
                    style={styles.input}
                    placeholder="Type Here"
                  />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ScheduleDriver;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  groupMargin: {
    marginTop: 60,
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
  vehicleGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  vehicleGroup2: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  group: {
    flexDirection: "column",
    marginTop: 20,
  },

  button: {
    position: "absolute",
    top: height * 0.65,
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
  errorText: {
    marginTop: 10,
    width: width * 0.5,
    color: "red",
  },
  input: {
    marginTop: 10,
    width: "100%",
    height: width * 0.15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
    padding: 10,
  },
  pickerContainer: {
    marginTop: 20,
    width: width * 0.4,
    height: width * 0.15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  dropdown: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    textAlign: "center",
  },
  dropdownDropdown: {
    width: "50%",
    height: "auto",
  },
  datePickerButton: {
    marginTop: 20,
    width: "100%",
    height: width * 0.15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    marginBottom: 5,
  },
  pickerText: {
    fontSize: 16,
    textAlign: "center",
  },
});
