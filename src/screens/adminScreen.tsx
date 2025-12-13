import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { saveAnnouncement } from "../storage/announcementStorage";

export default function AdminScreen() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert("Error", "Both fields are required");
      return;
    }

    try {
      setLoading(true);

      await saveAnnouncement({
        title: title.trim(),
        message: message.trim(),
        timestamp: Date.now(),
      });

      setTitle("");
      setMessage("");
      Alert.alert("Saved", "Announcement updated!");
    } catch (e) {
      Alert.alert("Error", "Failed to save announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>Admin</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 8, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
        multiline
        style={{ borderWidth: 1, padding: 8, borderRadius: 8, minHeight: 100 }}
      />

      <Button
        title={loading ? "Saving..." : "Submit"}
        onPress={onSubmit}
        disabled={loading}
      />
    </View>
  );
}
