import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { BlurView } from "@react-native-community/blur";

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (categoryName: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ visible, onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState("");

  const handleSave = () => {
    if (categoryName.trim() !== "") {
      onSave(categoryName);
      setCategoryName("");
    }
    onClose();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Blur background */}
      <View style={styles.fullscreen}>
        <BlurView
          style={styles.blurBackground}
          blurType={Platform.OS === "ios" ? "light" : "dark"} // iOS/Android styles differ
          blurAmount={10}
          reducedTransparencyFallbackColor="rgba(0,0,0,0.5)"
        />
        <View style={styles.centered}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>Add Category</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter category name"
              value={categoryName}
              onChangeText={setCategoryName}
            />

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={onClose}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CategoryModal;

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff", // changed to white
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#e2dadaff",
    shadowOpacity: 0.2,
    shadowRadius: 6,
},

  
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  closeButton: { backgroundColor: "#eee" },
  saveButton: { backgroundColor: "#4CAF50" },
  closeText: { fontSize: 16, color: "#333", fontWeight: "600" },
  saveText: { fontSize: 16, color: "#fff", fontWeight: "600" },
});
