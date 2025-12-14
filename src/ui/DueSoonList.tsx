import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../providers/AuthProvider";
import { format } from "date-fns";
import BannerCard from "./BannerCard";

type Props = {
  refreshKey?: number;
};

export default function DueSoonList({ refreshKey = 0 }: Props) {
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
  }, [user, refreshKey]);

  if (!items.length) return null;

  return (
    <BannerCard title="Due soon">
      {items.map((it, i) => (
        <Text key={i}>
          • {it.title} — {format(new Date(it.dueAt), "MMM d, HH:mm")}
        </Text>
      ))}
    </BannerCard>
  );
}
