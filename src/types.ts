export type MeetingDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface Course {
    id?: string;
    name: string;
    code: string;
    instructorName?: string;
    meetingDays: MeetingDay[];
    startTime: string; // "HH:mm"
    endTime: string; // "HH:mm"
    term?: string; // e.g., "F2025"
}

export interface Assignment {
    id?: string;
    title: string;
    dueAt: number; // epoch ms
    status: "todo" | "done";
    pointsEarned?: number;
    pointsPossible?: number;
}

export interface GradeCategory {
    id?: string;
    name: string; // e.g., Assignments
    weightPct: number; // 0..100
    earned: number; // points earned
    possible: number; // points possible
}

export interface Profile {
    displayName?: string;
    instagram?: string;
    xHandle?: string;
    discord?: string;
}
