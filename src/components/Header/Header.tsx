import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import { useAuth } from "../../hooks/useAuth";
import { BiCodeAlt } from "react-icons/bi";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getAvatarDisplay = () => {
    if (user?.profilePicture) {
      return user.profilePicture;
    }
    return user?.name?.charAt(0).toUpperCase() || 'U';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
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

      {/* Auth Section */}
      <div className="flex items-center gap-3 xl:absolute xl:right-0 xl:mr-20">
        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold border-2 border-gray-200">
                  {getAvatarDisplay()}
                </div>
              )}
              <svg
                className={`w-4 h-4 text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {getAvatarDisplay()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>My Courses</span>
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Progress</span>
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-2"></div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
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
