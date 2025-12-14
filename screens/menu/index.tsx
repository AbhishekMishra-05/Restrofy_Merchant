// screens/MenuScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { auth } from "../../firebaseConfig";
import {
  listenToCategories,
  listenToItems,
  addCategory,
  deleteCategory,
  addItem,
  deleteItem,
} from "../../backend/menu";

import CategoryModal from "../../components/modals/Category";
import ItemModal from "../../components/modals/Item";
import CategoryTabs from "../../components/cards/CategoryCard";
import ItemCard from "../../components/cards/ItemCard";

interface Category {
  id: string;
  name: string;
}

interface Item {
  id: string;
  name: string;
  price: number;
  description: string;
}

const MenuScreen: React.FC = () => {
  const uid = auth.currentUser?.uid;

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [itemModalVisible, setItemModalVisible] = useState(false);

  // ----------------------
  // LISTENERS
  // ----------------------
  useEffect(() => {
    if (!uid) return;
    const unsub = listenToCategories(uid, (cats) => {
      setCategories(cats);

      // Auto-select first category if none selected
      if (!selectedCategory && cats.length > 0) {
        setSelectedCategory(cats[0].id);
      }
    });
    return unsub;
  }, [uid]);

  useEffect(() => {
    if (!uid || !selectedCategory) {
      setItems([]);
      return;
    }
    const unsub = listenToItems(uid, selectedCategory, setItems);
    return unsub;
  }, [uid, selectedCategory]);

  // ----------------------
  // HANDLERS
  // ----------------------
  const handleSaveCategory = async (name: string) => {
    if (!uid) return;
    await addCategory(uid, name);
    setCategoryModalVisible(false);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (!uid) return;
    Alert.alert("Delete Category", `Delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteCategory(uid, id);
          if (selectedCategory === id) setSelectedCategory(null);
        },
      },
    ]);
  };

  const handleSaveItem = async (newItem: { name: string; price: number; description: string }) => {
    if (!uid || !selectedCategory) return;
    await addItem(uid, selectedCategory, newItem);
    setItemModalVisible(false);
  };

  const handleDeleteItem = (itemId: string, name: string) => {
    if (!uid || !selectedCategory) return;
    Alert.alert("Delete Item", `Delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteItem(uid, selectedCategory, itemId),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
        onAdd={() => setCategoryModalVisible(true)}
        onDelete={handleDeleteCategory}
      />

      {/* Divider */}
      <View style={styles.divider} />

      {/* Items List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemCard item={item} onDelete={handleDeleteItem} />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <View style={{ padding: 20 }}>
            <Text style={{ color: "#888", fontSize: 16 }}>
              No items in this category.
            </Text>
          </View>
        )}
      />

      {/* Add Item Button */}
      {selectedCategory && (
        <TouchableOpacity
          style={styles.addItemBtn}
          onPress={() => setItemModalVisible(true)}
        >
          <Text style={styles.addItemText}>
            + Add item in{" "}
            <Text style={{ fontWeight: "bold", textTransform: "capitalize" }}>
              {categories.find((cat) => cat.id === selectedCategory)?.name ||
                "this"}
            </Text>
          </Text>
        </TouchableOpacity>
      )}

      {/* Modals */}
      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onSave={handleSaveCategory}
      />
      <ItemModal
        visible={itemModalVisible}
        onClose={() => setItemModalVisible(false)}
        onSave={handleSaveItem}
      />
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 20 },
  addItemBtn: {
    position: "absolute",
    bottom: 60,
    right: 15,
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
    elevation: 6,
  },
  addItemText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    maxWidth: 200,
  },
  divider: {
    height: 10,
    backgroundColor: "#f3f3f3",
    marginVertical: 6,
  },
});
