import React from "react";
import { View, StyleSheet } from "react-native";

const NonVegIcon = ({ size = 20 }) => {
  return (
    <View
      style={[
        styles.square,
        { width: size, height: size, borderColor: "red" },
      ]}
    >
      <View
        style={[
          styles.circle,
          {
            width: size / 2,
            height: size / 2,
            borderRadius: size / 4,
            backgroundColor: "red",
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  square: {
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {},
});

export default NonVegIcon;
