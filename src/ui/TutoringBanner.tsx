import React, { useEffect, useMemo, useState } from "react";
import { View, Text } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { useUser } from "../providers/AuthProvider";
import { db } from "../firebase";
import { weightedAverage } from "../utils/grades";

// Rule-based: show lowest-performing course if avg < 65%
export default function TutoringBanner() {
  const user = useUser();
  const [lowest, setLowest] = useState<{ courseId: string; name: string; avg: number } | null>(null);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const coursesSnap = await getDocs(collection(db, `users/${user.uid}/courses`));
      let best: { courseId: string; name: string; avg: number } | null = null;
      for (const c of coursesSnap.docs) {
        const name = (c.data() as any).name;
        const catSnap = await getDocs(collection(db, `users/${user.uid}/courses/${c.id}/gradeCategories`));
        const cats = catSnap.docs.map(d => d.data() as any);
        const avg = weightedAverage(cats);
        if (!best || avg < best.avg) best = { courseId: c.id, name, avg };
      }
      setLowest(best);
    })();
  }, [user]);

  if (!lowest || lowest.avg >= 65) return null;
  return (
    <View style={{ padding: 12, backgroundColor: "#FFF4E5", borderRadius: 8 }}>
      <Text style={{ fontWeight: "700" }}>Need a boost in {lowest.name}?</Text>
      <Text>Current average: {lowest.avg.toFixed(1)}%. Consider tutoring or extra practice.</Text>
    </View>
  );
}