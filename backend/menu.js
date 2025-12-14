import { db } from "../firebaseConfig";
import { collection, addDoc, deleteDoc, doc, onSnapshot, getDocs, query, where } from "firebase/firestore";

// ----------------------
// LISTENERS
// ----------------------
export const listenToCategories = (uid, setCategories) => {
  return onSnapshot(collection(db, "restaurants", uid, "categories"), (snap) => {
    // Ensure categories are unique by name
    const seen = new Set();
    const data = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((cat) => {
        if (seen.has(cat.name)) return false;
        seen.add(cat.name);
        return true;
      });
    setCategories(data);
  });
};

export const listenToItems = (uid, categoryId, setItems) => {
  return onSnapshot(
    collection(db, "restaurants", uid, "categories", categoryId, "items"),
    (snap) => {
      // Ensure items are unique by name
      const seen = new Set();
      const data = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => {
          if (seen.has(item.name)) return false;
          seen.add(item.name);
          return true;
        });
      setItems(data);
    }
  );
};

// ----------------------
// CATEGORY HANDLERS
// ----------------------
export const addCategory = async (uid, name) => {
  if (!name.trim()) return;

  // Prevent duplicate categories
  const catQuery = query(
    collection(db, "restaurants", uid, "categories"),
    where("name", "==", name)
  );
  const catSnap = await getDocs(catQuery);
  if (!catSnap.empty) return; // Already exists

  await addDoc(collection(db, "restaurants", uid, "categories"), { name });
};

export const deleteCategory = async (uid, categoryId) => {
  await deleteDoc(doc(db, "restaurants", uid, "categories", categoryId));
};

// ----------------------
// ITEM HANDLERS
// ----------------------
export const addItem = async (uid, categoryId, item) => {
  const itemsRef = collection(db, "restaurants", uid, "categories", categoryId, "items");

  // Prevent duplicate items
  const existingItemsSnap = await getDocs(itemsRef);
  const existingItems = existingItemsSnap.docs.map((d) => d.data().name);
  if (existingItems.includes(item.name)) return;

  await addDoc(itemsRef, item);
};

export const deleteItem = async (uid, categoryId, itemId) => {
  await deleteDoc(doc(db, "restaurants", uid, "categories", categoryId, "items", itemId));
};

// ----------------------
// SAFE SAMPLE MENU
// ----------------------
export const loadSampleMenu = async (uid) => {
  if (!uid) return;

  const sampleMenu = [
    {
      name: "Starters",
      items: [
        { name: "Paneer Tikka", price: 180, description: "Marinated cottage cheese grilled with spices" },
        { name: "Chicken 65", price: 200, description: "Spicy deep-fried chicken bites" },
      ],
    },
    {
      name: "Main Course",
      items: [
        { name: "Butter Chicken", price: 250, description: "Creamy tomato-based curry with chicken" },
        { name: "Veg Biryani", price: 220, description: "Fragrant rice with vegetables and spices" },
      ],
    },
    {
      name: "Desserts",
      items: [
        { name: "Gulab Jamun", price: 100, description: "Soft syrupy dumplings" },
        { name: "Ice Cream", price: 120, description: "Vanilla or chocolate scoop" },
      ],
    },
    {
      name: "Beverages",
      items: [
        { name: "Masala Chai", price: 50, description: "Indian-style spiced tea" },
        { name: "Cold Coffee", price: 120, description: "Iced coffee with milk and sugar" },
      ],
    },
  ];

  try {
    for (const cat of sampleMenu) {
      // Check if category already exists
      const catQuery = query(
        collection(db, "restaurants", uid, "categories"),
        where("name", "==", cat.name)
      );
      const catSnap = await getDocs(catQuery);

      let catRefId;
      if (catSnap.empty) {
        const docRef = await addDoc(collection(db, "restaurants", uid, "categories"), { name: cat.name });
        catRefId = docRef.id;
      } else {
        catRefId = catSnap.docs[0].id;
      }

      // Add items if they don't exist
      const itemsRef = collection(db, "restaurants", uid, "categories", catRefId, "items");
      const existingItemsSnap = await getDocs(itemsRef);
      const existingItems = existingItemsSnap.docs.map((d) => d.data().name);

      for (const item of cat.items) {
        if (!existingItems.includes(item.name)) {
          await addDoc(itemsRef, item);
        }
      }
    }

    console.log("Sample menu loaded safely without duplicates!");
  } catch (err) {
    console.error("Failed to load sample menu:", err);
  }
};
