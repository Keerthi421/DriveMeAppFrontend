import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import axios from "axios";
import config from "../config/env";
import { useRoute } from "@react-navigation/native";
// SignUp Component
const SignUp = () => {
  const route = useRoute();
  const { userRole } = route.params;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [backendError, setBackendError] = useState("");
  console.log(userRole);
  // Handler for name input change
  const handleName = (text) => {
    setName(text);
    setBackendError((prevErrors) => ({ ...prevErrors, name: null }));
  };

  // Handlet for email input change
  const handleEmail = (text) => {
    setEmail(text);
    setBackendError((prevErrors) => ({
      ...prevErrors,
      email: null,
      alreadyExist: null,
      error: null,
    }));
  };

  // Handler for Password Input change
  const handlePassword = (text) => {
    setPassword(text);
    setBackendError((prevErrors) => ({
      ...prevErrors,
      password: null,
      passwordLength: null,
    }));
  };
  // Handler for confirm Password Input Change
  const handleCPasswordChange = (text) => {
    setConfirmPassword(text);
    setBackendError((prevErrors) => ({
      ...prevErrors,
      confirmPassword: null,
      passwordMatch: null,
    }));
  };

  //Handler for signup button press

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        `${config.host}/v1/users/sign-up`,
        {
          email: email,
          password: password,
          name: name,
          confirmPassword: confirmPassword,
          userRole: userRole,
          isVerified: true, //should be false by default. Keeping it true for now
          isDocumentsSubmitted: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.response) {
        await clearStates();
      }

      router.push("/success");
    } catch (error) {
      if (error.response) {
        setBackendError(error.response?.data);
      } else if (error.request) {
        setBackendError({ message: "Network error, please try again." });
      } else {
        setBackendError({ message: "An unexpected error occurred." });
      }
    }
  };

  // Handler for cancel button press

  const cancelLogin = async () => {
    await clearStates();
    router.push({
      pathname: "/",
    });
  };

  const clearStates = async () => {
    setEmail("");
    setName("");
    setPassword("");
    setConfirmPassword("");
    setBackendError({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.card, { width: "100%", height: "100%" }]}>
        <Text style={styles.title}>SignUp</Text>
        <View style={styles.groupMargin}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            onChangeText={handleName}
            value={name}
            style={styles.input}
            placeholder="Full Name"
          />
          {backendError.name && (
            <Text style={styles.errorText}>{backendError.name}</Text>
          )}
        </View>
        <View style={styles.groupMargin}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            onChangeText={handleEmail}
            value={email}
            style={styles.input}
            placeholder="Email Address"
            keyboardType="email-address"
            autoComplete="off"
            textContentType="none"
            autoCapitalize="none"
          />
          {backendError.email && (
            <Text style={styles.errorText}>{backendError.email}</Text>
          )}
          {!backendError.email && backendError.alreadyExist && (
            <Text style={styles.errorText}>{backendError.alreadyExist}</Text>
          )}
        </View>
        <View style={styles.groupMargin}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            onChangeText={handlePassword}
            value={password}
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            autoComplete="off"
            textContentType="none"
          />
          {backendError.password && (
            <Text style={styles.errorText}>{backendError.password}</Text>
          )}
          {!backendError.password && backendError.passwordLength && (
            <Text style={styles.errorText}>{backendError.passwordLength}</Text>
          )}
        </View>
        <View style={styles.groupMargin}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            onChangeText={handleCPasswordChange}
            value={confirmPassword}
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={true}
            autoComplete="off"
            textContentType="none"
          />
          {backendError.confirmPassword && (
            <Text style={styles.errorText}>{backendError.confirmPassword}</Text>
          )}
          {!backendError.confirmPassword && backendError.passwordMatch && (
            <Text style={styles.errorText}>{backendError.passwordMatch}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.cancelButton} onPress={cancelLogin}>
          Cancel
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
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
    marginTop: height * 0.2,
    position: "absolute",
    top: height * 0.55,
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
});
