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
import TutorialsDetailPage from "./pages/TutorialsPage/Components/TutorialsDetailPage";
import CourseLearningPage from "./pages/CourseLearningPage/CourseLearningPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import CreatorApplicationPage from "./pages/CreatorApplicationPage/CreatorApplicationPage";
import AdminPortal from "./pages/AdminPortal/AdminPortal";
import CreatorPortal from "./pages/CreatorPortal/CreatorPortal";
import AboutPage from "./pages/AboutPage/AboutPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import SubscriptionPage from "./pages/SubscriptionPage/SubscriptionPage";
import SubscriptionSuccess from "./pages/SubscriptionSuccess/SubscriptionSuccess";
import SubscriptionCancelled from "./pages/SubscriptionCancelled/SubscriptionCancelled";
import AITutorialSuccessNotification from "./components/AITutorialSuccessNotification/AITutorialSuccessNotification";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AITutorialSuccessNotification />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
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
                  <TutorialsDetailPage />
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
                  <CourseLearningPage />
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
              path="/creator-application"
              element={
                <ProtectedRoute>
                  <CreatorApplicationPage />
                </ProtectedRoute>
              }
            />
          </Route>
          {/* Creator routes without Layout (no navbar) */}
          <Route
            path="/creator/*"
            element={
              <ProtectedRoute requireCreator={true}>
                <CreatorPortal />
              </ProtectedRoute>
            }
          />
          
          {/* Admin routes without Layout (no navbar) */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPortal />
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/success" element={<OAuthSuccessPage />} />
          <Route path="/upgrade" element={<SubscriptionPage />} />
          <Route
            path="/subscription-success"
            element={
              <ProtectedRoute>
                <SubscriptionSuccess />
              </ProtectedRoute>
            }
          />
          <Route path="/subscription-cancelled" element={<SubscriptionCancelled />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
