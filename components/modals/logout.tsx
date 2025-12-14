// components/LogoutModal.tsx
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface LogoutModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Logout</Text>
          <Text style={styles.message}>Are you sure you want to log out?</Text>

          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.confirm]} onPress={onConfirm}>
              <Text style={styles.confirmText}>Yes, Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "80%",
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#E53935",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancel: {
    backgroundColor: "#ddd",
  },
  confirm: {
    backgroundColor: "#E53935",
  },
  cancelText: {
    color: "#333",
    fontWeight: "600",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});
