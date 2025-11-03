import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../providers/AuthProvider";
import { Course } from "../types";

export default function CoursesScreen({ navigation }: any) {
  const user = useUser();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/courses`), orderBy("name"));
    const unsub = onSnapshot(q, (snap) => {
      setCourses(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });
    return () => unsub();
  }, [user]);

  return (
    <View style={{ padding: 16, gap: 8, flex: 1 }}>
      <Button title="Add course" onPress={() => navigation.navigate("EditCourse")}/>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderWidth: 1, borderRadius: 8, marginVertical: 6 }}>
            <Text style={{ fontWeight: "700" }}>{item.code} — {item.name}</Text>
            <Text>{item.meetingDays?.join(", ")} {item.startTime}-{item.endTime}</Text>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
              <Button title="Assignments" onPress={() => navigation.navigate("Assignments", { courseId: item.id, courseName: item.name })} />
              <Button title="Grades" onPress={() => navigation.navigate("Grades", { courseId: item.id, courseName: item.name })} />
            </View>
          </View>
        )}
      />
    </View>
  );
}