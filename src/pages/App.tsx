import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Users, 
  BookOpen, 
  PieChart, 
  Menu, 
  ChevronRight, 
  Download, 
  Calendar, 
  Wallet,
  LayoutGrid,
  Bell
} from 'lucide-react';

import html2canvas from 'html2canvas';

import { Student, Course, CourseWithStudents, Transaction, HistoryEntry } from '../functions/types';
import { INITIAL_STUDENTS, INITIAL_COURSES, INITIAL_TRANSACTIONS } from '../functions/data';
import { formatThaiDate } from '../functions/utils';
import { StudentsTab } from './StudentsTab';
import { CoursesTab } from './CoursesTab';
import { FinanceTab } from './FinanceTab';
import { TimetableTab } from './TimetableTab';
import { NavItem } from './NavItem'; 
import { Sidebar } from './Sidebar';

// New: Import Modals
import { AddStudentModal } from '../modals/AddStudentModal';
import { EditStudentModal } from '../modals/EditStudentModal';
import { RegisterCourseModal } from '../modals/RegisterCourseModal';
import { AddCourseModal } from '../modals/AddCourseModal';
import { EditCourseModal } from '../modals/EditCourseModal';
import { DeleteConfirmModal } from '../modals/DeleteConfirmModal';
import { HistoryModal } from '../modals/HistoryModal';
import { AddExpenseModal } from '../modals/AddExpenseModal';
import { ProfileModal } from '../modals/ProfileModal';
import { SuccessModal } from '../modals/SuccessModal';
import { AlertModal } from '../modals/AlertModal';
import { PromptModal } from '../modals/PromptModal';
import { TimetableAttendanceModal, TimetableCourseDetailsModal } from '../modals/TimetableCourseModals';
import { FONT } from '../functions/fontsize';

const STORAGE_KEYS = {
  students: 'tutorm.students',
  courses: 'tutorm.courses',
  transactions: 'tutorm.transactions',
} as const;

const readStoredState = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeCourses = (raw: Course[]): Course[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(Boolean)
    .map((c) => ({
      id: Number(c.id),
      name: c.name ?? '',
      room: c.room ?? '',
      price: Number(c.price ?? 0),
      sessions: Number(c.sessions ?? 0),
      schedule: Array.isArray(c.schedule)
        ? c.schedule.map((s) => ({ day: s.day ?? '', time: s.time ?? '' }))
        : [],
    }));
};

const normalizeStudents = (raw: Student[], courses: Course[]): Student[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(Boolean)
    .map((s) => ({
      id: Number(s.id),
      name: s.name ?? '',
      prefix: s.prefix ?? '',
      nickname: s.nickname ?? '',
      grade: s.grade ?? '',
      parentPhone: s.parentPhone ?? '',
      courseSessions: Array.isArray(s.courseSessions)
        ? s.courseSessions.map((cs) => {
            const course = courses.find((c) => c.id === Number(cs.courseId));
            const balance = Number(cs.balance ?? 0);
            const totalSessions =
              Number(cs.totalSessions ?? 0) || Number(course?.sessions ?? balance);
            return {
              courseId: Number(cs.courseId),
              balance,
              totalSessions: Math.max(totalSessions, balance),
            };
          })
        : [],
      attendanceLog: Array.isArray(s.attendanceLog)
        ? s.attendanceLog.filter((log) => log && log.courseId != null && log.date)
        : [],
      history: Array.isArray(s.history)
        ? s.history.filter((h) => h && h.courseId != null && h.amount != null && h.date)
        : [],
    }));
};

const normalizeTransactions = (raw: Transaction[]): Transaction[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(Boolean)
    .map((t) => ({
      id: String(t.id),
      type: t.type === 'expense' ? 'expense' : 'income',
      category: t.category ?? '',
      amount: Number(t.amount ?? 0),
      description: t.description ?? '',
      date: t.date ?? new Date().toISOString().split('T')[0],
    }));
};

const toInt = (value: string | number | null | undefined) => {
  if (typeof value === 'number') return Number.isFinite(value) ? Math.trunc(value) : NaN;
  if (value === null || value === undefined) return NaN;
  const num = parseInt(String(value).trim(), 10);
  return Number.isFinite(num) ? num : NaN;
};

