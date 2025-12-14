import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/auth/login";
import SignupScreen from "../screens/auth/signin";
import QRScreen from "../screens/qr";
import MenuManagement from "../screens/menu";
import SplashScreen from "../screens/splash";
import MainScreen from "../screens/main";
import ProfileScreen from "../screens/profile";
import SettingsScreen from "../screens/settings";
import SignupDetailsScreen from "../screens/newuser";
import ForgotPasswordScreen from "../screens/auth/Forgot";
import PhoneNumberScreen from "../screens/auth/PhoneNumberScreen";
import OtpVerificationScreen from "../screens/auth/OtpVerificationScreen";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  QRScreen: undefined;
  Home: undefined;
  MenuScreen: undefined;
  Main: undefined;
  Profile: undefined;
  Settings: undefined;
  SignupDetails: { email: string; password: string };
  ForgotPassword: undefined;
  PhoneNumberScreen: undefined;
  OtpVerification: { confirmation: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Splash"
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ animation: "fade_from_bottom" }} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="QRScreen" component={QRScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="MenuScreen" component={MenuManagement} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="SignupDetails" component={SignupDetailsScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="PhoneNumberScreen" component={PhoneNumberScreen} options={{ title: "Phone Login" }} />
        <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} options={{ title: "Verify OTP" }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
