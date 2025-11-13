import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./routes";
import HomePage from "./pages/HomePage/HomePage";
import EditorPage from "./pages/Editorpage/EditorPage";
import SigninPage from "./pages/SigninPage/SigninPage";
import SignupPage from "./pages/SignupScreen/SignupScreen";
import OAuthSuccessPage from "./pages/OAuthSuccess/OAuthSuccess";
import EmailVerificationPage from "./pages/EmailVerificationPage/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage";
import Layout from "./pages/Layout";
import TutorialsPage from "./pages/TutorialsPage/TutorialsPage";
import LanguageTutorialsPage from "./pages/TutorialsPage/LanguageTutorialsPage";
import TutorialDetailPage from "./pages/TutorialsPage/TutorialDetailPage";
import CourseDetailPage from "./pages/TutorialsPage/CourseDetailPage";
import CoursePage from "./pages/CoursePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import DemoAdminPortal from "./pages/DemoAdminPortal/DemoAdminPortal";
import AboutPage from "./pages/AboutPage/AboutPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/editor"
              element={
                <ProtectedRoute>
                  <EditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tutorials"
              element={
                <ProtectedRoute>
                  <TutorialsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tutorials/:language"
              element={
                <ProtectedRoute>
                  <LanguageTutorialsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tutorials/:language/:tutorialId"
              element={
                <ProtectedRoute>
                  <TutorialDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <TutorialsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId"
              element={
                <ProtectedRoute>
                  <CourseDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId"
              element={
                <ProtectedRoute>
                  <CoursePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <DemoAdminPortal />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/success" element={<OAuthSuccessPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
