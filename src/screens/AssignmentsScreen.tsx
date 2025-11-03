import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useUser } from "../providers/AuthProvider";
import { db } from "../firebase";
import { format } from "date-fns";

export default function AssignmentsScreen({ route, navigation }: any) {
  const user = useUser();
  const { courseId, courseName } = route.params || {};
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    if (!user || !courseId) return;
    const q = query(collection(db, `users/${user.uid}/courses/${courseId}/assignments`), orderBy("dueAt"));
    const unsub = onSnapshot(q, (snap) => setAssignments(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))));
    return () => unsub();
  }, [user, courseId]);

  return (
    <View style={{ padding: 16, gap: 8, flex: 1 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>{courseName || "Assignments"}</Text>
      <Button title="Add assignment" onPress={() => navigation.navigate("EditAssignment", { courseId })} />
      <FlatList
        data={assignments}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderWidth: 1, borderRadius: 8, marginVertical: 6 }}>
            <Text style={{ fontWeight: "700" }}>{item.title}</Text>
            <Text>Due: {format(new Date(item.dueAt), "MMM d, yyyy HH:mm")}</Text>
            {item.pointsPossible ? (
              <Text>Score: {item.pointsEarned ?? 0}/{item.pointsPossible}</Text>
            ) : null}
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}
