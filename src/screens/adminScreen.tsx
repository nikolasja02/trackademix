import { useState } from "react";
import { View, Text, Button, Alert, TextInput } from "react-native";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useUser } from "../providers/AuthProvider";
import { saveAnnouncement } from "../storage/announcementStorage";


export default function AdminScreen() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
const user = useUser();

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

    const seedDemoData = async () => {
    try {
      if (!user) return;
      
      // COURSE 1: Mobile Dev Advanced (existing course)
      const courseRef = await addDoc(collection(db, `users/${user.uid}/courses`), {
        name: "Mobile Dev Advanced",
        code: "INFO-5126",
        instructorName: "Prof. Oak",
        meetingDays: ["Mon", "Wed"],
        startTime: "10:00",
        endTime: "11:30",
        createdAt: serverTimestamp(),
      });
      
      const now = Date.now();
      await addDoc(collection(db, `users/${user.uid}/courses/${courseRef.id}/assignments`), {
        title: "Quiz 3",
        dueAt: now + 2 * 24 * 60 * 60 * 1000,
        status: "todo",
        pointsEarned: 7,
        pointsPossible: 10,
      });
      
      await addDoc(collection(db, `users/${user.uid}/courses/${courseRef.id}/assignments`), {
        title: "Project Milestone",
        dueAt: now + 10 * 24 * 60 * 60 * 1000,
        status: "todo",
      });
      
      await addDoc(collection(db, `users/${user.uid}/courses/${courseRef.id}/gradeCategories`), {
        name: "Assignments", weightPct: 30, earned: 24, possible: 40,
      });
      
      await addDoc(collection(db, `users/${user.uid}/courses/${courseRef.id}/gradeCategories`), {
        name: "Midterm", weightPct: 30, earned: 18, possible: 30,
      });
      
      await addDoc(collection(db, `users/${user.uid}/courses/${courseRef.id}/gradeCategories`), {
        name: "Final", weightPct: 40, earned: 0, possible: 0,
      });
      
      // ADD GRADES FOR COURSE 1 (LOW GRADES - will be flagged)
      await addDoc(collection(db, `users/${user.uid}/grades`), {
        course: "Mobile Dev Advanced",
        grade: 65,
        createdAt: serverTimestamp(),
      });
      
      await addDoc(collection(db, `users/${user.uid}/grades`), {
        course: "Mobile Dev Advanced",
        grade: 58,
        createdAt: serverTimestamp(),
      });
      
      // COURSE 2: Data Structures (high grades)
      const courseRef2 = await addDoc(collection(db, `users/${user.uid}/courses`), {
        name: "Data Structures",
        code: "CS-2420",
        instructorName: "Prof. Smith",
        meetingDays: ["Tue", "Thu"],
        startTime: "14:00",
        endTime: "15:30",
        createdAt: serverTimestamp(),
      });
      
      await addDoc(collection(db, `users/${user.uid}/courses/${courseRef2.id}/gradeCategories`), {
        name: "Assignments", weightPct: 40, earned: 36, possible: 40,
      });
      
      await addDoc(collection(db, `users/${user.uid}/courses/${courseRef2.id}/gradeCategories`), {
        name: "Exams", weightPct: 60, earned: 85, possible: 100,
      });
      
      // ADD GRADES FOR COURSE 2 (HIGH GRADES - won't be flagged)
      await addDoc(collection(db, `users/${user.uid}/grades`), {
        course: "Data Structures",
        grade: 92,
        createdAt: serverTimestamp(),
      });
      
      await addDoc(collection(db, `users/${user.uid}/grades`), {
        course: "Data Structures",
        grade: 88,
        createdAt: serverTimestamp(),
      });
      
      Alert.alert("Demo data added", "2 courses created! One with low grades (will show in Tutor View)");
    } catch (e: any) {
      Alert.alert("Seed failed", e.message);
    }
  };


  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>Admin</Text>
      <Button title="Seed demo data" onPress={seedDemoData} />

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
