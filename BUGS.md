# System Bugs & Enhancements Status

## ✅ Bugs Fixed

1. **Timetable Array Squishing `(TimetableTab.tsx)`**
   - **Issue:** The cards inside the timetable rows were excessively squished when there were many columns or row sizes shrank, causing content overlapping, unwanted nested scrollbars internally, and illegibility.
   - **Fix:** Implemented a `min-h-[120px]` on the day rows to prevent shrinking beyond a certain limit. Removed the internal `overflow-y-auto` from cards. Truncated titles to `line-clamp-2` so they don't break the layout.

2. **Scrollbar Overflow `(App.tsx, StudentsTab.tsx, FinanceTab.tsx, TimetableTab.tsx)`**
   - **Issue:** The app was constantly showing horizontal scrollbars when viewing tables and multiple nested vertical scrollbars.
   - **Fix:** Switched main App layout to `overflow-hidden` so bounding box constraints are strictly applied. Only tables (and list wrappers) now contain `.custom-scrollbar` with vertical scroll unlocked `overflow-y-auto`, hiding horizontal scroll.

3. **Students Table Syntax Errors `(StudentsTab.tsx)`**
   - **Issue:** Replaced `tr` incorrectly, leaving unbalanced `<tr>`, `<td>`, and `<table>` syntax which caused React crashes/render failures.
   - **Fix:** Safely replaced and re-aligned tags, reinstated empty states (`students.length === 0`), and added the missing `Users` lucide-react icon import.

4. **Time Parsing Logic Vulnerability `(TimetableTab.tsx)`**
   - **Issue:** Typing time like `08.00-10.00` caused `TimetableTab.tsx`'s parsing logic (`timeStr.split(':')`) to break and calculate `width/left` positions incorrectly because it couldn't compute decimals correctly.
   - **Fix:** Added fallback logic to replace strings `.` with `:` (`replace('.', ':')`) and correctly separate minutes from hours to map grid scales perfectly, mirroring the updated check in `RegisterCourseModal.tsx`.

5. **Delete Course Feature Missing `(App.tsx, EditCourseModal.tsx)`**
   - **Issue:** Users could edit courses but there was no explicit delete feature. 
   - **Fix:** Added `handleDeleteCourse` inside `App.tsx` and mapped it to a "Delete" button inside `EditCourseModal.tsx`. Included a secondary confirmation prompt. Nested array constraints (`CourseSession` and `attendanceLog`) in the `students` array are orphaned safely.

6. **Transactions Relationship Linking Loose Constraint `(App.tsx, FinanceTab.tsx, data.ts)`**
   - **Issue:** Transactions globally tracked by String descriptor lacked strong constraints to the course/student ids.
   - **Fix:** Added `metadata: { studentId: number; courseId: number }` support to `Transaction` type. Refactored `INITIAL_TRANSACTIONS`, `normalizeTransactions()`, and `FinanceTab.tsx` to display real-time formatted descriptions based on active states, retaining backward compatibility for unlinked expenses.

7. **Window Resizing Canvas Logic `(App.tsx)`**
   - **Issue:** `html2canvas` exported PNGs cut off hidden sections due to `overflow-x-auto` bounding boxes.
   - **Fix:** Enhanced `handleDownloadTimetable` logic to temporarily unconstrain DOM elements to their full `scrollWidth` and `scrollHeight`, allowing `html2canvas` to perform complete uncropped captures without breaking the view. Includes safe fallback restoration.

## 🚧 Pending Bugs / Enhancements

*(No pending bugs currently)*
