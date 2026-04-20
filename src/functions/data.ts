import { Student, Course, Transaction } from './types';

import { MOCK_100_STUDENTS } from './mockStudents';

export const INITIAL_STUDENTS: Student[] = [
  ...MOCK_100_STUDENTS
];

export const INITIAL_COURSES: Course[] = [
  { id: 1, name: 'คณิตศาสตร์ ม.4 (Advanced)', room: '101', price: 3500, sessions: 10, schedule: [{ day: 'จันทร์', time: '17.00-19.00' }, { day: 'พุธ', time: '17.00-19.00' }] },
  { id: 2, name: 'ฟิสิกส์ ม.5 (โจทย์เข้ม)', room: '202', price: 4200, sessions: 10, schedule: [{ day: 'อังคาร', time: '17.30-19.30' }, { day: 'พฤหัสบดี', time: '17.30-19.30' }] },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'tx1', type: 'income', category: 'ค่าเรียน', amount: 3500, description: 'สมชาย รักเรียน (คณิตศาสตร์ ม.4)', date: '2024-01-15' },
];

export const DAYS_OF_WEEK = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];