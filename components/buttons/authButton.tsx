import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AuthButton = ({ title, onPress, color = '#8b005d', textColor = '#fff' }) => {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 5,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AuthButton;
