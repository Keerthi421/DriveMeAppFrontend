import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiDKvfey2l1L7hqgKj4tp6r8APvlxdkDo",
  authDomain: "driveme-6bcf6.firebaseapp.com",
  projectId: "driveme-6bcf6",
  storageBucket: "driveme-6bcf6.appspot.com",
  messagingSenderId: "173128555035",
  appId: "1:173128555035:web:e730235193afcc8a8db6be"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);

// Initialize Firebase Auth with persistence
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage)
});
