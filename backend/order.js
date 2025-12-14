// backend/order.js
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Real-time listener for restaurant orders.
 * - callback receives array of orders
 * - errorCallback receives error if onSnapshot fails
 *
 * NOTE: This version intentionally does NOT use orderBy("createdAt")
 * because your documents appear to have createdAt as non-Timestamp/string.
 */
export const listenToRestaurantOrders = (restaurantId, callback, errorCallback) => {
  try {
    if (!restaurantId) {
      const err = new Error("listenToRestaurantOrders: missing restaurantId");
      console.error(err);
      if (errorCallback) errorCallback(err);
      return () => {};
    }

    const collectionRef = collection(db, "orders");
    const q = query(collectionRef, where("restaurantId", "==", restaurantId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        console.log("listenToRestaurantOrders -> snapshot size:", orders.length);
        callback(orders);
      },
      (err) => {
        console.error("listenToRestaurantOrders -> onSnapshot error:", err);
        if (errorCallback) errorCallback(err);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("listenToRestaurantOrders -> catch:", error);
    if (errorCallback) errorCallback && errorCallback(error);
    return () => {};
  }
};

/**
 * One-time fetch to verify DB contents (useful for debugging)
 */
export const fetchRestaurantOrdersOnce = async (restaurantId) => {
  try {
    if (!restaurantId) throw new Error("fetchRestaurantOrdersOnce: missing restaurantId");

    const collectionRef = collection(db, "orders");
    const q = query(collectionRef, where("restaurantId", "==", restaurantId));

    const snap = await getDocs(q);
    console.log("fetchRestaurantOrdersOnce -> docs:", snap.size);
    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return orders;
  } catch (error) {
    console.error("fetchRestaurantOrdersOnce -> error:", error);
    throw error;
  }
};

/**
 * Update order status (merchant actions).
 * Writes 'orderstatus' (lowercase) to match your DB.
 * Accepts optional extraFields to write additional metadata.
 */
export const updateOrderStatus = async (orderId, newStatus, extraFields = {}) => {
  try {
    if (!orderId) throw new Error("updateOrderStatus: missing orderId");
    const orderRef = doc(db, "orders", orderId);

    const snapshot = await getDoc(orderRef);
    if (!snapshot.exists()) {
      throw new Error("Order does not exist");
    }

    const payload = {
      orderstatus: newStatus, // <-- use lowercase key to match DB
      updatedAt: serverTimestamp(),
      ...extraFields,
    };

    await updateDoc(orderRef, payload);
    console.log(`updateOrderStatus -> Order ${orderId} updated to ${newStatus}`);
    return true;
  } catch (error) {
    console.error("updateOrderStatus -> error:", error);
    throw error;
  }
};
