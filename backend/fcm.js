// backend/updateMerchantFCMToken.js
import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  getToken,
  onTokenRefresh,
  requestPermission,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  deleteField,
} from "@react-native-firebase/firestore";

/**
 * 🔔 Save or Refresh FCM Token for Merchants (supports multiple devices)
 */
export const updateMerchantFCMToken = async (merchantUID) => {
  try {
    const app = getApp();
    const messaging = getMessaging(app);
    const db = getFirestore(app);

    // ✅ Ask for notification permission
    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log("❌ Notification permission denied");
      return;
    }

    // ✅ Get current FCM token (new modular syntax)
    const token = await getToken(messaging);
    console.log("✅ Current FCM Token:", token);

    const docRef = doc(db, "restaurants", merchantUID);
    const userDoc = await getDoc(docRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      let tokens = data.fcmTokens || [];

      // Prevent duplicates
      if (!tokens.includes(token)) {
        tokens.push(token);
      }

      // ✅ Update Firestore and delete old single token field
      await updateDoc(docRef, {
        fcmTokens: tokens,
        tokenUpdatedAt: new Date(),
        fcmToken: deleteField(),
      });
    } else {
      // Create document if it doesn’t exist
      await setDoc(docRef, {
        fcmTokens: [token],
        tokenUpdatedAt: new Date(),
      });
    }

    // ✅ Auto-refresh when token changes (new modular way)
    onTokenRefresh(messaging, async (newToken) => {
      console.log("🔄 FCM Token refreshed:", newToken);
      const refreshedDoc = await getDoc(docRef);
      const refreshedTokens = refreshedDoc.data()?.fcmTokens || [];

      if (!refreshedTokens.includes(newToken)) {
        refreshedTokens.push(newToken);
        await updateDoc(docRef, {
          fcmTokens: refreshedTokens,
          tokenUpdatedAt: new Date(),
        });
      }
    });
  } catch (error) {
    console.error("🔥 Error updating FCM token:", error);
  }
};
