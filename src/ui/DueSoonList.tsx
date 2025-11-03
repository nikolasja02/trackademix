import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../providers/AuthProvider";
import { format } from "date-fns";

export default function DueSoonList() {   // ← default export
  const user = useUser();
  const [items, setItems] = useState<{ title: string; dueAt: number }[]>([]);
  useEffect(() => {
    (async () => {
      if (!user) return;
      const out: { title: string; dueAt: number }[] = [];
      const courseSnap = await getDocs(collection(db, `users/${user.uid}/courses`));
      for (const c of courseSnap.docs) {
        const aSnap = await getDocs(collection(db, `users/${user.uid}/courses/${c.id}/assignments`));
        for (const a of aSnap.docs) {
          const data = a.data() as any;
          const week = 7 * 24 * 60 * 60 * 1000;
          if (data.dueAt && data.dueAt - Date.now() <= week && data.dueAt >= Date.now()) {
            out.push({ title: data.title, dueAt: data.dueAt });
          }
        }
      }
      out.sort((x, y) => x.dueAt - y.dueAt);
      setItems(out.slice(0, 3));
    })();
  }, [user]);

  if (!items.length) return null;
  return (
    <View style={{ marginTop: 12, padding: 12, backgroundColor: "#E6F4FF", borderRadius: 8 }}>
      <Text style={{ fontWeight: "700", marginBottom: 6 }}>Due soon</Text>
      {items.map((it, i) => (
        <Text key={i}>• {it.title} — {format(new Date(it.dueAt), "MMM d, HH:mm")}</Text>
      ))}
    </View>
  );
}
