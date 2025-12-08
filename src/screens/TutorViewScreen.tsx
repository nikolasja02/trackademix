import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../firebase";

interface Student {
  id: string;
  displayName: string;
  weakestCourse: string;
  averageGrade: number;
}

const TutorViewScreen = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlaggedStudents();
  }, []);

  const fetchFlaggedStudents = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const flaggedStudents: Student[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userId = userDoc.id;
        const displayName = userData.displayName || 'Unknown Student';

        // Fetch student's grades
        const gradesSnapshot = await getDocs(
          collection(db, `users/${userId}/grades`)
        );

        if (gradesSnapshot.empty) continue;

        // Calculate average grade per course
        const courseGrades: { [key: string]: number[] } = {};

        gradesSnapshot.forEach((gradeDoc) => {
          const gradeData = gradeDoc.data();
          const course = gradeData.course || 'Unknown';
          const grade = gradeData.grade || 0;

          if (!courseGrades[course]) {
            courseGrades[course] = [];
          }
          courseGrades[course].push(grade);
        });

        // Find weakest course (lowest average)
        let weakestCourse = '';
        let lowestAverage = 100;

        Object.keys(courseGrades).forEach((course) => {
          const grades = courseGrades[course];
          const average = grades.reduce((sum, g) => sum + g, 0) / grades.length;

          if (average < lowestAverage) {
            lowestAverage = average;
            weakestCourse = course;
          }
        });

        // Flag students with weakest course average below 70
        if (lowestAverage < 70) {
          flaggedStudents.push({
            id: userId,
            displayName,
            weakestCourse,
            averageGrade: Math.round(lowestAverage),
          });
        }
      }

      setStudents(flaggedStudents);
    } catch (error) {
      console.error('Error fetching flagged students:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading students...</Text>
      </View>
    );
  }

  if (students.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Students Flagged</Text>
        <Text style={styles.emptyText}>
          All students are performing well! No tutoring recommendations at this time.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Students Needing Tutoring</Text>
        <Text style={styles.subtitle}>
          {students.length} student{students.length !== 1 ? 's' : ''} flagged for tutoring support
        </Text>
      </View>

      {students.map((student) => (
        <View key={student.id} style={styles.studentCard}>
          <View style={styles.studentHeader}>
            <Text style={styles.studentName}>{student.displayName}</Text>
            <View style={styles.gradeBadge}>
              <Text style={styles.gradeText}>{student.averageGrade}%</Text>
            </View>
          </View>

          <View style={styles.courseInfo}>
            <Text style={styles.courseLabel}>Weakest Course:</Text>
            <Text style={styles.courseName}>{student.weakestCourse}</Text>
          </View>

          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationIcon}>📚</Text>
            <Text style={styles.recommendationText}>
              Tutoring is recommended for {student.weakestCourse}. 
              This student is struggling and could benefit from additional support.
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F5F7FA',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E3F2FD',
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  gradeBadge: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  gradeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  courseLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginRight: 8,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
  },
  recommendationBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  recommendationIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});

export default TutorViewScreen;