// components/buttons/AddCategoryButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

interface AddCategoryButtonProps {
  onPress: () => void;
  title?: string;
  style?: ViewStyle;
}

const AddCategoryButton: React.FC<AddCategoryButtonProps> = ({
  onPress,
  title = "➕ Add Category",
  style,
}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "90%",          // takes most of the screen width
    height: 70,            // large rectangle
    backgroundColor: "#4CAF50", // green theme (change if needed)
    borderRadius: 30,      // rounded rectangle
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 10,
    elevation: 4,          // shadow for Android
    shadowColor: "#000",   // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default AddCategoryButton;
