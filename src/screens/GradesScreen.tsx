import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Button, FlatList, TextInput } from "react-native";
import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useUser } from "../providers/AuthProvider";
import { db } from "../firebase";
import { GradeCategory } from "../types";
import { weightedAverage } from "../utils/grades";

export default function GradesScreen({ route }: any) {
  const user = useUser();
  const { courseId, courseName } = route.params || {};
  const [cats, setCats] = useState<GradeCategory[]>([]);
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [earned, setEarned] = useState("");
  const [possible, setPossible] = useState("");

  useEffect(() => {
    if (!user || !courseId) return;
    const q = query(collection(db, `users/${user.uid}/courses/${courseId}/gradeCategories`), orderBy("name"));
    const unsub = onSnapshot(q, (snap) => setCats(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))));
    return () => unsub();
  }, [user, courseId]);

  const avg = useMemo(() => weightedAverage(cats), [cats]);

  const addCategory = async () => {
    if (!user || !courseId) return;
    await addDoc(collection(db, `users/${user.uid}/courses/${courseId}/gradeCategories`), {
      name,
      weightPct: Number(weight),
      earned: Number(earned),
      possible: Number(possible)
    });
    setName(""); setWeight(""); setEarned(""); setPossible("");
  };

  return (
    <View style={{ padding: 16, gap: 8, flex: 1 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>{courseName || "Grades"}</Text>
      <Text style={{ fontSize: 16 }}>Current average: {avg.toFixed(1)}%</Text>

      <View style={{ gap: 6, marginVertical: 8 }}>
        <TextInput placeholder="Category name" value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
        <TextInput placeholder="Weight %" keyboardType="numeric" value={weight} onChangeText={setWeight} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
        <TextInput placeholder="Earned" keyboardType="numeric" value={earned} onChangeText={setEarned} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
        <TextInput placeholder="Possible" keyboardType="numeric" value={possible} onChangeText={setPossible} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
        <Button title="Add category" onPress={addCategory} />
      </View>

      <FlatList
        data={cats}
        keyExtractor={(i) => i.id!}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderWidth: 1, borderRadius: 8, marginVertical: 6 }}>
            <Text style={{ fontWeight: "700" }}>{item.name} — {item.weightPct}%</Text>
            <Text>{item.earned}/{item.possible} pts</Text>
          </View>
        )}
      />
    </View>
  );
}