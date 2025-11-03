import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { useUser } from "../providers/AuthProvider";
import { db } from "../firebase";

export default function AssignmentFormScreen({ route, navigation }: any) {
  const user = useUser();
  const { courseId } = route.params;

  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState(""); // ISO or "YYYY-MM-DD HH:mm"
  const [pointsEarned, setPointsEarned] = useState("");
  const [pointsPossible, setPointsPossible] = useState("");

  const onSave = async () => {
    if (!user) return;
    const due = new Date(dueAt).getTime();
    await addDoc(collection(db, `users/${user.uid}/courses/${courseId}/assignments`), {
      title,
      dueAt: due,
      status: "todo",
      pointsEarned: pointsEarned ? Number(pointsEarned) : null,
      pointsPossible: pointsPossible ? Number(pointsPossible) : null,
    });
    navigation.goBack();
  };

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Assignment</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
      <TextInput placeholder="Due (YYYY-MM-DD HH:mm)" value={dueAt} onChangeText={setDueAt} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
      <TextInput placeholder="Points earned (optional)" keyboardType="numeric" value={pointsEarned} onChangeText={setPointsEarned} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
      <TextInput placeholder="Points possible (optional)" keyboardType="numeric" value={pointsPossible} onChangeText={setPointsPossible} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
      <Button title="Save" onPress={onSave} />
    </View>
  );
}