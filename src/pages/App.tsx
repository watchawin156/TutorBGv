import React, { useState, useMemo, useEffect, useRef } from "react";
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
  Bell,
  LogOut,
  Globe,
  Moon,
  Sun,
  Grid,
  ChevronDown,
  Upload,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";

import html2canvas from "html2canvas";

import {
  Student,
  Course,
  CourseWithStudents,
  Transaction,
  HistoryEntry,
} from "../functions/types";
import {
  INITIAL_STUDENTS,
  INITIAL_COURSES,
  INITIAL_TRANSACTIONS,
} from "../functions/data";
import { formatThaiDate } from "../functions/utils";
import { StudentsTab } from "./StudentsTab";
import { CoursesTab } from "./CoursesTab";
import { FinanceTab } from "./FinanceTab";
import { TimetableTab } from "./TimetableTab";
import { DashboardTab } from "./DashboardTab";
import { NavItem } from "./NavItem";
import { Sidebar } from "./Sidebar";

// New: Import Modals
import { AddStudentModal } from "../modals/AddStudentModal";
import { EditStudentModal } from "../modals/EditStudentModal";
import { RegisterCourseModal } from "../modals/RegisterCourseModal";
import { AddCourseModal } from "../modals/AddCourseModal";
import { EditCourseModal } from "../modals/EditCourseModal";
import { DeleteConfirmModal } from "../modals/DeleteConfirmModal";
import { HistoryModal } from "../modals/HistoryModal";
import { AddTransactionModal } from "../modals/AddTransactionModal";
import { ProfileModal } from "../modals/ProfileModal";
import { SuccessModal } from "../modals/SuccessModal";
import { AlertModal } from "../modals/AlertModal";
import { PromptModal } from "../modals/PromptModal";
import {
  TimetableAttendanceModal,
  TimetableCourseDetailsModal,
} from "../modals/TimetableCourseModals";
import { FONT } from "../functions/fontsize";

const STORAGE_KEYS = {
  students: "tutorapp_students_prod_v1",
  courses: "tutorapp_courses_prod_v1",
  transactions: "tutorapp_transactions_prod_v1",
} as const;

const readStoredState = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeCourses = (raw: Course[]): Course[] => {
  if (!Array.isArray(raw)) return [];
  return raw.filter(Boolean).map((c) => ({
    id: Number(c.id),
    name: c.name ?? "",
    room: c.room ?? "",
    price: Number(c.price ?? 0),
    sessions: Number(c.sessions ?? 0),
    schedule: Array.isArray(c.schedule)
      ? c.schedule.map((s) => ({ day: s.day ?? "", time: s.time ?? "" }))
      : [],
  }));
};

