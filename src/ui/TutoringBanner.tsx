import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { useUser } from "../providers/AuthProvider";
import { db } from "../firebase";
import { weightedAverage } from "../utils/grades";
import BannerCard from "./BannerCard";

type Props = {
  refreshKey?: number;
};

// Rule-based: show lowest-performing course if avg < 65%
export default function TutoringBanner({ refreshKey = 0 }: Props) {
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
        const cats = catSnap.docs.map((d) => d.data() as any);
        const avg = weightedAverage(cats);
        if (!best || avg < best.avg) best = { courseId: c.id, name, avg };
      }

      setLowest(best);
    })();
  }, [user, refreshKey]);

  if (!lowest || lowest.avg >= 65) return null;

  return (
    <BannerCard title={`Need a boost in ${lowest.name}?`}>
      <Text>
        Current average: {lowest.avg.toFixed(1)}%. Consider tutoring or extra practice.
      </Text>
    </BannerCard>
  );
}
