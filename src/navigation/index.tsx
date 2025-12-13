import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import DashboardScreen from "../screens/DashboardScreen";
import CoursesScreen from "../screens/CoursesScreen";
import CourseFormScreen from "../screens/CourseFormScreen";
import AssignmentsScreen from "../screens/AssignmentsScreen";
import AssignmentFormScreen from "../screens/AssignmentFormScreen";
import GradesScreen from "../screens/GradesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TutorViewScreen from "../screens/TutorViewScreen";
import InstructorAnnouncementsScreen from "../screens/InstructorAnnouncementsScreen";
import AdminSettingsScreen from "../screens/AdminSettingsScreen";
import { useUser } from "../providers/AuthProvider";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const user = useUser();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Courses" component={CoursesScreen} />
            <Stack.Screen name="EditCourse" component={CourseFormScreen} options={{ title: "Course" }} />
            <Stack.Screen name="Assignments" component={AssignmentsScreen} />
            <Stack.Screen name="EditAssignment" component={AssignmentFormScreen} options={{ title: "Assignment" }} />
            <Stack.Screen name="Grades" component={GradesScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="TutorView" component={TutorViewScreen} options={{ title: "Tutor View" }} />
            <Stack.Screen name="InstructorAnnouncements" component={InstructorAnnouncementsScreen} options={{ title: "Instructor Announcements" }} />
            <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} options={{ title: "Admin Settings" }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}