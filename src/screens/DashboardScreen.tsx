import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import TutoringBanner from "../ui/TutoringBanner";
import DueSoonList from "../ui/DueSoonList";   // one level up to src/, then ui/
import { useNavigation } from "@react-navigation/native";   // add this
import { Announcement, getAnnouncement } from "../storage/announcementStorage";


export default function DashboardScreen() {
  const navigation = useNavigation();                        // get nav from hook


//!!!!!old seed data!!!


  // const seedDemoData = async () => {
  //   try {
  //     if (!user) return;
  //     const courseRef = await addDoc(collection(db, `users/${user.uid}/courses`), {
  //       name: "Mobile Dev Advanced",
  //       code: "INFO-5126",
  //       instructorName: "Prof. Oak",
  //       meetingDays: ["Mon", "Wed"],
  //       startTime: "10:00",
  //       endTime: "11:30",
  //       createdAt: serverTimestamp(),
  //     });
  //     const now = Date.now();
  //     await addDoc(collection(db, `users/${user.uid}/courses/${courseRef.id}/assignments`), {
  //       title: "Quiz 3",
  //       dueAt: now + 2 * 24 * 60 * 60 * 1000,
  //       status: "todo",
  //       pointsEarned: 7,
  //       pointsPossible: 10,
  //     });
  //     await addDoc(collection(db, `users/${user.uid}/courses/${courseRef.id}/assignments`), {
  //       title: "Project Milestone",
  //       dueAt: now + 10 * 24 * 60 * 60 * 1000,
  //       status: "todo",
  //     });
  //     await addDoc(collection(db, `users/${user.uid}/courses/${courseRef.id}/gradeCategories`), {
  //       name: "Assignments", weightPct: 30, earned: 24, possible: 40,
  //     });
  //     await addDoc(collection(db, `users/${user.uid}/courses/${courseRef.id}/gradeCategories`), {
  //       name: "Midterm", weightPct: 30, earned: 18, possible: 30,
  //     });
  //     await addDoc(collection(db, `users/${user.uid}/courses/${courseRef.id}/gradeCategories`), {
  //       name: "Final", weightPct: 40, earned: 0, possible: 0,
  //     });
  //     Alert.alert("Demo data added", "You can now open Courses, Assignments, and Grades to demo.");
  //   } catch (e: any) {
  //     Alert.alert("Seed failed", e.message);
  //   }
  // };
  
const [announcement, setAnnouncement] = useState<Announcement | null>(null);

useEffect(() => {
  getAnnouncement().then(setAnnouncement);
}, []);



 

  return (
    <View style={{ padding: 16, gap: 12, flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Dashboard</Text>
          {announcement && (
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>{announcement.title}</Text>
        <Text style={styles.bannerMessage}>{announcement.message}</Text>
      </View>
    )}


      
      <Button title="Courses" onPress={() => (navigation as any).navigate("Courses")} />
      <Button title="Assignments" onPress={() => (navigation as any).navigate("Assignments")} />
      <Button title="Grades" onPress={() => (navigation as any).navigate("Grades")} />
      <Button title="Profile" onPress={() => (navigation as any).navigate("Profile")} />
      <Button title="admin" onPress={() => (navigation as any).navigate("adminView")} />
      <Button title="View Students for Tutoring" onPress={() => (navigation as any).navigate('TutorView')} />
      <Button title="Instructor Announcements" onPress={() => (navigation as any).navigate('InstructorAnnouncements')} />
      <TutoringBanner />
      <DueSoonList />
      <Button title="Sign out" onPress={() => signOut(auth)} />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#eef6ff",
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
    padding: 12,
    borderRadius: 8,
  },
  bannerTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  bannerMessage: {
    fontSize: 14,
  },
});

