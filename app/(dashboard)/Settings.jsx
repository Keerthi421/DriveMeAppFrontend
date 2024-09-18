import React from "react";
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import call from "react-native-phone-call";

const Settings = () => {
  const makeCall = () => {
    const args = {
      number: "911",
      prompt: true,
    };

    call(args).catch(console.error);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headertext}> Settings</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.btext}> Carbon Emissions</Text>
          <View style={styles.statusRow}>
            <Image
              style={styles.avatar}
              source={{
                uri: "https://i.postimg.cc/HWyZcGhj/carbon-neutral.png",
              }}
            />
            <Text style={styles.text}> 9.00 g</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.btext}> Emergency Assitance</Text>
          <TouchableOpacity style={styles.button} onPress={makeCall}>
            <Text style={styles.buttonText}>Call 911</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "regular",
    color: "#807f7f",
  },
  btext: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 20,
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
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  header: {
    marginTop: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headertext: {
    fontSize: 24,
    fontWeight: "600",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 25,
    marginRight: 10,
  },
  button: {
    // marginTop: 50,
    // position: "absolute",
    // right: "5%",
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
});
