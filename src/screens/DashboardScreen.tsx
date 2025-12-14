import { useCallback, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

import { auth } from "../firebase";
import BannerCard from "../ui/BannerCard";
import TutoringBanner from "../ui/TutoringBanner";
import DueSoonList from "../ui/DueSoonList";

import { Announcement, getAnnouncement } from "../storage/announcementStorage";

export default function DashboardScreen() {
  const navigation = useNavigation<any>();

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    getAnnouncement().then(setAnnouncement);
  }, [refreshKey]);

  return (
    <View style={{ padding: 16, gap: 12, flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Dashboard</Text>

      {/* Banners at top */}
      <View style={{ gap: 12 }}>
        {announcement && (
          <BannerCard title={announcement.title}>
            <Text style={styles.bannerMessage}>{announcement.message}</Text>
          </BannerCard>
        )}

        <TutoringBanner refreshKey={refreshKey} />
        <DueSoonList refreshKey={refreshKey} />
      </View>

      {/* Main navigation */}
      <Button title="Courses" onPress={() => navigation.navigate("Courses")} />
      <Button title="Profile" onPress={() => navigation.navigate("Profile")} />
      <Button title="Admin" onPress={() => navigation.navigate("adminView")} />
      <Button
        title="View Students for Tutoring"
        onPress={() => navigation.navigate("TutorView")}
      />
      <Button
        title="Instructor Announcements"
        onPress={() => navigation.navigate("InstructorAnnouncements")}
      />
      <Button title="Refresh dashboard" onPress={refresh} />
      <Button title="Sign out" onPress={() => signOut(auth)} />
    </View>
  );
}

const styles = StyleSheet.create({
  bannerMessage: {
    fontSize: 14,
  },
});
