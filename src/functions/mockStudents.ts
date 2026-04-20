import { Student } from './types';

// ข้อมูลชื่อนามสกุลจำลองสำหรับสร้างนักเรียน
const firstNamesM = ['สมชาย', 'กล้าหาญ', 'วิชาญ', 'ปิติ', 'วีระ', 'ดนัย', 'สุนทร', 'ธนา', 'มงคล', 'สุชาติ', 'ประเสริฐ', 'อนุชา', 'วรวุฒิ', 'ณัฐพล', 'อาทิตย์', 'เกรียงไกร', 'พงศกร', 'ธนทัต', 'ภูริช', 'อชิระ'];
const firstNamesF = ['สมหญิง', 'ใจดี', 'มานี', 'ชูใจ', 'นารี', 'กฤษณา', 'ปราณี', 'สุดา', 'นิภา', 'พิมพา', 'ศิริพร', 'กานดา', 'จันทร์เพ็ญ', 'สมพร', 'อารยา', 'ณิชา', 'พิมพ์ผกา', 'วรรณภา', 'สุพรรษา', 'กมลเนตร'];
const lastNames = ['รักเกียรติ', 'มีทรัพย์', 'ใจบุญ', 'พูนสวัสดิ์', 'เจริญรุ่ง', 'มั่นคง', 'ดีเสมอ', 'ทองแท้', 'งามขำ', 'เพชรกล้า', 'สุขสันต์', 'บุญมา', 'อุดม', 'สว่าง', 'พิทักษ์', 'ทวีทรัพย์', 'สิงห์คำ', 'วงศ์สว่าง', 'ศิริ', 'พงษ์ศักดิ์'];
const nicknamesM = ['ชาย', 'กล้า', 'วิ', 'ติ', 'วี', 'ดล', 'ซัน', 'นัท', 'มง', 'ชาติ', 'เสริฐ', 'นุ', 'วุฒิ', 'เจ', 'อาร์ท', 'เกรียง', 'พี', 'ทัต', 'ภู', 'ชิ'];
const nicknamesF = ['หญิง', 'ดี', 'นี', 'ใจ', 'รี', 'กาน', 'ณี', 'ดา', 'ภา', 'พิม', 'พร', 'นิว', 'จันทร์', 'แอน', 'อาร์', 'ณิ', 'ผกา', 'วรรณ', 'ษา', 'อาย'];
const grades = ['ป.4', 'ป.5', 'ป.6', 'ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6'];

// ฟังก์ชันสำหรับสุ่มหยิบของใน Array
const getRandom = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
// ฟังก์ชันสำหรับสุ่มเลขตามช่วงที่ต้องการ
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// สร้างข้อมูลจำลอง 100 คน
export const MOCK_100_STUDENTS: Student[] = Array.from({ length: 100 }).map((_, index) => {
  const id = index + 1000; // เริ่มที่ 1000 จะได้ไม่ซ้ำกับของเดิม
  const isMale = Math.random() > 0.5;
  const prefix = isMale ? 'เด็กชาย' : 'เด็กหญิง';
  const firstName = isMale ? getRandom(firstNamesM) : getRandom(firstNamesF);
  const nickname = isMale ? getRandom(nicknamesM) : getRandom(nicknamesF);
  const lastName = getRandom(lastNames);
  const grade = getRandom(grades);
  
  // สุ่มเบอร์โทร
  const phone = '08' + getRandomInt(10000000, 99999999).toString();

  // สุ่มลงคอร์สเรียน (บางคนลง 1 คอร์ส, บางคนอาจจะลง 2 คอร์ส หรือยังไม่ลงเลย)
  const courseCount = getRandomInt(0, 2);
  const courseSessions = [];
  
  if (courseCount > 0) {
    courseSessions.push({ courseId: 1, balance: getRandomInt(1, 10), totalSessions: 10 });
    if (courseCount > 1) {
      courseSessions.push({ courseId: 2, balance: getRandomInt(1, 10), totalSessions: 10 });
    }
  }

  return {
    id,
    name: `${firstName} ${lastName}`,
    prefix,
    nickname,
    grade,
    parentPhone: phone,
    courseSessions,
    attendanceLog: [],
    history: []
  };
});
