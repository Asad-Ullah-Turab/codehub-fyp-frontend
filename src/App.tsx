import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage/HomePage";
import EditorPage from "./pages/Editorpage/EditorPage";
import SigninPage from "./pages/SigninPage/SigninPage";
import SignupPage from "./pages/SignupScreen/SignupScreen";
import OAuthSuccessPage from "./pages/OAuthSuccess/OAuthSuccess";
import EmailVerificationPage from "./pages/EmailVerificationPage/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage";
import Layout from "./pages/Layout";
import TutorialsPage from "./pages/DemoTutorialsPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route
              path="/editor"
              element={
                // <ProtectedRoute>
                <EditorPage />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/tutorials/*"
              element={
                <ProtectedRoute>
                  <TutorialsPage />
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
