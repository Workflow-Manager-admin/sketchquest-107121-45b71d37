import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * PUBLIC_INTERFACE
 * Firebase config for SketchQuest - IMPORTANT:
 * You must replace all fields below with your actual Firebase project's config values.
 *
 * - Enable Anonymous Auth in Firebase Console
 * - Enable Firestore and Storage
 * - Set up authDomain as shown in Firebase Console
 *
 * Ignoring this will cause anonymous login and all API calls to fail with
 * "Couldn't login... try again?" due to missing/invalid project credentials.
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN_HERE",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID_HERE",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID_HERE",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "YOUR_APP_ID_HERE",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "YOUR_MEASUREMENT_ID_HERE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
