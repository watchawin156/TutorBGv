export interface CourseSession {
  courseId: number;
  balance: number;
  totalSessions: number;
}

export interface AttendanceEntry {
  courseId: number;
  date: string;
}

export interface CourseScheduleSlot {
  day: string;
  time: string;
}

export interface HistoryEntry {
  id: string;
  courseId: number;
  amount: number;
  date: string;
}

export interface Student {
  id: number;
  name: string;
  prefix: string;
  nickname: string;
  grade: string;
  parentPhone: string;
  courseSessions: CourseSession[];
  attendanceLog: AttendanceEntry[];
  history: HistoryEntry[];
}

export interface Course {
  id: number;
  name: string;
  room: string;
  price: number;
  sessions: number;
  schedule: CourseScheduleSlot[];
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  metadata?: {
    studentId?: number;
    courseId?: number;
    note?: string;
  };
}

export interface CourseWithStudents extends Course {
  students: Student[];
}
