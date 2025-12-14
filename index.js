// index.tsx
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { getApp, initializeApp } from "@react-native-firebase/app";

// ✅ Modular Firebase initialization
try {
  getApp();
} catch (error) {
  initializeApp();
}

AppRegistry.registerComponent(appName, () => App);
