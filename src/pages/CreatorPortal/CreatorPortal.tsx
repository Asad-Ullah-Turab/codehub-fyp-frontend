import { Navigate, Route, Routes } from "react-router-dom";
import CreatorCoursesDashboard from "./Components/CreatorCoursesDashboard";
import CreatorCourseWorkspace from "./Components/CreatorCourseWorkspace";
import CreatorCourseOverview from "./Components/CreatorCourseOverview";
import CreatorLessonEditor from "./Components/CreatorLessonEditor";
import CreatorQuizEditor from "./Components/CreatorQuizEditor";
import CreatorCourseReviews from "./Components/CreatorCourseReviews";
import CreatorEarnings from "./Components/CreatorEarnings";
import "../AdminPortal/admin-theme.css";

export default function CreatorPortal() {
  return (
    <Routes>
      <Route index element={<Navigate to="courses" replace />} />
      <Route path="courses" element={<CreatorCoursesDashboard />} />
      <Route path="reviews" element={<CreatorCourseReviews />} />
      <Route path="earnings" element={<CreatorEarnings />} />
      <Route path="courses/:courseId" element={<CreatorCourseWorkspace />}>
        <Route index element={<CreatorCourseOverview />} />
        <Route path="sections/:sectionId/lessons/new" element={<CreatorLessonEditor />} />
        <Route path="sections/:sectionId/lessons/:lessonId" element={<CreatorLessonEditor />} />
        <Route path="sections/:sectionId/quiz" element={<CreatorQuizEditor />} />
        <Route path="sections/:sectionId/quiz/:quizId" element={<CreatorQuizEditor />} />
      </Route>
      <Route path="*" element={<Navigate to="courses" replace />} />
    </Routes>
  );
}