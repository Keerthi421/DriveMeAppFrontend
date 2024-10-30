import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../config/env";
import { SafeAreaView } from "react-native-safe-area-context";

const ViewDriverProfile = () => {
  const params = useLocalSearchParams();
  const profileData = JSON.parse(params.driverDetails);
  const chargeData = JSON.parse(params.charge);
  const [profile, setProfile] = useState(profileData);
  const [charge, setCharge] = useState(chargeData);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("profile", charge);
        const response = await axios.get(
          `${config.host}/v1/drivers/rating/${charge.driverId || charge.id}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log(response.data);
        if (response.data?.ratings) {
          setReviews(response.data?.ratings);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  // Sample data for reviews (replace with actual data)
  // const reviews = [
  //   {
  //     id: "1",
  //     rating: 4.0,
  //     text: "The driver is amazing",
  //     date: "11th Oct 2024",
  //   },
  //   {
  //     id: "2",
  //     rating: 3.0,
  //     text: "The driver is marvelous and amazing",
  //     date: "12th Oct 2024",
  //   },
  //   {
  //     id: "3",
  //     rating: 3.0,
  //     text: "The driver is marvelous and amazing",
  //     date: "13th Oct 2024",
  //   },
  // ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          style={styles.avatar}
          source={require("../../assets/images/7309681.jpg")}
        />
        <Text style={styles.driverName}>{profile?.name}</Text>
        <Text style={styles.driverEmail}>{profile?.email}</Text>
      </View>

      {/* Statistics Section */}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Average Rating</Text>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewRating}>{profile.averageRating}</Text>
            <FontAwesome name="star" size={14} color="#FFD700" />
          </View>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Charge per hour</Text>
          <Text style={styles.statValue}>
            ${charge?.chargePerHour || charge?.rate || 0}
          </Text>
        </View>
      </View>

      {/* Reviews Section */}
      <Text style={styles.reviewsTitle}>Reviews</Text>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewRating}>{item.rating}</Text>
              <FontAwesome name="star" size={14} color="#FFD700" />
            </View>
            <Text style={styles.reviewText}>{item.comment}</Text>
          </View>
        )}
        style={styles.reviewList}
      />
    </SafeAreaView>
  );
};

export default ViewDriverProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingLeft: 20,
    paddingRight: 20,
  },
  profileContainer: {
    padding: 50,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
  },
  driverName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  driverEmail: {
    fontSize: 16,
    color: "#888",
  },
  statsContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  rate: {
    display: "flex",
    flexDirection: "row",
  },
  stat: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statLabel: {
    fontSize: 16,
    color: "#555",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  reviewList: {
    marginTop: 10,
  },
  reviewItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  reviewRating: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  reviewDate: {
    fontSize: 12,
    color: "#888",
  },
});
