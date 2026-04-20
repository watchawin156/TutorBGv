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

## 🚧 Pending Bugs / Enhancements

1. **Delete Course Feature Missing**
   - **Issue:** Users can currently edit courses but there is no explicit `onDeleteCourse` function inside `App.tsx` or button inside `EditCourseModal.tsx`. 
   - **Impact:** Once a course is created, it persists forever.
   - **Required Fix:** A "Delete" button should be safely added to the Edit Course Modal with a secondary confirmation modal. When a course is deleted, it should also safely orphan/delete nested array constraints (`CourseSession`) in the `students` array to avoid phantom entries.

2. **Transactions Relationship Linking Loose Constraint**
   - **Issue:** When a student is registered or pays, the global History array is linked by `Date.now()`, but the Transactions `Transactions[]` array matches students/courses roughly only over a String descriptor `(นักเรียน: ${student.name})`.
   - **Impact:** If a user renames a student/course, the Finance Tab logs won't reflect the new name, causing minor UX discrepancy.
   - **Suggested Fix:** Change `Transaction` type to include metadata object `metadata?: { studentId: number; courseId: number }` so frontend rendering can dynamically format names.

3. **Window Resizing Canvas Logic**
   - **Issue:** `html2canvas` is being used to export the Timetable as a PNG. On smaller mobile screens, the `overflow-x-auto` might cut off hidden sections of the table during render.
   - **Suggested Fix:** Temporarily scale up the DOM element to its full `scrollWidth` / `scrollHeight` during `html2canvas` captures to ensure no cropped data.
