import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const TextButton = ({ title, onPress, color = 'gray', style }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.text, { color }, style]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default TextButton;
