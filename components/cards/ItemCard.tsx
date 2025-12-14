import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  item: {
    id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
    veg?: boolean;
  };
  onDelete: (id: string, name: string) => void;
};

const ItemCard = ({ item, onDelete }: Props) => (
  <TouchableOpacity
    onLongPress={() => onDelete(item.id, item.name)}
    delayLongPress={600}
    activeOpacity={0.8}
  >
    <View style={styles.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>🍽️</Text>
        </View>
      )}

      <View style={styles.info}>
        <View style={styles.row}>
          <View
            style={[
              styles.dot,
              { backgroundColor: item.veg ? "#4CAF50" : "#E53935" },
            ]}
          />
          <Text style={styles.name}>{item.name}</Text>
        </View>

        <Text style={styles.price}>₹ {item.price}</Text>

        {item.description ? (
          <Text style={styles.desc} numberOfLines={2}>
            {item.description}
          </Text>
        ) : (
          <Text style={styles.descMuted}>No description</Text>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

export default ItemCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fefefeff",
    borderRadius: 16,
    padding: 14,
    borderColor: "#48073fff",
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#39043dff",
    shadowOpacity: 0.45,
    shadowOffset: { width: 2, height: 5 },
    shadowRadius: 10,
    elevation: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 14,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  placeholderText: { fontSize: 24 },
  info: { flex: 1 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  name: { fontSize: 16, fontWeight: "600", color: "#0a0909ff" },
  price: {
    fontSize: 14,
    color: "#046e18ff",
    fontWeight: "700",
    marginTop: 2,
  },
  desc: {
    fontSize: 12,
    color: "#101010ff",
    marginTop: 6,
  },
  descMuted: {
    fontSize: 12,
    color: "#777",
    marginTop: 6,
  },
});
