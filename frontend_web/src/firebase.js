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
  // Use literal config for user-provided debugging & clarity:
  apiKey: "AIzaSyBNA7xaoiynpwD8j3rE3qB9-daUnmDIbno",
  authDomain: "doodlefinder.firebaseapp.com",
  projectId: "doodlefinder",
  storageBucket: "doodlefinder.appspot.com", // corrected typo if any
  messagingSenderId: "306458973633",
  appId: "1:306458973633:web:5862a96764e4bd75a6cb40",
  measurementId: "G-2H7VRGX2VY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
