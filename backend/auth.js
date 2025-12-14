import { auth, db } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateMerchantFCMToken } from "./fcm";
import authRN from "@react-native-firebase/auth";

/* =====================================================
   🧠 LOCAL SESSION HELPERS
===================================================== */
const saveMerchantSession = async (uid) => {
  try {
    await AsyncStorage.setItem("merchantUID", uid);
    await AsyncStorage.setItem("role", "merchant");
    console.log("✅ Merchant session stored:", uid);
  } catch (err) {
    console.error("❌ Error saving merchant session:", err);
  }
};

const clearMerchantSession = async () => {
  try {
    await AsyncStorage.removeItem("merchantUID");
    await AsyncStorage.removeItem("role");
    console.log("🧹 Merchant session cleared");
  } catch (err) {
    console.error("❌ Error clearing session:", err);
  }
};

/* =====================================================
   🔐 SIGNUP (EMAIL + PASSWORD)
===================================================== */
export const signup = async (email, password, restaurantName, details = {}) => {
  if (!email || !password || !restaurantName) {
    throw new Error("Please fill all fields");
  }

  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "restaurants", user.uid), {
    email,
    restaurantName,
    role: "merchant",
    address: details.address || "",
  contactNumber: details.contactNumber.startsWith('+')
    ? details.contactNumber
    : `+91${details.contactNumber}`,
    photo: details.photo || "",
    createdAt: serverTimestamp(),
  });

  await saveMerchantSession(user.uid);
  await updateMerchantFCMToken(user.uid);

  return { uid: user.uid, role: "merchant" };
};

/* =====================================================
   🔑 LOGIN (EMAIL + PASSWORD)
===================================================== */
export const login = async (email, password) => {
  if (!email || !password) throw new Error("Please fill all fields");

  const { user } = await signInWithEmailAndPassword(auth, email, password);

  const userDoc = await getDoc(doc(db, "restaurants", user.uid));
  if (!userDoc.exists()) {
    await signOut(auth);
    throw new Error("Account not found in restaurant records");
  }

  const { role } = userDoc.data();
  if (role !== "merchant") {
    await signOut(auth);
    throw new Error("Unauthorized: Not a merchant account");
  }

  await saveMerchantSession(user.uid);
  await updateMerchantFCMToken(user.uid);

  return { uid: user.uid, role };
};

/* =====================================================
   🚪 LOGOUT
===================================================== */
export const logoutMerchant = async () => {
  try {
    const uid = await AsyncStorage.getItem("merchantUID");
    if (uid) {
      await updateDoc(doc(db, "restaurants", uid), { fcmTokens: [] });
    }
    await signOut(auth);
    await clearMerchantSession();
    console.log("✅ Merchant logged out successfully");
  } catch (err) {
    console.error("❌ Logout failed:", err);
  }
};

/* =====================================================
   🧠 CHECK LOGIN STATUS
===================================================== */
export const checkLogin = async () => {
  try {
    const uid = await AsyncStorage.getItem("merchantUID");
    const role = await AsyncStorage.getItem("role");

    if (!uid || role !== "merchant") return null;

    const docRef = doc(db, "restaurants", uid);
    const userDoc = await getDoc(docRef);

    if (userDoc.exists() && userDoc.data().role === "merchant") {
      await updateMerchantFCMToken(uid);
      return { uid, role: "merchant" };
    } else {
      await clearMerchantSession();
      await signOut(auth);
      return null;
    }
  } catch (err) {
    console.error("❌ checkLogin error:", err);
    return null;
  }
};

/* =====================================================
   ✉️ RESET PASSWORD
===================================================== */
export const resetMerchantPassword = async (email) => {
  if (!email) throw new Error("Please enter your email address");

  try {
    await sendPasswordResetEmail(auth, email);
    console.log("📨 Password reset email sent to:", email);
    return true;
  } catch (err) {
    console.error("❌ Error sending password reset:", err);
    throw new Error("Failed to send reset link. Please check your email address.");
  }
};

/* =====================================================
   📞 PHONE LOGIN (OTP)
===================================================== */
export const checkMerchantPhoneExists = async (phoneNumber) => {
  // ✅ Matches your Firestore field name: contactNumber
  const merchantsRef = collection(db, "restaurants");
  const q = query(merchantsRef, where("contactNumber", "==", phoneNumber));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const phoneLoginMerchant = async (phoneNumber) => {
  if (!phoneNumber || !phoneNumber.startsWith("+")) {
    throw new Error("Invalid phone number format. Use +91XXXXXXXXXX");
  }

  try {
    console.log("📲 Sending OTP to:", phoneNumber);
    const confirmation = await authRN().signInWithPhoneNumber(phoneNumber);
    return confirmation;
  } catch (error) {
    console.error("❌ Phone login error:", error);
    throw new Error(error.message);
  }
};

/* =====================================================
   🔐 CONFIRM OTP LOGIN
===================================================== */
export const confirmMerchantOTP = async (confirmation, otp) => {
  try {
    const userCredential = await confirmation.confirm(otp);
    const user = userCredential.user;

    // 🔹 Look up Firestore using phone number instead of UID
    const merchantsRef = collection(db, "restaurants");
    const q = query(merchantsRef, where("contactNumber", "==", user.phoneNumber));
    const snapshot = await getDocs(q);

    console.log("📄 Firestore check:", snapshot.empty ? "Not Found" : "Found");

    if (snapshot.empty) {
      throw new Error("Account not found. Please sign up first.");
    }

    const userDoc = snapshot.docs[0];
    const data = userDoc.data();

    if (data.role !== "merchant") {
      throw new Error(`Unauthorized: role=${data.role}`);
    }

    // ✅ Save session under the Firestore doc ID (not the auth UID)
    await saveMerchantSession(userDoc.id);
    await updateMerchantFCMToken(userDoc.id);

    console.log("✅ Merchant login successful:", userDoc.id);
    return { uid: userDoc.id, role: data.role };
  } catch (err) {
    console.error("❌ OTP Confirmation Error:", err);
    throw new Error(err.message || "Invalid OTP or verification failed");
  }
};