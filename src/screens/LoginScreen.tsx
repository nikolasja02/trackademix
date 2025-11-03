import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const onLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>Trackademix</Text>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 8, borderRadius: 8 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 8, borderRadius: 8 }}
      />
      {err && <Text style={{ color: "red" }}>{err}</Text>}
      <Button title="Log in" onPress={onLogin} />
      <Button title="Create account" onPress={() => (navigation as any).navigate("Signup")} />
    </View>
  );
}
