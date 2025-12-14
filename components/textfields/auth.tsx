import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AuthInputField = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  showToggle = false,
  onToggleSecure,
}) => {
  return (
    <View style={styles.inputContainer}>
      {icon && <MaterialCommunityIcons name={icon} size={22} color="gray" style={styles.inputIcon} />}
      <TextInput
        placeholder={placeholder}
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="gray"
      />
      {showToggle && (
        <TouchableOpacity style={styles.eyeButton} onPress={onToggleSecure}>
          <MaterialCommunityIcons
            name={secureTextEntry ? 'eye-off' : 'eye'}
            size={22}
            color="gray"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    padding: 12,
    color: '#000',
  },
  eyeButton: {
    padding: 5,
  },
});

export default AuthInputField;
