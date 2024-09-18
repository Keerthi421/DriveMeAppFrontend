import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import axios from "axios";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { useRouter } from "expo-router";
import config from "../config/env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [backendError, setBackendError] = useState("");

  const handleEmailChange = (text) => {
    setEmail(text);
    setBackendError((prevErrors) => ({
      ...prevErrors,
      email: null,
      invalid: null,
      emailNotVerified: null,
    }));
  };
  const handlePasswordChange = (text) => {
    setPassword(text);
    setBackendError((prevErrors) => ({
      ...prevErrors,
      password: null,
      invalid: null,
      emailNotVerified: null,
    }));
  };
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${config.host}/v1/users/login`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { token, userData } = response.data;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      if (userData.userRole == "Driver") {
        userData.isVerified && !userData.isDocumentsSubmitted
          ? router.push({
              pathname: "/driverOnboarding",
              params: {
                userData: JSON.stringify(response.data),
              },
            })
          : userData.isDocumentsSubmitted && !userData.isVerified
          ? router.push({
              pathname: "/verificationInProgress",
            })
          : router.push({
              pathname: "/requests",
            });
      } else {
        router.push({
          pathname: "/home",
          params: {
            userData: JSON.stringify(response.data),
          },
        });
      }
    } catch (error) {
      setBackendError(error.response?.data);
    }
  };

  const cancelLogin = async () => {
    setEmail("");
    setPassword("");
    setBackendError("");
    router.push({
      pathname: "/",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Image
          source={require("../../assets/images/login.jpeg")}
          style={styles.image}
        />
        {backendError?.invalid && (
          <Text style={styles.errorText}>{backendError?.invalid}</Text>
        )}
        {!backendError?.invalid && backendError?.emailNotVerified && (
          <Text style={styles.errorText}>{backendError.emailNotVerified}</Text>
        )}
        <View style={styles.groupMargin}>
          <Text style={styles.title}>Email Address</Text>
          <TextInput
            onChangeText={handleEmailChange}
            value={email}
            style={styles.input}
            placeholder="Email Address"
            keyboardType="email-address"
          />
          {backendError?.email && (
            <Text style={styles.errorText}>{backendError.email}</Text>
          )}
        </View>

        <View style={styles.groupMargin}>
          <Text style={styles.title}>Password</Text>
          <TextInput
            onChangeText={handlePasswordChange}
            value={password}
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
          />
          {backendError?.password && (
            <Text style={styles.errorText}>{backendError.password}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.cancelButton} onPress={cancelLogin}>
          Cancel
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    height: height,
  },
  scrollView: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    width: width * 0.9,
    fontSize: 15,
    fontWeight: "thin",
    marginBottom: 5,
  },
  image: {
    width: width * 0.9,
    height: height * 0.3,
    marginBottom: height * 0.05,
    borderRadius: 10,
  },
  input: {
    width: width * 0.9,
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
    marginTop: 80,
    position: "absolute",
    top: Platform.OS === "ios" ? height * 0.65 : height * 0.75,
    right: "5%",
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
    color: "#4CAF50",
    position: "absolute",
    top: Platform.OS === "ios" ? height * 0.85 : height * 0.92,
    right: "45%",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginTop: 0,
  },
});
