import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Alert,
  StatusBar,
  Text,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  signInWithCredential,
  GoogleAuthProvider,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { default_theme } from "../../assets/theme/color";
import messaging from "@react-native-firebase/messaging";

// Components
import AuthInputField from '../../components/textfields/auth';
import AuthButton from '../../components/buttons/authButton';
import TextButton from '../../components/buttons/Text';
// Firebase imports
import { auth } from '../../firebaseConfig';
import { login } from '../../backend/auth'; // your email-password auth function
import { DefaultTheme } from '@react-navigation/native';
import { updateMerchantFCMToken } from '../../backend/fcm';
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  // ✅ Configure Google Signin
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // from Firebase Console
    });
  }, []);


const handleLogin = async () => {
  try {
    const { uid } = await login(email, password);

    // ✅ Save/update FCM token
    await updateMerchantFCMToken(uid);

    navigation.replace("Main", { restaurantID: uid });
  } catch (error) {
    Alert.alert("Login Error", error.message);
  }
};

  // ✅ Google login
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      const user = userCredential.user;
      navigation.replace('Main', { restaurantID: user.uid });
    } catch (error) {
      Alert.alert('Google Login Error', error.message);
    }
  };

  // ✅ Phone number login
const handlePhoneLogin = () => {
  navigation.navigate("PhoneNumberScreen");
};


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" translucent={false} />

      {/* Logo */}
      <Image source={require('../../assets/logo.png')} style={styles.logo} />

      {/* Input Fields */}
      <AuthInputField
        icon="account"
        placeholder="Enter Email Address"
        value={email}
        onChangeText={setEmail}
      />
      <AuthInputField
        icon="lock"
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={secureText}
        showToggle
        onToggleSecure={() => setSecureText(!secureText)}
      />

      {/* Forgot Password */}
      <View style={styles.forgotContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={{ color: "#8b005d" }}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <AuthButton title="Log In" onPress={handleLogin} />

      {/* OR Continue With */}
      <Text style={styles.orText}>OR Continue With</Text>

      {/* Social / Phone login buttons */}
      <View style={styles.socialContainer}>
        {/* Google Login */}
        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
          <Image
            source={require('../../assets/icons8-google-22.png')}
            style={{ width: 22, height: 22 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Phone Login */}
        <TouchableOpacity style={styles.socialButton} onPress={handlePhoneLogin}>
          <Ionicons name="call" size={22} color="#34A853" />
        </TouchableOpacity>
      </View>

      {/* Sign Up Link */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignupDetails')}>
          <Text style={[styles.signupText, { color: '#8b005d', fontWeight: 'bold' }]}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  forgotContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 5,
    marginBottom: 15,
  },
  orText: {
    marginVertical: 15,
    fontWeight: 'bold',
    color: 'gray',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: default_theme.logingooleiconborder,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: default_theme.logingoogleiconBG,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: 'gray',
  },
});
