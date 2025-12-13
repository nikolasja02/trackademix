import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AdminSettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Settings</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
      <Text style={styles.description}>
        This feature will allow admins to configure system settings like tutoring banner threshold and visibility.
      </Text>
      <Text style={styles.todo}>
        TODO: Implement toggle for tutoring banner and numeric input for grade threshold.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    color: '#7F8C8D',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  todo: {
    fontSize: 14,
    color: '#95A5A6',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});