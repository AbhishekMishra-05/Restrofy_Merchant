// components/AddButton.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const AddButton = ({ onAdd, onRemove }) => {
  const [count, setCount] = useState(0);

  const handleAdd = () => {
    const newCount = count + 1;
    setCount(newCount);
    if (onAdd) onAdd(newCount);
  };

  const handleRemove = () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      if (onRemove) onRemove(newCount);
    }
  };

  if (count === 0) {
    // Show "Add Item" state
    return (
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <View style={styles.plusBox}>
          <Text style={styles.plus}>+</Text>
        </View>
        <Text style={styles.addText}>ADD ITEM</Text>
      </TouchableOpacity>
    );
  }

  // Show Counter state
  return (
    <View style={styles.counterContainer}>
      <TouchableOpacity style={styles.counterBtn} onPress={handleRemove}>
        <Text style={styles.counterText}>-</Text>
      </TouchableOpacity>

      <Text style={styles.count}>{count}</Text>

      <TouchableOpacity style={styles.counterBtn} onPress={handleAdd}>
        <Text style={styles.counterText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red",
    borderRadius: 6,
    overflow: "hidden",
  },
  plusBox: {
    backgroundColor: "#2d2d39",
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  plus: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addText: {
    color: "#fff",
    paddingHorizontal: 10,
    fontWeight: "bold",
    fontSize: 14,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  counterBtn: {
    backgroundColor: "#2d2d39",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  counterText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  count: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
});

export default AddButton;
