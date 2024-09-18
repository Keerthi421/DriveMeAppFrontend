import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqn2uXb48ZwRNApecCxqJDtEgRy-33_Es",
  authDomain: "driveme-a41bb.firebaseapp.com",
  projectId: "driveme-a41bb",
  storageBucket: "driveme-a41bb.appspot.com",
  messagingSenderId: "529433476377",
  appId: "1:529433476377:web:0802653bcb4f6c62399988",
  measurementId: "G-7V6N9FQT21"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);

// Initialize Firebase Auth with persistence
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage)
});
