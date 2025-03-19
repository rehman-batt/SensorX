// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import {API_KEY, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId, DB_URL} from '@env';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';


// uncomment
import database from '@react-native-firebase/database';



// const reference = firebase.app().database('https://roadinsight-default-rtdb.asia-southeast1.firebasedatabase.app/')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// uncomment
database().setPersistenceEnabled(true);
database().setPersistenceCacheSizeBytes(100000000);


const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
  databaseURL: DB_URL,
};


export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getDatabase();

