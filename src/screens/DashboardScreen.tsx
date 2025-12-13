import React, { useEffect } from "react";
import { View, Text, Button, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import TutoringBanner from "../ui/TutoringBanner";
import DueSoonList from "../ui/DueSoonList";   // one level up to src/, then ui/
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useUser } from "../providers/AuthProvider";
import { useNavigation } from "@react-navigation/native";   // add this
import { getAnnouncement } from "../storage/announcementStorage";


export default function DashboardScreen() {
  const navigation = useNavigation();                        // get nav from hook
  const user = useUser();

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
  
  useEffect(() => {
  const checkAnnouncement = async () => {
    const announcement = await getAnnouncement();
    if (!announcement) return;

    Alert.alert(
      announcement.title,
      announcement.message,
      [{ text: "OK" }]
    );
  };

  checkAnnouncement();
}, []);


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
    <View style={{ padding: 16, gap: 12, flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Dashboard</Text>
      <Button title="Seed demo data" onPress={seedDemoData} />
      <Button title="Courses" onPress={() => (navigation as any).navigate("Courses")} />
      <Button title="Assignments" onPress={() => (navigation as any).navigate("Assignments")} />
      <Button title="Grades" onPress={() => (navigation as any).navigate("Grades")} />
      <Button title="Profile" onPress={() => (navigation as any).navigate("Profile")} />
      <Button title="View Students for Tutoring" onPress={() => (navigation as any).navigate('TutorView')} />
      <Button title="admin" onPress={() => (navigation as any).navigate("adminView")} />
      <TutoringBanner />
      <DueSoonList />
      <Button title="Sign out" onPress={() => signOut(auth)} />
    </View>
  );
}

