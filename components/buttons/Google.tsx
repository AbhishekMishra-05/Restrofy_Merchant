import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const GoogleButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.googleButton} onPress={onPress}>
      <Text style={styles.googleText}>Continue With Google</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  googleText: {
    color: 'gray',
    fontWeight: 'bold',
  },
});

export default GoogleButton;
