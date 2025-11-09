import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { BiCodeAlt } from "react-icons/bi";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <nav className="flex items-center justify-between px-10 xl:justify-center py-7 bg-white w-screen xl:relative">
      <div className="flex items-center xl:absolute xl:left-0 xl:ml-20">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
            <BiCodeAlt />
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-20 font-medium text-lg">
        <Link to="/" className="text-gray-700 hover:text-gray-900">
          Home
        </Link>
        <Link to="/about" className="text-gray-700 hover:text-gray-900">
          About
        </Link>
        <Link to="/tutorials" className="text-gray-700 hover:text-gray-900">
          Tutorials
        </Link>
        <Link to="/editor" className="text-gray-700 hover:text-gray-900 ">
          Code Editor
        </Link>
        <Link to="/contact" className="text-gray-700 hover:text-gray-900">
          Contact Us
        </Link>
        {isAuthenticated && user?.role === "admin" && (
          <Link to="/admin" className="text-gray-700 hover:text-gray-900">
            Admin Dashboard
          </Link>
        )}
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3 xl:absolute xl:right-0 xl:mr-20">
        {isAuthenticated ? (
          <>
            <span className="text-gray-800 font-medium">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-6 py-2 border-2 border-gray-800 text-gray-800 rounded hover:bg-gray-800 hover:text-white transition-colors font-medium"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/signin"
              className="px-6 py-[7px] border-2 border-gray-800 text-gray-800 rounded hover:bg-gray-800 hover:text-white transition-colors font-medium"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-6 py-[9px] bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors font-medium"
            >
              Join For Free
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
