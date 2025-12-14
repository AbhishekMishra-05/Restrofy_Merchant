// MerchantHomeScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { listenToRestaurantOrders, fetchRestaurantOrdersOnce, updateOrderStatus } from "../../backend/order";
import { PieChart as DonutChart } from "react-native-gifted-charts";
import Ionicons from "react-native-vector-icons/Ionicons";

const COLORS = {
  primary: "#ff7b00",
  background: "#f8fafc",
  cardBackground: "#ffffff",
  textPrimary: "#1e293b",
  textSecondary: "#64748b",
  success: "#16a34a",
  warning: "#facc15",
  error: "#ef4444",
  activeCard: "#fff4e5",
  border: "#e2e8f0",
  shadow: "rgba(0,0,0,0.12)",
};

// Helper: Darken color hex by factor (0..1), returns 'rgb(r,g,b)'
function darkenColor(hex: string, factor = 0.85) {
  const c = hex.replace("#", "");
  const num = parseInt(c, 16);
  const r = Math.max(0, Math.min(255, Math.round(((num >> 16) & 0xff) * factor)));
  const g = Math.max(0, Math.min(255, Math.round(((num >> 8) & 0xff) * factor)));
  const b = Math.max(0, Math.min(255, Math.round((num & 0xff) * factor)));
  return `rgb(${r}, ${g}, ${b})`;
}

