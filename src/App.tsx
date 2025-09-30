import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage/HomePage";
import EditorPage from "./pages/Editorpage/EditorPage";
import SigninPage from "./pages/SigninPage/SigninPage";
import SignupPage from "./pages/SignupScreen/SignupScreen";
import OAuthSuccessPage from "./pages/OAuthSuccess/OAuthSuccess";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/editor" 
            element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth/success" element={<OAuthSuccessPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
