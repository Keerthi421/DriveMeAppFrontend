import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";

const AddPassenger = () => {
  const router = useRouter();
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleImage, setVehicleImage] = useState(null);
  const [backendError, setBackendError] = useState("");

  // Handler for vehicle name input change
  const handleVehicleNameChange = (text) => {
    setVehicleName(text);
    setBackendError((prevErrors) => ({ ...prevErrors, vehicleName: null }));
  };

  // Handler for vehicle model input change
  const handleVehicleModelChange = (text) => {
    setVehicleModel(text);
    setBackendError((prevErrors) => ({ ...prevErrors, vehicleModel: null }));
  };

  // Handler for vehicle year input change
  const handleVehicleYearChange = (text) => {
    setVehicleYear(text);
    setBackendError((prevErrors) => ({ ...prevErrors, vehicleYear: null }));
  };

  // Function to pick image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setVehicleImage(result.assets[0].uri);
    }
  };

  // Handler for form submission
  const handleSubmit = async () => {
    if (!vehicleName || !vehicleModel || !vehicleYear) {
      setBackendError({
        vehicleName: !vehicleName ? "Vehicle name is required." : null,
        vehicleModel: !vehicleModel ? "Vehicle model is required." : null,
        vehicleYear: !vehicleYear ? "Vehicle year is required." : null,
      });
      return;
    }

    try {
      // Simulate form data submission handling
      console.log("Vehicle Information Submitted:", { vehicleName, vehicleModel, vehicleYear, vehicleImage });
      router.push("/success");
    } catch (error) {
      console.log("Error:", error);
      setBackendError({ message: "An unexpected error occurred." });
    }
  };

  // Handler for cancel button press
  const cancelSubmission = () => {
    setVehicleName("");
    setVehicleModel("");
    setVehicleYear("");
    setVehicleImage(null);
    setBackendError("");
    router.push({ pathname: "/" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.card, { width: "100%", height: "100%" }]}>
        <Text style={styles.title}>Add Passenger Information</Text>

        <View style={styles.groupMargin}>
          <Text style={styles.label}>Vehicle Name</Text>
          <TextInput
            onChangeText={handleVehicleNameChange}
            value={vehicleName}
            style={styles.input}
            placeholder="Vehicle Name"
          />
          {backendError.vehicleName && (
            <Text style={styles.errorText}>{backendError.vehicleName}</Text>
          )}
        </View>

        <View style={styles.groupMargin}>
          <Text style={styles.label}>Vehicle Model</Text>
          <TextInput
            onChangeText={handleVehicleModelChange}
            value={vehicleModel}
            style={styles.input}
            placeholder="Vehicle Model"
          />
          {backendError.vehicleModel && (
            <Text style={styles.errorText}>{backendError.vehicleModel}</Text>
          )}
        </View>

        <View style={styles.groupMargin}>
          <Text style={styles.label}>Vehicle Year</Text>
          <TextInput
            onChangeText={handleVehicleYearChange}
            value={vehicleYear}
            style={styles.input}
            placeholder="Vehicle Year"
            keyboardType="numeric"
          />
          {backendError.vehicleYear && (
            <Text style={styles.errorText}>{backendError.vehicleYear}</Text>
          )}
        </View>

        <View style={styles.groupMargin}>
          <Text style={styles.label}>Vehicle Image</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
          {vehicleImage && <Image source={{ uri: vehicleImage }} style={styles.image} />}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <Text style={styles.cancelButton} onPress={cancelSubmission}>
          Cancel
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AddPassenger;

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
  },
  label: {
    width: width * 0.9,
    fontSize: 15,
    fontWeight: "thin",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  groupMargin: {
    marginBottom: 20,
  },
  button: {
    marginTop: height * 0.2,
    position: "absolute",
    top: height * 0.65,
    right: "5%",
    width: "100%",
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
    color: "#4CAF50",
    position: "absolute",
    top: height * 0.85,
    right: "50%",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginTop: 0,
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  image: {
    width: width * 0.8,
    height: height * 0.2,
    marginTop: 10,
    borderRadius: 10,
  },
});
