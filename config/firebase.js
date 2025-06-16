// Import necessary Firebase modules for app initialization, authentication, and real-time database
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';

// Import the React Native Firebase Realtime Database for additional persistence settings
import database from '@react-native-firebase/database';

// Enable offline persistence and set cache size for React Native Firebase database
database().setPersistenceEnabled(true);
database().setPersistenceCacheSizeBytes(100000000); // 100MB cache size

// Firebase configuration object using environment variables for security
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
  databaseURL: process.env.DB_URL,
};

// Initialize Firebase app
export const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Firebase authentication with persistence using AsyncStorage (React Native)
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize and export the Realtime Database instance
export const db = getDatabase();
