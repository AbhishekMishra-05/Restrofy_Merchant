import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // ✅ Works in RN CLI

const CategoryTabs = ({
  categories,
  selectedCategory,
  onSelect,
  onAdd,
  onDelete,
}) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            onLongPress={() => onDelete(cat.id, cat.name)}
            style={[
              styles.categoryChip,
              selectedCategory === cat.id && styles.activeChip,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat.id && styles.activeText,
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Add Category Button */}
        <TouchableOpacity onPress={onAdd} style={styles.addChip}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CategoryTabs;

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  scrollContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryChip: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    elevation: 2,
  },
  activeChip: {
    backgroundColor: "#2e7d32",
  },
  categoryText: {
    color: "#333",
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
  addChip: {
    backgroundColor: "#2e7d32",
    padding: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
});
