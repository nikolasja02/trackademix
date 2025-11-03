import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useUser } from "../providers/AuthProvider";
import { db } from "../firebase";

export default function ProfileScreen() {
  const user = useUser();
  const [displayName, setDisplayName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [xHandle, setXHandle] = useState("");
  const [discord, setDiscord] = useState("");

  useEffect(() => {
    (async () => {
      if (!user) return;
      const ref = doc(db, `users/${user.uid}`);
      const snap = await getDoc(ref);
      const data = snap.data();
      if (data) {
        setDisplayName(data.displayName || "");
        setInstagram(data.instagram || "");
        setXHandle(data.xHandle || "");
        setDiscord(data.discord || "");
      }
    })();
  }, [user]);

  const onSave = async () => {
    if (!user) return;
    await setDoc(doc(db, `users/${user.uid}`), {
      displayName, instagram, xHandle, discord
    }, { merge: true });
  };

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Profile</Text>
      <TextInput placeholder="Display name" value={displayName} onChangeText={setDisplayName} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
      <TextInput placeholder="Instagram (e.g., @yourname)" value={instagram} onChangeText={setInstagram} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
      <TextInput placeholder="X / Twitter (e.g., @yourname)" value={xHandle} onChangeText={setXHandle} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
      <TextInput placeholder="Discord (e.g., user#1234)" value={discord} onChangeText={setDiscord} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
      <Button title="Save" onPress={onSave} />
    </View>
  );
}
