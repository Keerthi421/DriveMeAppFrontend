import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("set timeout called");
      onClose();
    }, 5000); // Auto close after 5 seconds

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>X</Text>
      </TouchableOpacity>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    padding: 30,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1002,
  },
  message: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 10,
    padding: 5,
    borderRadius: 15,
  },
  closeText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});
