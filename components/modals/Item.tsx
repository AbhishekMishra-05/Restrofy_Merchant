import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Image,
  Alert,
  ActivityIndicator,
  ActionSheetIOS,
  Platform,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { uploadImageToR2 } from "../../backend/r2img";

interface ItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (item: {
    name: string;
    price: number;
    description: string;
    veg: boolean;
    image?: string;
  }) => Promise<void>;
}

const ItemModal: React.FC<ItemModalProps> = ({ visible, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [veg, setVeg] = useState(true);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleImagePick = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take Photo", "Choose from Gallery"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) pickImage(true);
          if (buttonIndex === 2) pickImage(false);
        }
      );
    } else {
      Alert.alert("Select Image", "Choose an option", [
        { text: "Cancel", style: "cancel" },
        { text: "Take Photo", onPress: () => pickImage(true) },
        { text: "Choose from Gallery", onPress: () => pickImage(false) },
      ]);
    }
  };


  const pickImage = async (fromCamera = false) => {
    const result = fromCamera
      ? await launchCamera({ mediaType: "photo" })
      : await launchImageLibrary({ mediaType: "photo" });

    if (!result.didCancel && result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

const handleSave = async () => {
  if (!name.trim() || !price.trim()) {
    Alert.alert("Missing Fields", "Please enter name and price.");
    return;
  }

  try {
    setLoading(true);

    let imageUrl: string | null = null;

    // Upload if local image chosen
    if (image && !image.startsWith("http")) {
      imageUrl = await uploadImageToR2(image);
      if (!imageUrl) {
        throw new Error("Upload failed");
      }
    } else if (image) {
      imageUrl = image; // already a URL
    }

    // Build item object (skip image if null)
    const newItem: any = {
      name,
      price: parseFloat(price),
      description,
      veg,
    };

    if (imageUrl) {
      newItem.image = imageUrl;
    }

    // Save to Firestore
    await onSave(newItem);

    // Reset
    setName("");
    setPrice("");
    setDescription("");
    setVeg(true);
    setImage(undefined);
    onClose();
  } catch (err) {
    console.error("Save error:", err);
    Alert.alert("Error", "Could not save item. Try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Add Food Item</Text>

          {/* Photo */}
          <TouchableOpacity style={styles.photoBtn} onPress={handleImagePick}>
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <Ionicons name="camera-outline" size={50} color="#666" />
            )}
            <Text style={styles.photoText}>
              {image ? "Tap to change photo" : "Add Photo"}
            </Text>
          </TouchableOpacity>

          {/* Fields */}
          <TextInput
            placeholder="Item Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Price"
            style={styles.input}
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <TextInput
            placeholder="Description"
            style={[styles.input, { height: 80 }]}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {veg ? "Vegetarian" : "Non-Vegetarian"}
            </Text>
            <Switch value={veg} onValueChange={setVeg} />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                if (!loading) onClose();
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveBtn, loading && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ItemModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(245, 243, 243, 0.5)",
  },
  container: {
    width: "85%",
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  photoBtn: {
    alignItems: "center",
    marginBottom: 15,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  photoText: {
    fontSize: 12,
    color: "#666",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  cancelBtn: {
    marginRight: 15,
  },
  cancelText: {
    fontSize: 16,
    color: "#555",
  },
  saveBtn: {
    backgroundColor: "#2e7d32",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
  },
});
