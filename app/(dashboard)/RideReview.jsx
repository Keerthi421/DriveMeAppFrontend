import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AirbnbRating } from "react-native-elements";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import config from "../config/env";

const RideReview = () => {
  const params = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const router = useRouter();

  const submitReview = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please provide a rating");
      return;
    }
    if (review.trim() === "") {
      Alert.alert("Error", "Please write a review");
      return;
    }

    try {
      console.log(params.driverId);
      const response = await axios.post(
        `${config.host}/v1/drivers/rating`,
        {
          driverId: params.driverId,
          rating: rating,
          comment: review,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response?.data?.message) {
        Alert.alert("Thank you!", "Your review has been submitted.", [
          {
            text: "OK",
            onPress: () => router.push("/"),
          },
        ]);
      } else {
        Alert.alert("Error", "Failed to submit the review");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Rate Your Ride</Text>
        <Text style={styles.subtitle}>
          Please rate and review your ride experience
        </Text>

        <AirbnbRating
          count={5}
          reviews={["Terrible", "Bad", "OK", "Good", "Amazing"]}
          defaultRating={0}
          size={40}
          onFinishRating={(rating) => setRating(rating)}
        />

        <TextInput
          style={styles.reviewInput}
          multiline
          numberOfLines={4}
          placeholder="Write your review here..."
          value={review}
          onChangeText={setReview}
        />

        <TouchableOpacity style={styles.button} onPress={submitReview}>
          <Text style={styles.buttonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RideReview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
    textAlign: "center",
  },
  reviewInput: {
    width: "100%",
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    textAlignVertical: "top",
    marginTop: 20,
  },
  button: {
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
