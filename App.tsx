// App.tsx
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "./src/providers/AuthProvider";
import RootNavigator from "./src/navigation";

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <RootNavigator />
        <StatusBar style="auto" />
      </SafeAreaView>
    </AuthProvider>
  );
}
