import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import config from "../config/env";

const Onboarding = () => {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [licenseImage, setLicenseImage] = useState(null);
  const [insuranceImage, setInsuranceImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [backendError, setBackendError] = useState("");

  // Handler for age input change
  const handleAgeChange = (text) => {
    setAge(text);
    setBackendError((prevErrors) => ({ ...prevErrors, age: null }));
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userData");
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Function to pick image
  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Handler for onboarding submission
  const handleOnboard = async () => {
    if (!age) {
      setBackendError({ age: "Age is required." });
      return;
    }

    if (!licenseImage || !insuranceImage || !profileImage) {
      setBackendError({ message: "All images are required." });
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const userId = jwtDecode(token).user_id;
      if (licenseImage && insuranceImage) {
        await axios.put(
          `${config.host}/v1/drivers/onboard`,
          {
            id: userId,
            isDocumentsSubmitted: true,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      router.push("/verificationInProgress");
    } catch (error) {
      // try {
      //   const token = await AsyncStorage.getItem("token");
      //   if (!token) {
      //     throw new Error("No token found");
      //   }

      //   const userId = jwtDecode(token).user_id;

      //   const formData = new FormData();
      //   formData.append("id", userId);
      //   formData.append("age", age);
      //   formData.append("licenseImage", {
      //     uri: licenseImage,
      //     name: "license.jpg",
      //     type: "image/jpeg",
      //   });
      //   formData.append("insuranceImage", {
      //     uri: insuranceImage,
      //     name: "insurance.jpg",
      //     type: "image/jpeg",
      //   });
      //   formData.append("profileImage", {
      //     uri: profileImage,
      //     name: "profile.jpg",
      //     type: "image/jpeg",
      //   });

      //   console.log("FormData being sent:", {
      //     id: userId,
      //     age,
      //     licenseImage,
      //     insuranceImage,
      //     profileImage,
      //   });

      //   const response = await axios.put(
      //     `${config.host}/v1/drivers/onboard`,
      //     formData,
      //     {
      //       headers: {
      //         "Content-Type": "multipart/form-data",
      //       }
      //     }
      //   );

      //   console.log("Response from backend:", response.data);
      //   router.push("/verificationInProgress");
      // }

      console.log(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setBackendError({ message: "An unexpected error occurred." });
    }
  };

  // Handler for cancel button press
  const cancelOnboarding = () => {
    setAge("");
    setLicenseImage(null);
    setInsuranceImage(null);
    setProfileImage(null);
    setBackendError("");
    router.push({ pathname: "/" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.card, { width: "100%", height: "100%" }]}>
          <Text style={styles.title}>Onboarding</Text>

          <View style={styles.groupMargin}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              onChangeText={handleAgeChange}
              value={age}
              style={styles.input}
              placeholder="Age"
              keyboardType="numeric"
            />
            {backendError.age && (
              <Text style={styles.errorText}>{backendError.age}</Text>
            )}
          </View>

          <View style={styles.groupMargin}>
            <Text style={styles.label}>License Document</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickImage(setLicenseImage)}
            >
              <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>
            {licenseImage && (
              <Image source={{ uri: licenseImage }} style={styles.image} />
            )}
          </View>

          <View style={styles.groupMargin}>
            <Text style={styles.label}>Insurance Documents</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickImage(setInsuranceImage)}
            >
              <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>
            {insuranceImage && (
              <Image source={{ uri: insuranceImage }} style={styles.image} />
            )}
          </View>

          <View style={styles.groupMargin}>
            <Text style={styles.label}>Profile Picture</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickImage(setProfileImage)}
            >
              <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>
            {profileImage && (
              <Image source={{ uri: profileImage }} style={styles.image} />
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleOnboard}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

          <Text style={styles.cancelButton} onPress={cancelOnboarding}>
            Cancel
          </Text>

          <Text style={styles.cancelButton} onPress={handleLogout}>
            Logout
          </Text>

          <Link href={"/"} style={styles.signupText}>
            Go Back
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Onboarding;

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  card: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  title: {
    fontSize: 40,
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
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 15,
  },
  errorText: {
    color: "red",
    marginTop: 0,
  },
  uploadButton: {
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 150,
    marginTop: 10,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  signupText: {
    marginTop: 10,
    color: "#888",
    fontSize: 14,
    textAlign: "center",
  },
});
