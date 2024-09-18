import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import config from "./config/env.js";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: config.GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: config.GOOGLE_IOS_CLIENT_ID,
    redirectUri: config.REDIRECT_URI,
  });

  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const idToken = await AsyncStorage.getItem("token");
      const userRoleData = await AsyncStorage.getItem("userData");

      if (userRoleData) {
        const parsedData = JSON.parse(userRoleData);
        const userRoles = parsedData.userRole;
        const isDocumentsSubmitted = parsedData.isDocumentsSubmitted;
        const isVerified = parsedData.isVerified;

        if (idToken) {
          if (userRoles === "Driver") {
            if (!isDocumentsSubmitted) {
              router.push({ pathname: "/driverOnboarding" });
            } else if (isDocumentsSubmitted && !isVerified) {
              router.push({ pathname: "/verificationInProgress" });
            } else if (isDocumentsSubmitted && isVerified) {
              router.push({ pathname: "/requests" });
            } else {
              router.push({ pathname: "/driverOnboarding" });
            }
          } else {
            router.push("/home");
          }
        }
      }
    };

    checkLogin();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication) {
        AsyncStorage.setItem("token", authentication.accessToken);
        router.push("/home");
      }
    }
  }, [response]);

  const handleoAuth = async () => {
    promptAsync();
  };

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          <Text style={styles.highlight}>Book professionals </Text>
          <Text>drivers on hourly basis.</Text>
        </Text>
        <Text style={styles.subtitle}>
          <Text style={styles.highlight}>200+</Text> people have used Driveme
          services in your Neighbourhood
        </Text>
        <Text style={styles.subtitle}>
          <Text style={styles.highlight}>Commute with Safety</Text> with Drive
        </Text>
        <TouchableOpacity style={styles.button}>
          <Link href={"/(auth)/sign-in"} style={styles.buttonText}>
            Login with Email
          </Link>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button} onPress={useRouter()}>
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity> */}

        <Link href={"/profileSelection"} style={styles.signupText}>
          Haven’t Registered Yet? <Text style={styles.signupLink}>Sign Up</Text>
        </Link>

        {/* // Backup to show when needed */}
        {/* <Link href={"/success"} style={styles.signupText}>
          success screen
        </Link>
        <Link href={"/success"} style={styles.signupText}>
          Success Registration
        </Link> */}
      </View>
    </SafeAreaView>
  );
}
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flex: 0,
    padding: 5,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 25,
    color: "#888",
    marginBottom: 20,
  },
  highlight: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  button: {
    marginTop: height * 0.35,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    color: "#fff",
    fontSize: 16,

    textAlign: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  loginText: {
    marginTop: 300,
    color: "#888",
    fontSize: 14,
    textAlign: "center",
  },
  signupText: {
    marginTop: 10,
    color: "#888",
    fontSize: 14,
    textAlign: "center",
  },
  signupLink: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});
