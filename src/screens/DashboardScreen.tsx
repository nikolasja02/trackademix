import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Dimensions} from "react-native";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";
import TutoringBanner from "../ui/TutoringBanner";
import DueSoonList from "../ui/DueSoonList";
import { Announcement, getAnnouncement } from "../storage/announcementStorage";
import { useUser } from "../providers/AuthProvider";

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2; 

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const user = useUser();

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [greeting, setGreeting] = useState("Hello");

  //Logic to determine Morning/Afternoon/Evening
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  //Logic to get the Name (Display Name -> Email -> Default)
  const displayName = user?.displayName 
    ? user.displayName 
    : user?.email?.split('@')[0] || "Student";

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {

    getAnnouncement().then(setAnnouncement);
    // verify refresh works
   // console.log("Dashboard refreshKey changed:", refreshKey);
  }, [refreshKey]);

  const DashboardCard = ({ 
    title, 
    icon, 
    onPress, 
    color = "#4A90E2",
    badgeCount = 0
  }: { 
    title: string; 
    icon: string; 
    onPress: () => void; 
    color?: string;
    badgeCount?: number;
  }) => (
    <TouchableOpacity 
      style={styles.gridCard} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Text style={[styles.gridIcon, { color: color }]}>{icon}</Text>
      </View>
      <Text style={styles.gridTitle}>{title}</Text>
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const ActionRow = ({ title, icon, onPress, color = "#666" }: any) => (
    <TouchableOpacity style={styles.actionRow} onPress={onPress}>
      <View style={[styles.smallIconBox, { backgroundColor: `${color}15` }]}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <Text style={styles.actionRowText}>{title}</Text>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        bounces={false} 
      >
        
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View>
              {/* Dynamic Greeting */}
              <Text style={styles.greeting}>{greeting},</Text>
              {/* Dynamic Name */}
              <Text style={styles.username}>{displayName}</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton} 
              onPress={() => navigation.navigate("Profile")}
            >
              <Text style={styles.profileIcon}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          
          {/* Priority Section */}
          <View style={styles.prioritySection}>
             {announcement && (
              <View style={styles.announcementCard}>
                <View style={styles.announcementHeader}>
                  <Text style={styles.announcementLabel}>📢 ANNOUNCEMENT</Text>
                  <Text style={styles.announcementTime}>Just now</Text>
                </View>
                <Text style={styles.announcementTitle}>{announcement.title}</Text>
                <Text style={styles.announcementBody}>{announcement.message}</Text>
              </View>
            )}

            <View style={{ gap: 12 }}>
              <TutoringBanner refreshKey={refreshKey} />
              <DueSoonList refreshKey={refreshKey} />
            </View>
          </View>

          {/* Academics Grid*/}
          <Text style={styles.sectionHeader}>Academics</Text>
          <View style={styles.gridContainer}>
            <DashboardCard 
              title="Courses" 
              icon="📚" 
              color="#2563EB" 
              onPress={() => navigation.navigate("Courses")} 
            />
            <DashboardCard 
              title="Tutor View" 
              icon="🎓" 
              color="#EA580C" 
              onPress={() => navigation.navigate("TutorView")} 
            />
          </View>

          {/* Tools List */}
          <Text style={styles.sectionHeader}>Tools & Settings</Text>
          <View style={styles.actionsContainer}>
            <ActionRow 
              title="Instructor Announcements" 
              icon="📌" 
              color="#0284C7"
              onPress={() => navigation.navigate("InstructorAnnouncements")} 
            />
            <View style={styles.divider} />
            <ActionRow 
              title="Admin Panel" 
              icon="⚙️" 
              color="#475569"
              onPress={() => navigation.navigate("adminView")} 
            />
            <View style={styles.divider} />
            <ActionRow 
              title="Refresh Dashboard"
              icon="🔄"
              color="#16A34A"
              onPress={refresh}
            />
            <View style={styles.divider} />
            <ActionRow 
              title="Sign Out" 
              icon="🚪" 
              color="#DC2626"
              onPress={() => signOut(auth)} 
            />
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    backgroundColor: '#1E293B',
    paddingTop: 60, 
    paddingBottom: 30,
    paddingHorizontal: 20,
    marginBottom: 20, 
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  username: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 2,
  },
  profileButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  profileIcon: {
    fontSize: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: -10, 
  },
  prioritySection: {
    marginBottom: 24,
    gap: 16,
  },
  announcementCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  announcementLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 0.5,
  },
  announcementTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  announcementBody: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  gridCard: {
    width: COLUMN_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridIcon: {
    fontSize: 24,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 4,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  smallIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionRowText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  chevron: {
    fontSize: 18,
    color: '#CBD5E1',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 60,
  },
});