function capitalize(s: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function Dashboard({
  orders,
  filter,
  onFilterSelect,
}: {
  orders: any[];
  filter: string;
  onFilterSelect: (filter: string) => void;
}) {
  const safeStatus = (s: any) => (s || "").toString().toLowerCase();

  const newOrdersCount = orders.filter((o) => ["pending", "new"].includes(safeStatus(o.orderstatus))).length;
  const preparingOrdersCount = orders.filter((o) => ["accepted", "preparing"].includes(safeStatus(o.orderstatus))).length;
  const completedOrdersCount = orders.filter((o) => safeStatus(o.orderstatus) === "completed").length;

  const totalOrders = newOrdersCount + preparingOrdersCount + completedOrdersCount;

  const slices = [
    { key: "new", label: "New Orders", value: newOrdersCount, color: "#fb923c" },
    { key: "preparing", label: "Preparing", value: preparingOrdersCount, color: "#fde047" },
    { key: "completed", label: "Completed", value: completedOrdersCount, color: "#22c55e" },
  ];

  // Animated values created once
  const animRefs = useRef(slices.map(() => new Animated.Value(1)));
  if (animRefs.current.length !== slices.length) {
    animRefs.current = slices.map((_, i) => animRefs.current[i] || new Animated.Value(1));
  }

  const focusedIndex = slices.findIndex((s) => s.label === filter);
  useEffect(() => {
    Animated.parallel(
      animRefs.current.map((av, i) =>
        Animated.spring(av, {
          toValue: i === focusedIndex ? 1.06 : 1,
          friction: 6,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [focusedIndex]);

  const chartData = slices.map((slice, index) => ({
    value: slice.value,
    color: index === focusedIndex ? darkenColor(slice.color, 0.78) : slice.color,
    label: slice.label,
    onPress: () => onFilterSelect(slice.label),
  }));

  return (
    <View style={{ marginVertical: 8 }}>
      <View style={styles.donutRow}>
        <View style={styles.donutLeft}>
          <DonutChart
            data={chartData.map((slice) => ({ ...slice }))}
            donut
            radius={85}
            innerRadius={55}
            strokeWidth={10}
            showGradient
            animationDuration={700}
            backgroundColor="transparent"
            innerCircleColor="#fff"
            focusOnPress
            sectionAutoFocus
            centerLabelComponent={() => (
              <View style={{ alignItems: "center" }}>
                <Text style={styles.donutText}>{totalOrders}</Text>
                <Text style={styles.donutSubText}>Total Orders</Text>
              </View>
            )}
          />
        </View>

        <View style={styles.legendContainer}>
          {slices.map((item, index) => (
            <TouchableOpacity
              key={item.key}
              style={styles.legendItem}
              onPress={() => onFilterSelect(item.label)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: index === focusedIndex ? darkenColor(item.color, 0.78) : item.color },
                ]}
              />
              <Text style={[styles.legendText, index === focusedIndex && { fontWeight: "bold" }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.dashboardRow}>
        {slices.map((item, index) => {
          const isActive = filter === item.label;
          return (
            <Animated.View
              key={item.key}
              style={[
                styles.dashboardCard,
                { borderTopColor: item.color, transform: [{ scale: animRefs.current[index] }] },
                isActive && { backgroundColor: COLORS.activeCard, borderWidth: 1, borderColor: item.color },
              ]}
            >
              <TouchableOpacity activeOpacity={0.8} onPress={() => onFilterSelect(item.label)} style={{ alignItems: "center" }}>
                <Ionicons
                  name={item.label === "Preparing" ? "time" : item.label === "Completed" ? "checkmark-done" : "notifications"}
                  size={22}
                  color={item.color}
                />
                <Text style={styles.dashboardLabel}>{item.label}</Text>
                <Text style={[styles.dashboardValue, { color: item.color }]}>{item.value}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

export default function MerchantHomeScreen() {
  const navigation = useNavigation();
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Load merchant UID
  useEffect(() => {
    const loadMerchant = async () => {
      try {
        const uid = await AsyncStorage.getItem("merchantUID");
        if (uid) {
          setRestaurantId(uid);
        } else {
          Alert.alert("Error", "Restaurant not found. Please log in again.");
          // navigation.replace typed bypass
          // @ts-ignore
          navigation.replace && navigation.replace("Login");
        }
      } catch (err) {
        console.error("loadMerchant error:", err);
      }
    };
    loadMerchant();
  }, [navigation]);

  // Real-time listener with error handling
  useEffect(() => {
    if (!restaurantId) return;

    console.log("[MerchantHome] starting listener for:", restaurantId);
    setLoading(true);

    const unsubscribe = listenToRestaurantOrders(
      restaurantId,
      (data) => {
        console.log("[MerchantHome] onSnapshot returned:", data.length);
        setOrders(data);
        setLoading(false);
      },
      (err) => {
        console.error("[MerchantHome] listener error:", err);
        Alert.alert("Error", "Failed to fetch orders: " + (err?.message || err));
        setLoading(false);
      }
    );

    return () => {
      console.log("[MerchantHome] unsubscribing listener");
      unsubscribe && unsubscribe();
    };
  }, [restaurantId]);

  // Optional: debug-only one-time fetch to confirm DB contents
  useEffect(() => {
    if (!restaurantId) return;
    (async () => {
      try {
        const oneTime = await fetchRestaurantOrdersOnce(restaurantId);
        console.log("[MerchantHome] fetchRestaurantOrdersOnce ->", oneTime.length, "orders");
      } catch (err) {
        console.error("[MerchantHome] fetchOnce error:", err);
      }
    })();
  }, [restaurantId]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const prevOrders = orders;
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, orderstatus: newStatus } : o)));

    try {
      await updateOrderStatus(id, newStatus);
      Alert.alert("Success", `Order marked as ${newStatus}`);
    } catch (err) {
      console.error("handleStatusChange error:", err);
      // revert optimistic update
      setOrders(prevOrders);
      Alert.alert("Error", "Failed to update order status.");
    }
  };

  const filteredOrders =
    filter === "New Orders"
      ? orders.filter((o) => ["pending", "new"].includes(((o.orderstatus || "").toLowerCase())))
      : filter === "Preparing"
      ? orders.filter((o) => ["accepted", "preparing"].includes(((o.orderstatus || "").toLowerCase())))
      : filter === "Completed"
      ? orders.filter((o) => (o.orderstatus || "").toLowerCase() === "completed")
      : orders;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Fetching orders...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subTitle}>Manage and track your restaurant’s orders</Text>
      </View>

      <Dashboard orders={orders} filter={filter} onFilterSelect={setFilter} />

      <View>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((item) => {
            const status = (item.orderstatus || "").toLowerCase();
            const getStatusColor = () => {
              if (status === "completed") return COLORS.success;
              if (["accepted", "preparing"].includes(status)) return COLORS.warning;
              if (["pending", "new"].includes(status)) return COLORS.warning;
              if (status === "rejected") return COLORS.error;
              return COLORS.textSecondary;
            };

            return (
              <View key={item.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>#{item.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
                    <Text style={styles.statusText}>{capitalize(item.orderstatus)}</Text>
                  </View>
                </View>

                <Text style={styles.orderText}>Items: {item.cart?.length || 0}</Text>
                <Text style={styles.orderText}>Total: ₹{item.total}</Text>
                <Text style={styles.orderText}>User ID: {item.userId}</Text>

                <View style={styles.actionsRow}>
                  {(status === "pending" || status === "new") && (
                    <>
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: COLORS.success }]}
                        onPress={() => handleStatusChange(item.id, "Accepted")}
                      >
                        <Text style={styles.actionBtnText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: COLORS.error }]}
                        onPress={() => handleStatusChange(item.id, "Rejected")}
                      >
                        <Text style={styles.actionBtnText}>Reject</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {(status === "accepted" || status === "preparing") && (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: COLORS.primary }]}
                      onPress={() => handleStatusChange(item.id, "Completed")}
                    >
                      <Text style={styles.actionBtnText}>Mark Complete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={40} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No orders found for this category.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: { fontSize: 26, fontWeight: "bold", color: COLORS.textPrimary },
  subTitle: { color: COLORS.textSecondary, marginTop: 4 },

  donutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  donutLeft: {
    flex: 1.2,
    alignItems: "center",
    justifyContent: "center",
  },
  legendContainer: {
    flex: 1,
    paddingRight: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  legendText: {
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  donutText: { fontSize: 20, fontWeight: "bold", color: COLORS.textPrimary },
  donutSubText: { fontSize: 12, color: COLORS.textSecondary },

  dashboardRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 6,
    marginTop: 12,
  },
  dashboardCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginVertical: 8,
    width: "28%",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderTopWidth: 3,
  },
  dashboardLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 6, textAlign: "center" },
  dashboardValue: { fontSize: 18, fontWeight: "bold", marginTop: 4 },

  orderCard: {
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 14,
    padding: 14,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderId: { fontSize: 16, fontWeight: "bold", color: COLORS.textPrimary },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  orderText: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  actionsRow: { flexDirection: "row", marginTop: 12, justifyContent: "flex-end" },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginLeft: 8 },
  actionBtnText: { color: "#fff", fontWeight: "bold" },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 8, color: COLORS.textSecondary },
  emptyContainer: { alignItems: "center", marginTop: 48 },
  emptyText: { color: COLORS.textSecondary, fontSize: 16, marginTop: 8 },
});
