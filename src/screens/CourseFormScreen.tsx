import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../providers/AuthProvider";
import { MeetingDay } from "../types";

export default function CourseFormScreen({ navigation }: any) {
  const user = useUser();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [meetingDays, setMeetingDays] = useState<MeetingDay[]>(["Mon", "Wed"]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const onSave = async () => {
    if (!user) return;
    await addDoc(collection(db, `users/${user.uid}/courses`), {
      name, code, instructorName, meetingDays, startTime, endTime
    });
    navigation.goBack();
  };

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>New Course</Text>
      <TextInput placeholder="Course name" value={name} onChangeText={setName} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
      <TextInput placeholder="Course code" value={code} onChangeText={setCode} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
      <TextInput placeholder="Instructor" value={instructorName} onChangeText={setInstructorName} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
      <TextInput placeholder="Meeting days (e.g., Mon,Tue)" value={meetingDays.join(",")} onChangeText={(t)=>setMeetingDays(t.split(",").map(s=>s.trim() as MeetingDay))} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
      <TextInput placeholder="Start time HH:mm" value={startTime} onChangeText={setStartTime} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
      <TextInput placeholder="End time HH:mm" value={endTime} onChangeText={setEndTime} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
      <Button title="Save" onPress={onSave} />
    </View>
  );
}
