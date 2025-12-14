// firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeFirestore } from "firebase/firestore"; // ⬅ changed from getFirestore

const firebaseConfig = {
  apiKey: "AIzaSyAl6cJOF3-IfJphVbV1LnDsOY_gaS_Fnvo",
  authDomain: "foodo-e69ca.firebaseapp.com",
  projectId: "foodo-e69ca",
  storageBucket: "foodo-e69ca.appspot.com",
  messagingSenderId: "856282364600",
  appId: "1:856282364600:android:517e42002f72f61448d24d",
};

// ✅ Initialize app safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// ✅ Use long-polling mode (fixes “client is offline” on emulator)
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

// ✅ Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, db };