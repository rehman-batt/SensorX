// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {API_KEY} from 'react-native-dotenv';
import {authDomain} from 'react-native-dotenv';
import {projectId} from 'react-native-dotenv';
import {storageBucket} from 'react-native-dotenv';
import {messagingSenderId} from 'react-native-dotenv';
import {appId} from 'react-native-dotenv';
import {measurementId} from 'react-native-dotenv';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeApp(FIREBASE_APP);

