import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";

const verificationInProgress = () => {
  const handlePress = async () => {};

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.title}>Verification in Progress</Text>
      </View>
      <View>
        <Image
          source={require("../../assets/images/verification.png")}
          style={styles.image}
        ></Image>
      </View>
      <View style={styles.wrapper}>
        <Text style={styles.smalltexttitle}>
          Verification in Progress, We will send you a mail upon Verification.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={""}>
        <Text style={styles.buttonText} onPress={handlePress}>
          {" "}
          Check Email
        </Text>
      </TouchableOpacity>

      <Link href={"/"} style={styles.signupText}>
        Go Back
      </Link>
    </ScrollView>
  );
};

export default verificationInProgress;

const styles = StyleSheet.create({
  title: {
    fontSize: 45,
    fontWeight: "bold",
    marginBottom: 200,
    paddingLeft: 20,
    marginTop: 40,
  },
  smalltext: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  wrapper: {
    backgroundColor: "#F8faec",
    borderRadius: 20,
    marginBottom: 18,
    padding: 20,
    marginHorizontal: 20,
  },
  highlight: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  image: {
    marginTop: 50,
    marginBottom: 20,
    marginHorizontal: 130,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    marginHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    justifyContent: "center",
    alignContent: "center",
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
    textAlign: "center",
  },
  container: {
    backgroundColor: "#fff",
    paddingTop: 70,
  },
});
