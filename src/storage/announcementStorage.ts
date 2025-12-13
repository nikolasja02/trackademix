import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "LATEST_ANNOUNCEMENT";

export type Announcement = {
  title: string;
  message: string;
  timestamp: number;
};

export async function saveAnnouncement(a: Announcement) {
  await AsyncStorage.setItem(KEY, JSON.stringify(a));
}

export async function getAnnouncement(): Promise<Announcement | null> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function clearAnnouncement() {
  await AsyncStorage.removeItem(KEY);
}