const App = () => {
  const [activeTab, setActiveTab] = useState('timetable');
  const timetableRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [courses, setCourses] = useState<Course[]>(() =>
    normalizeCourses(readStoredState(STORAGE_KEYS.courses, INITIAL_COURSES))
  );
  const [students, setStudents] = useState<Student[]>(() =>
    normalizeStudents(
      readStoredState(STORAGE_KEYS.students, INITIAL_STUDENTS),
      normalizeCourses(readStoredState(STORAGE_KEYS.courses, INITIAL_COURSES))
    )
  );
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    normalizeTransactions(readStoredState(STORAGE_KEYS.transactions, INITIAL_TRANSACTIONS))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('ทั้งหมด');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ทั้งหมด');
  const [selectedFinanceFilter, setSelectedFinanceFilter] = useState('ทั้งหมด');

  // Modal States
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showRegisModal, setShowRegisModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCourseDetailsModal, setShowCourseDetailsModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [globalAlert, setGlobalAlert] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
  const [globalPrompt, setGlobalPrompt] = useState<{ show: boolean, message: string, expectedWord: string, onConfirm: () => void } | null>(null);

  // Form States
  const [newStudent, setNewStudent] = useState({ name: '', prefix: '', nickname: '', grade: '', parentPhone: '' });
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [regisData, setRegisData] = useState<{ studentId: number | null, courseId: string, amount: string, date: string, note: string }>({
    studentId: null, courseId: '', amount: '', date: new Date().toLocaleDateString('en-CA'), note: ''
  });
  const [expenseData, setExpenseData] = useState({ category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
  const [newCourse, setNewCourse] = useState({ name: '', room: '', price: '', sessions: '10', schedule: [{ day: 'จันทร์', time: '' }] });
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const [teacherName, setTeacherName] = useState('แอดมิน ทิวเตอร์แอพ');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{ title: string, message: string, details: any[] }>({ title: '', message: '', details: [] });
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const requirePositiveInt = (label: string, value: string | number | null | undefined) => {
    const num = toInt(value);
    if (!Number.isFinite(num) || num <= 0) {
      setGlobalAlert({ show: true, message: `กรุณาระบุ ${label} เป็นตัวเลขมากกว่า 0` });
      return null;
    }
    return num;
  };

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Force load mock students if local storage only has the old 2 default students
  useEffect(() => {
    if (students.length <= 2) {
      setStudents(INITIAL_STUDENTS);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.students, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.courses, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
  }, [transactions]);

  // --- Logic ---
  const coursesWithStudents = useMemo<CourseWithStudents[]>(
    () =>
      courses.map((course) => ({
        ...course,
        students: students.filter((student) =>
          student.courseSessions && student.courseSessions.some((session) => session.courseId === course.id)
        ),
      })),
    [courses, students]
  );

  const selectedCourse = useMemo(
    () => coursesWithStudents.find((course) => course.id === selectedCourseId) ?? null,
    [coursesWithStudents, selectedCourseId]
  );

  const filteredStudents = useMemo(() => {
    return students
      .filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             s.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             s.parentPhone.includes(searchQuery);
        const matchesGrade = selectedGrade === 'ทั้งหมด' ? true : s.grade === selectedGrade;
        return matchesSearch && matchesGrade;
      })
      .sort((a, b) => {
        const minA = a.courseSessions.length > 0 ? Math.min(...a.courseSessions.map(s => s.balance)) : 999;
        const minB = b.courseSessions.length > 0 ? Math.min(...b.courseSessions.map(s => s.balance)) : 999;
        return minA - minB;
      });
  }, [students, searchQuery, selectedGrade]);

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  // Actions
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const student: Student = {
      ...newStudent,
      id: Date.now(),
      courseSessions: [],
      attendanceLog: [],
      history: []
    };
    setStudents([student, ...students]);
    setShowAddStudentModal(false);
    setNewStudent({ name: '', prefix: '', nickname: '', grade: '', parentPhone: '' });
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setStudents(students.map(s => s.id === editingStudent.id ? editingStudent : s));
    setShowEditStudentModal(false);
  };

  const handleDeleteStudent = (id: number) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const handleCheckAttendance = (studentId: number, courseId: number, date: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const session = student.courseSessions.find(cs => cs.courseId === courseId);
    if (!session || session.balance <= 0) {
      setGlobalAlert({ show: true, message: 'ไม่สามารถเช็กชื่อได้ เพราะคอร์สนี้ไม่มีชั่วโมงเรียนคงเหลือ' });
      return;
    }

    const alreadyChecked = student.attendanceLog?.some(log => log.courseId === courseId && log.date === date);
    if (alreadyChecked) {
      setGlobalAlert({ show: true, message: 'นักเรียนคนนี้เช็คชื่อวิชานี้ในวันนี้ไปแล้ว' });
      return;
    }

    setStudents(students.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          courseSessions: s.courseSessions.map(cs => 
            (cs.courseId === courseId && cs.balance > 0) ? { ...cs, balance: cs.balance - 1 } : cs
          ),
          attendanceLog: [...(s.attendanceLog || []), { courseId, date }]
        };
      }
      return s;
    }));
  };

  const handleUndoAttendance = (studentId: number, courseId: number, date: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const alreadyChecked = (student.attendanceLog || []).some(log => log.courseId === courseId && log.date === date);
    if (!alreadyChecked) return;

    setStudents(students.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          courseSessions: s.courseSessions.map(cs => 
            cs.courseId === courseId ? { ...cs, balance: cs.balance + 1 } : cs
          ),
          attendanceLog: s.attendanceLog.filter(log => !(log.courseId === courseId && log.date === date))
        };
      }
      return s;
    }));
  };

  const handleRegisterCourse = (e?: React.FormEvent, bypassPrompt?: boolean) => {
    e?.preventDefault();
    const course = courses.find(c => c.id === parseInt(regisData.courseId));
    const student = students.find(s => s.id === regisData.studentId);
    if (!course || !student) return;

    const existingSession = student.courseSessions.find(cs => cs.courseId === course.id);
    if (existingSession && existingSession.balance > 0 && !bypassPrompt) {
      setGlobalPrompt({
        show: true,
        message: `น้อง${student.nickname} ยังมีเวลาเรียนเหลือ ${existingSession.balance} ครั้ง ต้องการลงเวลาเรียนเพิ่ม ${course.sessions} ครั้ง หรือไม่?\n\nหากใช่ ให้พิมพ์คำว่า "ตกลง" เพื่อยืนยัน`,
        expectedWord: 'ตกลง',
        onConfirm: () => {
          setGlobalPrompt(null);
          handleRegisterCourse(undefined, true);
        }
      });
      return;
    }

    const amount = requirePositiveInt('ยอดชำระ', regisData.amount);
    if (!amount) return;
    const date = regisData.date;

    const newHistory: HistoryEntry = {
      id: Date.now().toString(),
      courseId: course.id,
      amount: amount,
      date: date
    };

    const newTransaction: Transaction = {
      id: `TR-${Date.now()}`,
      type: 'income',
      category: 'ค่าเรียน',
      amount: amount,
      description: `ลงทะเบียนเรียน: ${course.name} (นักเรียน: ${student.name})${regisData.note.trim() ? ` [หมายเหตุ: ${regisData.note.trim()}]` : ''}`,
      date: date,
      metadata: { studentId: student.id, courseId: course.id, note: regisData.note.trim() || undefined }
    };
    
    const updatedSessions = existingSession 
      ? student.courseSessions.map(cs => cs.courseId === course.id ? { ...cs, balance: cs.balance + course.sessions, totalSessions: (cs.totalSessions || course.sessions) + course.sessions } : cs)
      : [...student.courseSessions, { courseId: course.id, balance: course.sessions, totalSessions: course.sessions }];

    const updatedStudents = students.map(s => s.id === regisData.studentId ? {
      ...s,
      courseSessions: updatedSessions,
      history: [newHistory, ...s.history]
    } : s);

    setStudents(updatedStudents);
    setTransactions(prev => [newTransaction, ...prev]);
    setShowRegisModal(false);
    setRegisData({ studentId: null, courseId: '', amount: '', date: new Date().toLocaleDateString('en-CA'), note: '' });

    // Show Success!
    setSuccessDetails({
      title: 'ลงทะเบียนสำเร็จ!',
      message: `บันทึกข้อมูลการลงทะเบียนของน้อง${student.nickname} เรียบร้อยแล้ว`,
      details: [
        { label: 'น้อง', value: student.nickname },
        { label: 'วิชา', value: course.name },
        { label: 'ยอดชำระ', value: `${amount.toLocaleString()} ฿` }
      ]
    });
    setShowSuccessModal(true);
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const price = requirePositiveInt('ราคา', newCourse.price);
    if (!price) return;
    const sessions = requirePositiveInt('จำนวนครั้ง', newCourse.sessions);
    if (!sessions) return;
    const normalizedSchedule = newCourse.schedule.map((s) => ({
      day: s.day?.trim() ?? '',
      time: s.time?.trim() ?? '',
    }));
    if (normalizedSchedule.some((s) => !s.day || !s.time)) {
      setGlobalAlert({ show: true, message: 'กรุณากรอกวันและเวลาเรียนให้ครบทุกช่อง' });
      return;
    }
    const newCourseObj: Course = { 
      id: Date.now(), 
      name: newCourse.name, 
      room: newCourse.room, 
      price,
      sessions,
      schedule: normalizedSchedule 
    };
    setCourses([...courses, newCourseObj]);
    setShowAddCourseModal(false);
    setNewCourse({ name: '', room: '', price: '', sessions: '10', schedule: [{ day: 'จันทร์', time: '' }] });
  };

  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    if (!Number.isFinite(editingCourse.price) || editingCourse.price <= 0) {
      setGlobalAlert({ show: true, message: 'กรุณาระบุ ราคา เป็นตัวเลขมากกว่า 0' });
      return;
    }
    if (!Number.isFinite(editingCourse.sessions) || editingCourse.sessions <= 0) {
      setGlobalAlert({ show: true, message: 'กรุณาระบุ จำนวนครั้ง เป็นตัวเลขมากกว่า 0' });
      return;
    }
    if (editingCourse.schedule.some((s) => !s.day?.trim() || !s.time?.trim())) {
      setGlobalAlert({ show: true, message: 'กรุณากรอกวันและเวลาเรียนให้ครบทุกช่อง' });
      return;
    }
    setCourses(prev => prev.map(c => c.id === editingCourse.id ? editingCourse : c));
    setShowEditCourseModal(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = () => {
    if (!editingCourse) return;
    setGlobalPrompt({
      show: true,
      message: `คุณกำลังจะลบวิชา "${editingCourse.name}"\nนักเรียนทั้งหมดที่เรียนวิชานี้จะถูกนำประวัติการเข้าเรียนในวิชานี้ออก\nหากแน่ใจ ให้พิมพ์คำว่า "ลบวิชา" เพื่อยืนยัน`,
      expectedWord: 'ลบวิชา',
      onConfirm: () => {
        setCourses((prev) => prev.filter((c) => c.id !== editingCourse.id));
        setStudents((prev) =>
          prev.map((s) => ({
            ...s,
            courseSessions: s.courseSessions.filter((cs) => cs.courseId !== editingCourse.id),
            attendanceLog: s.attendanceLog.filter((log) => log.courseId !== editingCourse.id),
          }))
        );
        setShowEditCourseModal(false);
        setEditingCourse(null);
        setGlobalPrompt(null);
      },
    });
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseData.category) {
      setGlobalAlert({ show: true, message: 'กรุณาเลือกหมวดหมู่รายจ่าย' });
      return;
    }
    const amount = requirePositiveInt('ยอดรายจ่าย', expenseData.amount);
    if (!amount) return;
    const newExpense: Transaction = { id: `ex-${Date.now()}`, type: 'expense', category: expenseData.category, amount, description: expenseData.description, date: expenseData.date };
    setTransactions([newExpense, ...transactions]);
    setShowAddExpenseModal(false);
    setExpenseData({ category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
  };

  const confirmDelete = () => {
    if (confirmText === 'ยืนยัน' && editingStudent) {
      setStudents(students.filter(s => s.id !== editingStudent.id));
      setShowDeleteConfirm(false);
      setShowEditStudentModal(false);
      setConfirmText('');
    }
  };

  const handleDownloadTimetable = async () => {
    if (timetableRef.current) {
      const el = timetableRef.current;
      const scrollEl = el.querySelector('.custom-scrollbar') as HTMLElement;
      
      const originalOverflowX = el.style.overflowX;
      if (scrollEl) {
        scrollEl.style.overflowX = 'visible';
      }

      const canvas = await html2canvas(el, {
        backgroundColor: '#ffffff',
        scale: 2,
        windowWidth: scrollEl ? scrollEl.scrollWidth : el.scrollWidth,
      });

      if (scrollEl) {
        scrollEl.style.overflowX = originalOverflowX;
      }

      const link = document.createElement('a');
      link.download = `ตารางเรียน.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  // --- Tab Content ---
  const renderTabContent = () => {
    switch (activeTab) {
      case 'timetable':
        return (
          <div className="h-full flex flex-col">
            <TimetableTab 
              courses={coursesWithStudents} 
              timetableRef={timetableRef} 
              onViewCourse={(course) => {
                setSelectedCourseId(course.id);
                setShowAttendanceModal(true);
              }}
              onCheckAttendance={(course) => {
                setSelectedCourseId(course.id);
                setShowAttendanceModal(true);
              }}
            />
          </div>
        );
      case 'students':
        return <StudentsTab
          students={filteredStudents}
          courses={courses}
          onAddStudent={() => setShowAddStudentModal(true)}
          onEditStudent={(student) => { setEditingStudent(student); setShowEditStudentModal(true); }}
          onRegister={(student, cid) => { setRegisData({ studentId: student.id, courseId: cid ? cid.toString() : '', amount: '', date: new Date().toLocaleDateString('en-CA'), note: '' }); setShowRegisModal(true); }}
        />;
      case 'courses':
        return <CoursesTab
          courses={courses}
          students={students}
          onEditCourse={(course) => { setEditingCourse({ ...course }); setShowEditCourseModal(true); }}
          onCheckAttendance={handleCheckAttendance}
          onUndoAttendance={handleUndoAttendance}
          onEditStudent={(student) => { setEditingStudent(student); setShowEditStudentModal(true); }}
          onDeleteStudent={(id) => { const s = students.find(st => st.id === id); if (s) { setEditingStudent(s); setShowDeleteConfirm(true); } }}
        />;
      case 'finance':
        return <FinanceTab
          stats={stats}
          transactions={selectedFinanceFilter === 'ทั้งหมด' ? transactions : selectedFinanceFilter === 'month' ? transactions.filter(t => { const now = new Date(); const td = new Date(t.date); return td.getMonth() === now.getMonth() && td.getFullYear() === now.getFullYear(); }) : transactions.filter(t => t.type === selectedFinanceFilter)}
          students={students}
          courses={courses}
        />;
      default:
        return null;
    }
  }

  return (
    <div className="flex h-screen font-sans text-slate-900 overflow-hidden bg-[#F0F4F8]">
     <div className="flex w-full h-full overflow-hidden">

      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarHovered={isSidebarHovered}
        setIsSidebarHovered={setIsSidebarHovered}
      />

      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[90] lg:hidden" onClick={() => setSidebarOpen(false)}>
          <aside className="w-64 bg-white h-full shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center px-8 py-8 gap-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200" style={{ background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)' }}>
                 <LayoutGrid size={22} className="stroke-[2.5px]" />
              </div>
               <span className={`text-[#3B82F6] ${FONT.H5} whitespace-nowrap`}>
                 Tutor<span className="text-blue-500">M</span>
               </span>
            </div>

            <nav className="flex-1 px-3 space-y-2 mt-4">
              {[
                { id: 'timetable', label: 'ตารางเรียน', icon: Calendar },
                { id: 'students', label: 'นักเรียน', icon: Users },
                { id: 'courses', label: 'คอร์สเรียน', icon: BookOpen },
                { id: 'finance', label: 'การเงิน', icon: PieChart },
              ].map(tab => (
                <NavItem
                   key={tab.id}
                   {...tab}
                   activeTab={activeTab}
                   setActiveTab={(id) => { setActiveTab(id); setSidebarOpen(false); }}
                   isSidebarHovered={true}
                />
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-20 lg:h-24 bg-transparent flex items-center px-4 md:px-6 lg:px-10 shrink-0 justify-between relative z-[50]">
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="lg:hidden p-3 text-slate-900 bg-white border border-slate-100 rounded-xl shadow-soft shadow-slate-200" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
               <h2 className={`hidden lg:block ${FONT.H2} text-slate-900`}>
                  {activeTab === 'timetable' ? 'ตารางเรียน' : activeTab === 'students' ? 'รายชื่อนักเรียน' : activeTab === 'courses' ? 'คอร์สเรียนทั้งหมด' : 'สรุปการเงิน'}
               </h2>
               <p className={`hidden lg:block ${FONT.LABEL_SM} text-slate-900 uppercase mt-1`}>
                  {activeTab === 'timetable' ? 'ระบบตารางเรียนอัจฉริยะ' : 'ระบบจัดการสถาบันกวดวิชา'}
               </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
             <div className="flex-1 min-w-[200px] lg:min-w-[320px] hidden xl:block">
                <div className="relative group">
                  <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-900 group-focus-within:text-blue-500 transition-colors" />
                 <input
                   ref={searchInputRef}
                   type="text"
                   value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหานักเรียน, คอร์สเรียน..."
                    className={`w-full bg-white/60 backdrop-blur-md border-transparent rounded-2xl lg:rounded-[24px] py-3 lg:py-4 pl-12 lg:pl-14 pr-6 lg:pr-8 text-sm lg:${FONT.LABEL_LG} text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all shadow-soft shadow-slate-200`}
                  />
               </div>
             </div>

             <div className="flex items-center gap-4">
                <div className="flex gap-2 lg:gap-4">
                  {activeTab === 'timetable' && (
                    <button 
                      onClick={handleDownloadTimetable} 
                      className="hidden xl:flex px-6 lg:px-8 bg-blue-50 border-2 border-transparent text-blue-600 rounded-xl lg:rounded-2xl items-center gap-3 hover:bg-blue-100 hover:border-blue-200 transition-all active:scale-95"
                    >
                      <Calendar size={18} className="stroke-[3px]" />
                      <span className={`${FONT.LABEL} uppercase whitespace-nowrap`}>โหลดตารางเรียน</span>
                    </button>
                  )}
                  {activeTab === 'students' && (
                    <button onClick={() => setShowAddStudentModal(true)} className="px-4 lg:px-8 bg-slate-900 border-2 border-slate-900 text-white rounded-xl lg:rounded-2xl flex items-center gap-2 lg:gap-4 hover:bg-transparent hover:text-slate-900 transition-all shadow-xl shadow-slate-200">
                      <Plus size={18} className="stroke-[3px]" />
                      <span className={`${FONT.LABEL} uppercase whitespace-nowrap hidden sm:block`}>เพิ่มนักเรียน</span>
                    </button>
                  )}
                  {activeTab === 'courses' && (
                    <button onClick={() => setShowAddCourseModal(true)} className="px-4 lg:px-8 bg-slate-900 border-2 border-slate-900 text-white rounded-xl lg:rounded-2xl flex items-center gap-2 lg:gap-4 hover:bg-transparent hover:text-slate-900 transition-all shadow-xl shadow-slate-200">
                      <Plus size={18} className="stroke-[3px]" />
                      <span className={`${FONT.LABEL} uppercase whitespace-nowrap hidden sm:block`}>สร้างวิชาเรียน</span>
                    </button>
                  )}
                  {activeTab === 'finance' && (
                    <button onClick={() => setShowAddExpenseModal(true)} className="px-4 lg:px-8 bg-slate-900 border-2 border-slate-900 text-white rounded-xl lg:rounded-2xl flex items-center gap-2 lg:gap-4 hover:bg-transparent hover:text-slate-900 transition-all shadow-xl shadow-slate-200">
                      <Plus size={18} className="stroke-[3px]" />
                      <span className={`${FONT.LABEL} uppercase whitespace-nowrap hidden sm:block`}>บันทึกรายรับรายจ่าย</span>
                    </button>
                  )}
                </div>
             </div>
          </div>
        </header>

        <div className={`flex-1 min-h-0 ${activeTab === 'timetable' ? 'px-4 pb-4 md:px-6 md:pb-6 lg:px-10 lg:pb-10' : 'p-4 md:p-6 lg:p-10'} overflow-hidden`}>
          <div className="w-full h-full max-w-[1700px] mx-auto flex flex-col min-h-0">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>

      {/* --- MODALS --- */}
      <AddStudentModal
        show={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        newStudent={newStudent}
        setNewStudent={setNewStudent}
        onSubmit={handleAddStudent}
      />

      <EditStudentModal
        show={showEditStudentModal}
        onClose={() => setShowEditStudentModal(false)}
        editingStudent={editingStudent}
        setEditingStudent={setEditingStudent}
        onSubmit={handleUpdateStudent}
        onDeleteClick={() => setShowDeleteConfirm(true)}
      />

      <RegisterCourseModal
        show={showRegisModal}
        onClose={() => setShowRegisModal(false)}
        regisData={regisData}
        setRegisData={setRegisData}
        courses={courses}
        students={students}
        onSubmit={handleRegisterCourse}
      />

      <AddCourseModal
        show={showAddCourseModal}
        onClose={() => setShowAddCourseModal(false)}
        newCourse={newCourse}
        setNewCourse={setNewCourse}
        onSubmit={handleAddCourse}
      />

      <EditCourseModal
        show={showEditCourseModal}
        onClose={() => setShowEditCourseModal(false)}
        course={editingCourse}
        setCourse={setEditingCourse}
        onSubmit={handleUpdateCourse}
        onDelete={handleDeleteCourse}
      />

      <DeleteConfirmModal
        show={showDeleteConfirm}
        onClose={() => { setShowDeleteConfirm(false); setConfirmText(''); }}
        confirmText={confirmText}
        setConfirmText={setConfirmText}
        onConfirm={confirmDelete}
      />

      <AddExpenseModal
        show={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
        expenseData={expenseData}
        setExpenseData={setExpenseData}
        onSubmit={handleAddExpense}
      />

      <ProfileModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      <TimetableCourseDetailsModal 
        show={showCourseDetailsModal}
        onClose={() => { setShowCourseDetailsModal(false); setSelectedCourseId(null); }}
        course={selectedCourse as any}
        onOpenCoursePage={(courseId) => {
          setActiveTab('courses');
          setShowCourseDetailsModal(false);
          setSelectedCourseId(courseId);
        }}
      />

      {showHistoryModal && editingStudent && (
        <HistoryModal
          show={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          student={editingStudent}
          courses={courses}
        />
      )}

      <TimetableAttendanceModal
        show={showAttendanceModal}
        onClose={() => { setShowAttendanceModal(false); setSelectedCourseId(null); }}
        course={selectedCourse as any}
        onCheckAttendance={handleCheckAttendance}
        onUndoAttendance={handleUndoAttendance}
      />

      <SuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successDetails.title}
        message={successDetails.message}
        details={successDetails.details}
      />

      <AlertModal 
        show={globalAlert.show} 
        message={globalAlert.message} 
        onClose={() => setGlobalAlert({ show: false, message: '' })} 
      />

      {globalPrompt && (
        <PromptModal 
          show={globalPrompt.show} 
          message={globalPrompt.message} 
          expectedWord={globalPrompt.expectedWord} 
          onConfirm={globalPrompt.onConfirm} 
          onClose={() => setGlobalPrompt(null)} 
        />
      )}
    </div>
  );
};

export default App;