const normalizeStudents = (raw: Student[], courses: Course[]): Student[] => {
  if (!Array.isArray(raw)) return [];
  return raw.filter(Boolean).map((s) => ({
    id: Number(s.id),
    name: s.name ?? "",
    prefix: s.prefix ?? "",
    nickname: s.nickname ?? "",
    grade: s.grade ?? "",
    parentPhone: s.parentPhone ?? "",
    courseSessions: Array.isArray(s.courseSessions)
      ? s.courseSessions.map((cs) => {
          const course = courses.find((c) => c.id === Number(cs.courseId));
          const balance = Number(cs.balance ?? 0);
          const totalSessions =
            Number(cs.totalSessions ?? 0) ||
            Number(course?.sessions ?? balance);
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
      ? s.history.filter(
          (h) => h && h.courseId != null && h.amount != null && h.date,
        )
      : [],
  }));
};

const normalizeTransactions = (raw: Transaction[]): Transaction[] => {
  if (!Array.isArray(raw)) return [];
  return raw.filter(Boolean).map((t) => ({
    id: String(t.id),
    type: t.type === "expense" ? "expense" : "income",
    category: t.category ?? "",
    amount: Number(t.amount ?? 0),
    description: t.description ?? "",
    date: t.date ?? new Date().toISOString().split("T")[0],
    metadata: t.metadata || undefined,
  }));
};

const toInt = (value: string | number | null | undefined) => {
  if (typeof value === "number")
    return Number.isFinite(value) ? Math.trunc(value) : NaN;
  if (value === null || value === undefined) return NaN;
  const num = parseInt(String(value).trim(), 10);
  return Number.isFinite(num) ? num : NaN;
};

const App = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    picture: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem("tutorm.auth");
    if (storedAuth) {
      const auth = JSON.parse(storedAuth);
      setIsLoggedIn(true);
      setUserProfile(auth);
    }
  }, []);

  const handleLogin = (profile: {
    name: string;
    picture: string;
    role: string;
  }) => {
    setIsLoggedIn(true);
    setUserProfile(profile);
    localStorage.setItem("tutorm.auth", JSON.stringify(profile));
  };
  const timetableRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [courses, setCourses] = useState<Course[]>(() =>
    normalizeCourses(readStoredState(STORAGE_KEYS.courses, INITIAL_COURSES)),
  );
  const [students, setStudents] = useState<Student[]>(() =>
    normalizeStudents(
      readStoredState(STORAGE_KEYS.students, INITIAL_STUDENTS),
      normalizeCourses(readStoredState(STORAGE_KEYS.courses, INITIAL_COURSES)),
    ),
  );
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    normalizeTransactions(
      readStoredState(STORAGE_KEYS.transactions, INITIAL_TRANSACTIONS),
    ),
  );
  const [selectedGrade, setSelectedGrade] = useState("ทั้งหมด");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("ทั้งหมด");
  const [selectedFinanceFilter, setSelectedFinanceFilter] = useState("ทั้งหมด");

  // Hoisted Filter States
  const [studentFilterGrade, setStudentFilterGrade] = useState("all");
  const [studentFilterBalance, setStudentFilterBalance] = useState("all");
  const [isStudentMenuDropdownOpen, setIsStudentMenuDropdownOpen] = useState(false);
  const [financeFilterMonth, setFinanceFilterMonth] = useState("all");
  const [isFinanceMonthDropdownOpen, setIsFinanceMonthDropdownOpen] =
    useState(false);

  const availableGrades = useMemo(() => {
    return Array.from(new Set(students.map((s) => s.grade))).sort();
  }, [students]);

  const availableFinanceMonths = useMemo(() => {
    const months = new Set<string>();
    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const monthNames = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ];
      months.add(`${monthNames[date.getMonth()]} ${date.getFullYear() + 543}`);
    });
    return Array.from(months);
  }, [transactions]);

  // Modal States
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showRegisModal, setShowRegisModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCourseDetailsModal, setShowCourseDetailsModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [globalAlert, setGlobalAlert] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });
  const [globalPrompt, setGlobalPrompt] = useState<{
    show: boolean;
    message: string;
    expectedWord: string;
    onConfirm: () => void;
  } | null>(null);

  // Form States
  const [newStudent, setNewStudent] = useState({
    name: "",
    prefix: "",
    nickname: "",
    grade: "",
    parentPhone: "",
  });
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [regisData, setRegisData] = useState<{
    studentId: number | null;
    courseId: string;
    amount: string;
    date: string;
    note: string;
  }>({
    studentId: null,
    courseId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [transactionData, setTransactionData] = useState<{
    type: "income" | "expense";
    category: string;
    amount: string;
    description: string;
    date: string;
  }>({
    type: "expense",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [newCourse, setNewCourse] = useState({
    name: "",
    room: "",
    price: "",
    sessions: "10",
    schedule: [{ day: "จันทร์", time: "" }],
  });
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [teacherName, setTeacherName] = useState("แอดมิน ทิวเตอร์แอพ");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{
    title: string;
    message: string;
    details: any[];
  }>({ title: "", message: "", details: [] });
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const requirePositiveInt = (
    label: string,
    value: string | number | null | undefined,
  ) => {
    const num = toInt(value);
    if (!Number.isFinite(num) || num <= 0) {
      setGlobalAlert({
        show: true,
        message: `กรุณาระบุ ${label} เป็นตัวเลขมากกว่า 0`,
      });
      return null;
    }
    return num;
  };

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // FORCE CLEAR AND RESET logic
  useEffect(() => {
    // Check for a hard reset flag or if we need to migrate
    if (localStorage.getItem("tutorapp_initialized_v1") !== "true") {
      localStorage.clear();
      localStorage.setItem("tutorapp_initialized_v1", "true");
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.students,
      JSON.stringify(students),
    );
  }, [students]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.courses, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.transactions,
      JSON.stringify(transactions),
    );
  }, [transactions]);

  // --- Logic ---
  const coursesWithStudents = useMemo<CourseWithStudents[]>(
    () =>
      courses.map((course) => ({
        ...course,
        students: students.filter(
          (student) =>
            student.courseSessions &&
            student.courseSessions.some(
              (session) => session.courseId === course.id,
            ),
        ),
      })),
    [courses, students],
  );

  const selectedCourse = useMemo(
    () =>
      coursesWithStudents.find((course) => course.id === selectedCourseId) ??
      null,
    [coursesWithStudents, selectedCourseId],
  );

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0);
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
      history: [],
    };
    setStudents([student, ...students]);
    setShowAddStudentModal(false);
    setNewStudent({
      name: "",
      prefix: "",
      nickname: "",
      grade: "",
      parentPhone: "",
    });
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setStudents(
      students.map((s) => (s.id === editingStudent.id ? editingStudent : s)),
    );
    setShowEditStudentModal(false);
  };

  const handleDeleteStudent = (id: number) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const handleCheckAttendance = (
    studentId: number,
    courseId: number,
    date: string,
  ) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    const session = student.courseSessions.find(
      (cs) => cs.courseId === courseId,
    );
    if (!session || session.balance <= 0) {
      setGlobalAlert({
        show: true,
        message: "ไม่สามารถเช็กชื่อได้ เพราะคอร์สนี้ไม่มีชั่วโมงเรียนคงเหลือ",
      });
      return;
    }

    const alreadyChecked = student.attendanceLog?.some(
      (log) => log.courseId === courseId && log.date === date,
    );
    if (alreadyChecked) {
      setGlobalAlert({
        show: true,
        message: "นักเรียนคนนี้เช็คชื่อวิชานี้ในวันนี้ไปแล้ว",
      });
      return;
    }

    setStudents(
      students.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            courseSessions: s.courseSessions.map((cs) =>
              cs.courseId === courseId && cs.balance > 0
                ? { ...cs, balance: cs.balance - 1 }
                : cs,
            ),
            attendanceLog: [...(s.attendanceLog || []), { courseId, date }],
          };
        }
        return s;
      }),
    );
  };

  const handleUndoAttendance = (
    studentId: number,
    courseId: number,
    date: string,
  ) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    const alreadyChecked = (student.attendanceLog || []).some(
      (log) => log.courseId === courseId && log.date === date,
    );
    if (!alreadyChecked) return;

    setStudents(
      students.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            courseSessions: s.courseSessions.map((cs) =>
              cs.courseId === courseId
                ? { ...cs, balance: cs.balance + 1 }
                : cs,
            ),
            attendanceLog: s.attendanceLog.filter(
              (log) => !(log.courseId === courseId && log.date === date),
            ),
          };
        }
        return s;
      }),
    );
  };

  const handleRegisterCourse = (
    e?: React.FormEvent,
    bypassPrompt?: boolean,
  ) => {
    e?.preventDefault();
    const course = courses.find((c) => c.id === parseInt(regisData.courseId));
    const student = students.find((s) => s.id === regisData.studentId);
    if (!course || !student) return;

    const existingSession = student.courseSessions.find(
      (cs) => cs.courseId === course.id,
    );
    if (existingSession && existingSession.balance > 0 && !bypassPrompt) {
      setGlobalPrompt({
        show: true,
        message: `น้อง${student.nickname} ยังมีเวลาเรียนเหลือ ${existingSession.balance} ครั้ง ต้องการลงเวลาเรียนเพิ่ม ${course.sessions} ครั้ง หรือไม่?\n\nหากใช่ ให้พิมพ์คำว่า "ตกลง" เพื่อยืนยัน`,
        expectedWord: "ตกลง",
        onConfirm: () => {
          setGlobalPrompt(null);
          handleRegisterCourse(undefined, true);
        },
      });
      return;
    }

    const amount = requirePositiveInt("ยอดชำระ", regisData.amount);
    if (!amount) return;
    const date = regisData.date;

    const newHistory: HistoryEntry = {
      id: Date.now().toString(),
      courseId: course.id,
      amount: amount,
      date: date,
    };

    const newTransaction: Transaction = {
      id: `TR-${Date.now()}`,
      type: "income",
      category: "ค่าเรียน",
      amount: amount,
      description: `ลงทะเบียนเรียน: ${course.name} (นักเรียน: ${student.name})${regisData.note.trim() ? ` [หมายเหตุ: ${regisData.note.trim()}]` : ""}`,
      date: date,
      metadata: {
        studentId: student.id,
        courseId: course.id,
        note: regisData.note.trim() || undefined,
      },
    };

    const updatedSessions = existingSession
      ? student.courseSessions.map((cs) =>
          cs.courseId === course.id
            ? {
                ...cs,
                balance: cs.balance + course.sessions,
                totalSessions:
                  (cs.totalSessions || course.sessions) + course.sessions,
              }
            : cs,
        )
      : [
          ...student.courseSessions,
          {
            courseId: course.id,
            balance: course.sessions,
            totalSessions: course.sessions,
          },
        ];

    const updatedStudents = students.map((s) =>
      s.id === regisData.studentId
        ? {
            ...s,
            courseSessions: updatedSessions,
            history: [newHistory, ...s.history],
          }
        : s,
    );

    setStudents(updatedStudents);
    setTransactions((prev) => [newTransaction, ...prev]);
    setShowRegisModal(false);
    setRegisData({
      studentId: null,
      courseId: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
    });

    // Show Success!
    setSuccessDetails({
      title: "ลงทะเบียนสำเร็จ!",
      message: `บันทึกข้อมูลการลงทะเบียนของน้อง${student.nickname} เรียบร้อยแล้ว`,
      details: [
        { label: "น้อง", value: student.nickname },
        { label: "วิชา", value: course.name },
        { label: "ยอดชำระ", value: `${amount.toLocaleString()} ฿` },
      ],
    });
    setShowSuccessModal(true);
  };

  const handleRemoveCourseRegistration = (
    studentId: number,
    courseId: number,
  ) => {
    const course = courses.find((c) => c.id === courseId);
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            courseSessions: s.courseSessions.filter(
              (cs) => cs.courseId !== courseId,
            ),
            // don't touch history since we can't easily identify which one to remove,
            // and we don't have text fields inside HistoryEntry to mark it as cancelled.
          };
        }
        return s;
      }),
    );
    // Note: We deliberately do NOT remove transactions here anymore,
    // to prevent implicitly deleting real historical income records.

    setSuccessDetails({
      title: "ยกเลิกลงทะเบียนสำเร็จ",
      message: `ยกเลิกการลงทะเบียนวิชา ${course?.name || "ไม่ทราบชื่อ"} เรียบร้อยแล้ว`,
      details: [],
    });
    setShowSuccessModal(true);
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const price = requirePositiveInt("ราคา", newCourse.price);
    if (!price) return;
    const sessions = requirePositiveInt("จำนวนครั้ง", newCourse.sessions);
    if (!sessions) return;
    const normalizedSchedule = newCourse.schedule.map((s) => ({
      day: s.day?.trim() ?? "",
      time: s.time?.trim() ?? "",
    }));
    if (normalizedSchedule.some((s) => !s.day || !s.time)) {
      setGlobalAlert({
        show: true,
        message: "กรุณากรอกวันและเวลาเรียนให้ครบทุกช่อง",
      });
      return;
    }
    const newCourseObj: Course = {
      id: Date.now(),
      name: newCourse.name,
      room: newCourse.room,
      price,
      sessions,
      schedule: normalizedSchedule,
    };
    setCourses([...courses, newCourseObj]);
    setShowAddCourseModal(false);
    setNewCourse({
      name: "",
      room: "",
      price: "",
      sessions: "10",
      schedule: [{ day: "จันทร์", time: "" }],
    });
  };

  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    if (!Number.isFinite(editingCourse.price) || editingCourse.price <= 0) {
      setGlobalAlert({
        show: true,
        message: "กรุณาระบุ ราคา เป็นตัวเลขมากกว่า 0",
      });
      return;
    }
    if (
      !Number.isFinite(editingCourse.sessions) ||
      editingCourse.sessions <= 0
    ) {
      setGlobalAlert({
        show: true,
        message: "กรุณาระบุ จำนวนครั้ง เป็นตัวเลขมากกว่า 0",
      });
      return;
    }
    if (editingCourse.schedule.some((s) => !s.day?.trim() || !s.time?.trim())) {
      setGlobalAlert({
        show: true,
        message: "กรุณากรอกวันและเวลาเรียนให้ครบทุกช่อง",
      });
      return;
    }
    setCourses((prev) =>
      prev.map((c) => (c.id === editingCourse.id ? editingCourse : c)),
    );
    setShowEditCourseModal(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = () => {
    if (!editingCourse) return;
    setGlobalPrompt({
      show: true,
      message: `คุณกำลังจะลบวิชา "${editingCourse.name}"\nนักเรียนทั้งหมดที่เรียนวิชานี้จะถูกนำประวัติการเข้าเรียนในวิชานี้ออก\nหากแน่ใจ ให้พิมพ์คำว่า "ลบวิชา" เพื่อยืนยัน`,
      expectedWord: "ลบวิชา",
      onConfirm: () => {
        setCourses((prev) => prev.filter((c) => c.id !== editingCourse.id));
        setStudents((prev) =>
          prev.map((s) => ({
            ...s,
            courseSessions: s.courseSessions.filter(
              (cs) => cs.courseId !== editingCourse.id,
            ),
            attendanceLog: s.attendanceLog.filter(
              (log) => log.courseId !== editingCourse.id,
            ),
          })),
        );
        setShowEditCourseModal(false);
        setEditingCourse(null);
        setGlobalPrompt(null);
      },
    });
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionData.category) {
      setGlobalAlert({ show: true, message: "กรุณาเลือกหมวดหมู่" });
      return;
    }
    const amount = requirePositiveInt(`ยอด${transactionData.type === 'income' ? 'รายรับ' : 'รายจ่าย'}`, transactionData.amount);
    if (!amount) return;
    const newTransaction: Transaction = {
      id: `${transactionData.type === 'income' ? 'in' : 'ex'}-${Date.now()}`,
      type: transactionData.type,
      category: transactionData.category,
      amount,
      description: transactionData.description,
      date: transactionData.date,
    };
    setTransactions([newTransaction, ...transactions]);
    setShowAddTransactionModal(false);
    setTransactionData({
      type: "expense",
      category: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const confirmDelete = () => {
    if (confirmText === "ยืนยัน" && editingStudent) {
      setStudents(students.filter((s) => s.id !== editingStudent.id));
      setShowDeleteConfirm(false);
      setShowEditStudentModal(false);
      setConfirmText("");
    }
  };

  const handleExportData = () => {
    const data = {
      students,
      courses,
      transactions,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tutorm_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsStudentMenuDropdownOpen(false);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (re: any) => {
        try {
          const data = JSON.parse(re.target.result);
          if (data.students) setStudents(normalizeStudents(data.students, data.courses || courses));
          if (data.courses) setCourses(normalizeCourses(data.courses));
          if (data.transactions) setTransactions(normalizeTransactions(data.transactions));
          setGlobalAlert({ show: true, message: "นำเข้าข้อมูลสำเร็จ" });
        } catch (err) {
          setGlobalAlert({ show: true, message: "ไฟล์ข้อมูลไม่ถูกต้อง" });
        }
      };
      reader.readAsText(file);
    };
    input.click();
    setIsStudentMenuDropdownOpen(false);
  };

  const handleDownloadTimetable = async () => {
    if (timetableRef.current) {
      const el = timetableRef.current;
      const scrollEl = el.querySelector(
        ".custom-scrollbar",
      ) as HTMLElement | null;

      const originalStyleStr = el.getAttribute("style") || "";
      const originalScrollStyleStr = scrollEl
        ? scrollEl.getAttribute("style") || ""
        : "";

      const targetWidth = scrollEl
        ? Math.max(scrollEl.scrollWidth, scrollEl.offsetWidth)
        : el.scrollWidth;
      const targetHeight = scrollEl ? scrollEl.scrollHeight : el.scrollHeight;

      if (scrollEl) {
        scrollEl.style.overflow = "visible";
        scrollEl.style.width = `${targetWidth}px`;
        scrollEl.style.maxWidth = "none";
      }

      el.style.width = scrollEl ? `${targetWidth + 40}px` : `${targetWidth}px`;
      el.style.maxWidth = "none";
      el.style.height = "auto"; // allow expansion

      const canvas = await html2canvas(el, {
        backgroundColor: "#ffffff",
        scale: 2,
        windowWidth: scrollEl ? targetWidth + 40 : targetWidth,
        width: scrollEl ? targetWidth + 40 : targetWidth,
      });

      el.setAttribute("style", originalStyleStr);
      if (scrollEl) {
        scrollEl.setAttribute("style", originalScrollStyleStr);
      }

      const link = document.createElement("a");
      link.download = `ตารางเรียน ${new Date().toISOString().split("T")[0]}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  // --- Tab Content ---
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab
            students={students}
            courses={courses}
            transactions={transactions}
          />
        );
      case "timetable":
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
      case "students":
        return (
          <StudentsTab
            searchQuery={globalSearchQuery}
            filterGrade={studentFilterGrade}
            filterBalance={studentFilterBalance}
            students={students}
            courses={courses}
            onAddStudent={() => setShowAddStudentModal(true)}
            onEditStudent={(student) => {
              setEditingStudent(student);
              setShowEditStudentModal(true);
            }}
            onRegister={(student, cid) => {
              setRegisData({
                studentId: student.id,
                courseId: cid ? cid.toString() : "",
                amount: "",
                date: new Date().toISOString().split("T")[0],
                note: "",
              });
              setShowRegisModal(true);
            }}
            onRemoveCourseRegistration={handleRemoveCourseRegistration}
          />
        );
      case "courses":
        return (
          <CoursesTab
            searchQuery={globalSearchQuery}
            courses={courses}
            students={students}
            onEditCourse={(course) => {
              setEditingCourse({ ...course });
              setShowEditCourseModal(true);
            }}
            onCheckAttendance={handleCheckAttendance}
            onUndoAttendance={handleUndoAttendance}
            onEditStudent={(student) => {
              setEditingStudent(student);
              setShowEditStudentModal(true);
            }}
            onDeleteStudent={(id) => {
              const s = students.find((st) => st.id === id);
              if (s) {
                setEditingStudent(s);
                setShowDeleteConfirm(true);
              }
            }}
            onCourseClick={(course) => {
              setSelectedCourseId(course.id);
              setShowCourseDetailsModal(true);
            }}
          />
        );
      case "finance":
        return (
          <FinanceTab
            searchQuery={globalSearchQuery}
            selectedMonth={financeFilterMonth}
            stats={stats}
            transactions={
              selectedFinanceFilter === "ทั้งหมด"
                ? transactions
                : selectedFinanceFilter === "month"
                  ? transactions.filter((t) => {
                      const now = new Date();
                      const td = new Date(t.date);
                      return (
                        td.getMonth() === now.getMonth() &&
                        td.getFullYear() === now.getFullYear()
                      );
                    })
                  : transactions.filter((t) => t.type === selectedFinanceFilter)
            }
            students={students}
            courses={courses}
          />
        );
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#f4f7fe]">
        {/* Simple background grid pattern */}
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(#e2e8f0 1.5px, transparent 1.5px), linear-gradient(90deg, #e2e8f0 1.5px, transparent 1.5px)',
               backgroundSize: '40px 40px' 
             }}>
        </div>
        
        <div className="w-full max-w-[480px] z-10 animate-in fade-in zoom-in-95 duration-700">
          <div className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white p-8 md:p-12">
            <header className="mb-10">
              <h1 className="text-[28px] font-black text-slate-800 flex items-center gap-3">
                ยินดีต้อนรับกลับมา <span className="animate-bounce">👋</span>
              </h1>
              <p className="text-slate-500 font-medium mt-1">เข้าสู่ระบบเพื่อจัดการผลงานคุณภาพของคุณ</p>
            </header>

            <div className="space-y-6">
              <p className="text-slate-500 font-medium -mt-6 mb-10 text-center">กรุณาเข้าสู่ระบบด้วยบัญชี LINE ของคุณเพื่อเริ่มใช้งาน</p>
              
              <button
                onClick={() => handleLogin({ 
                  name: "LINE User", 
                  picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop", 
                  role: "Administrator" 
                })}
                className="w-full h-[52px] md:h-[56px] bg-[#06C755] hover:bg-[#05b34c] text-white rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-[0_4px_14px_0_rgba(6,199,85,0.3)] group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]"></div>
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 10.3c0-5.7-5.4-10.3-12-10.3S0 4.6 0 10.3c0 5.1 4.3 9.3 10.1 10.1.4.1.9.4 1 .9l.4 2.5s.1.8.6.6c.4-.2 2.6-1.5 3.6-2.5 4.8-.8 8.3-4.9 8.3-9.3z" />
                  </svg>
                </div>
                <span className="text-[16px] font-black tracking-wide">เข้าสู่ระบบด้วย LINE</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[#00c984] text-[13px] font-bold mt-4">
                <div className="w-5 h-5 rounded-full bg-[#00c984]/10 flex items-center justify-center">
                  <ShieldCheck size={14} />
                </div>
                เชื่อมต่อปลอดภัยผ่านระบบ LINE Official
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-slate-500 font-bold">
                พบปัญหาการใช้งาน? <button type="button" className="text-blue-600 hover:underline">ติดต่อ IT Admin</button>
              </p>
            </div>
          </div>
          
          <footer className="mt-10 text-center text-slate-400 text-sm font-medium">
            <p>© 2569 BUGpairoj Group · พัฒนาโดย AI Pairoj</p>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen font-sans text-slate-900 overflow-hidden bg-[#F5F5F9]">
      <div className="flex w-full h-full overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarHovered={isSidebarHovered}
          setIsSidebarHovered={setIsSidebarHovered}
          userProfile={userProfile}
          onLogout={() => {
            setIsLoggedIn(false);
            setUserProfile(null);
            localStorage.removeItem("tutorm.auth");
          }}
        />

        {/* Removed Mobile Menu Overlay since we use bottom navigation */}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden pb-[72px] lg:pb-0 relative">
          <header className="px-4 lg:px-10 pt-4 flex flex-col shrink-0 gap-3">
            {/* Mobile Header: Title + Actions */}
            <div className="lg:hidden flex items-center justify-between px-1 mb-1">
              {isSearchOpen ? (
                <div className="flex items-center w-full bg-white rounded-full border border-slate-200 px-3 py-1.5 shadow-sm">
                  <Search size={18} className="text-slate-400 shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="ค้นหา (ชื่อ, วิชา, การเงิน)..."
                    value={globalSearchQuery}
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    className="w-full border-none outline-none bg-transparent text-slate-700 placeholder-slate-400 px-2 text-sm"
                  />
                  <button onClick={() => setIsSearchOpen(false)} className="text-slate-400 p-1 shrink-0 rounded-full hover:bg-slate-100">
                     <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-[22px] font-black text-slate-800 tracking-tight">
                    {activeTab === "dashboard" ? "แดชบอร์ด" : 
                     activeTab === "timetable" ? "ตารางเรียน" : 
                     activeTab === "students" ? "นักเรียน" : 
                     activeTab === "courses" ? "วิชาเรียน" : 
                     activeTab === "finance" ? "การเงิน" : ""}
                  </h1>
                  <div className="flex items-center gap-2">
                    {/* Search Icon */}
                    <button 
                      onClick={() => setIsSearchOpen(true)}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm"
                    >
                      <Search size={18} />
                    </button>
                    
                    {/* Add Button */}
                    {(activeTab === "students" ||
                      activeTab === "courses" ||
                      activeTab === "finance") && (
                      <button
                        onClick={() => {
                          if (activeTab === "students")
                            setShowAddStudentModal(true);
                          if (activeTab === "courses") setShowAddCourseModal(true);
                          if (activeTab === "finance") setShowAddTransactionModal(true);
                        }}
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-[#696cff] text-white shadow-sm shrink-0"
                      >
                        <Plus size={20} className="stroke-[2.5px]" />
                      </button>
                    )}

                    {/* Profile Button */}
                    <button
                      onClick={() => setShowProfileModal(true)}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-50 border border-slate-200 text-indigo-600 shadow-sm shrink-0 overflow-hidden"
                    >
                      {userProfile?.picture ? (
                        <img src={userProfile.picture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User size={18} />
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:flex w-full bg-white rounded-2xl shadow-sm border border-slate-100 items-center justify-between px-4 py-2 relative z-50">
              <div className="flex items-center gap-2 flex-1 relative">
                <Search size={20} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="ค้นหาข้อมูล (ชื่อนักเรียน, วิชา, รายการเงิน)..."
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  className="w-full border-none outline-none bg-transparent text-slate-700 placeholder-slate-400 py-1 min-w-[100px]"
                />

                {/* Student Filters */}
                {activeTab === "students" && (
                  <div className="hidden lg:flex items-center gap-2 ml-2 shrink-0">
                    <select
                      value={studentFilterGrade}
                      onChange={(e) => setStudentFilterGrade(e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:border-indigo-400 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="all">ระดับชั้น (ทั้งหมด)</option>
                      {availableGrades.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>

                    <select
                      value={studentFilterBalance}
                      onChange={(e) => setStudentFilterBalance(e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:border-indigo-400 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="all">สถานะ (ทั้งหมด)</option>
                      <option value="empty">ยังไม่ได้ลงเรียน (0 คลาส)</option>
                      <option value="low">ใกล้หมด (&lt; 25%)</option>
                      <option value="normal">กำลังเรียน</option>
                      <option value="none">ไม่มีรายวิชา</option>
                    </select>

                    <div className="relative group/menu">
                      <button 
                        onClick={() => setIsStudentMenuDropdownOpen(!isStudentMenuDropdownOpen)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium relative z-50">
                        <Download size={14} />
                        นำออก/นำเข้า
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isStudentMenuDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isStudentMenuDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-[40]" onClick={() => setIsStudentMenuDropdownOpen(false)} />
                          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-[50] animate-in fade-in slide-in-from-top-2 duration-200">
                            <button
                              onClick={handleImportData}
                              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                            >
                              <Upload size={16} className="text-indigo-500" />
                              นำเข้าข้อมูล
                            </button>
                            <button
                              onClick={handleExportData}
                              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                            >
                              <Download size={16} className="text-sky-500" />
                              ส่งออกข้อมูล (Backup)
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Finance Filter */}
                {activeTab === "finance" && (
                  <div className="hidden lg:block relative ml-2 shrink-0">
                    <button
                      onClick={() =>
                        setIsFinanceMonthDropdownOpen(
                          !isFinanceMonthDropdownOpen,
                        )
                      }
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:border-indigo-400 focus:bg-white transition-all cursor-pointer flex items-center justify-between gap-2 min-w-[140px]"
                    >
                      {financeFilterMonth === "all"
                        ? "รายการทั้งหมด"
                        : financeFilterMonth}
                      <ChevronDown size={14} />
                    </button>
                    {isFinanceMonthDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-[40]"
                          onClick={() => setIsFinanceMonthDropdownOpen(false)}
                        />
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-[50]">
                          <button
                            onClick={() => {
                              setFinanceFilterMonth("all");
                              setIsFinanceMonthDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-black flex items-center justify-between ${financeFilterMonth === "all" ? "bg-indigo-50 text-indigo-600" : "text-slate-700 hover:bg-slate-50"}`}
                          >
                            รายการทั้งหมด
                          </button>
                          <div className="max-h-[200px] overflow-y-auto custom-scrollbar mt-1">
                            {availableFinanceMonths.map((m) => (
                              <button
                                key={m}
                                onClick={() => {
                                  setFinanceFilterMonth(m);
                                  setIsFinanceMonthDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-black flex items-center justify-between mt-1 ${financeFilterMonth === m ? "bg-indigo-50 text-indigo-600" : "text-slate-700 hover:bg-slate-50"}`}
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 sm:gap-2 ml-4">
                {(activeTab === "students" ||
                  activeTab === "courses" ||
                  activeTab === "finance") && (
                  <button
                    onClick={() => {
                      if (activeTab === "students")
                        setShowAddStudentModal(true);
                      if (activeTab === "courses") setShowAddCourseModal(true);
                      if (activeTab === "finance") setShowAddTransactionModal(true);
                    }}
                    className="flex items-center justify-center w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-md bg-[#696cff] hover:bg-[#5f61e6] text-white font-medium transition-all shadow-sm shrink-0"
                  >
                    <Plus size={18} className="stroke-[2.5px]" />
                    <span className="hidden lg:inline-block ml-1.5 text-sm font-semibold text-white">
                      {activeTab === "students"
                        ? "เพิ่มนักเรียน"
                        : activeTab === "courses"
                          ? "เพิ่มวิชาเรียน"
                          : "เพิ่มรายการ"}
                    </span>
                  </button>
                )}

                {/* Profile Button */}
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden shrink-0 ml-1 border-2 border-white shadow-sm hover:ring-2 hover:ring-indigo-100 transition-all"
                >
                  {userProfile?.picture ? (
                    <img
                      src={userProfile.picture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={16} className="text-indigo-600" />
                  )}
                </button>
              </div>
            </div>
          </header>

          <div
            className={`flex-1 min-h-0 px-2 sm:px-4 lg:px-10 pb-0 sm:pb-4 lg:pb-10 pt-4 lg:pt-6 overflow-hidden`}
          >
            <div className="w-full h-full max-w-[1700px] mx-auto flex flex-col min-h-0 relative">
              {renderTabContent()}
            </div>
          </div>

          {/* Bottom Navigation for Mobile */}
          <nav
            className="lg:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-200/50 flex items-center justify-around pt-2 px-2 z-[90] shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]"
            style={{
              paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))",
            }}
          >
            {[
              { id: "dashboard", label: "แดชบอร์ด", icon: LayoutGrid },
              { id: "timetable", label: "ตาราง", icon: Calendar },
              { id: "students", label: "นักเรียน", icon: Users },
              { id: "courses", label: "วิชา", icon: BookOpen },
              { id: "finance", label: "การเงิน", icon: PieChart },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center p-2 min-w-[64px] rounded-2xl transition-all ${activeTab === item.id ? "text-blue-600" : "text-slate-500 hover:text-slate-900"}`}
              >
                <item.icon
                  size={22}
                  className={
                    activeTab === item.id ? "stroke-[2.5px]" : "stroke-[2px]"
                  }
                />
                <span
                  className={`text-[10px] sm:text-xs mt-1 uppercase ${activeTab === item.id ? "font-black" : "font-medium"}`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
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
        onClose={() => {
          setShowDeleteConfirm(false);
          setConfirmText("");
        }}
        confirmText={confirmText}
        setConfirmText={setConfirmText}
        onConfirm={confirmDelete}
      />

      <AddTransactionModal
        show={showAddTransactionModal}
        onClose={() => setShowAddTransactionModal(false)}
        transactionData={transactionData}
        setTransactionData={setTransactionData}
        onSubmit={handleSaveTransaction}
      />

      <ProfileModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userProfile={userProfile}
      />

      <TimetableCourseDetailsModal
        show={showCourseDetailsModal}
        onClose={() => {
          setShowCourseDetailsModal(false);
          setSelectedCourseId(null);
        }}
        course={selectedCourse as any}
        onOpenCoursePage={(courseId) => {
          setActiveTab("courses");
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
        onClose={() => {
          setShowAttendanceModal(false);
          setSelectedCourseId(null);
        }}
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
        onClose={() => setGlobalAlert({ show: false, message: "" })}
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
