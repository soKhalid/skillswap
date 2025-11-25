import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import logo from '../../1.png';

const Navbar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setProfileMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={currentUser ? "/dashboard" : "/"} className="flex items-center space-x-3">
            <img src={logo} alt="SkillSwap" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              SkillSwap
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {currentUser ? (
              <>
                <Link to="/discover" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Discover
                </Link>
                <Link to="/my-sessions" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  My Sessions
                </Link>
                <Link to="/messages" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Messages
                </Link>
                <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Dashboard
                </Link>

                {/* Skill Points Display */}
                <div className="flex items-center space-x-1 bg-accent-100 dark:bg-accent-900 px-3 py-1 rounded-full">
                  <span className="text-accent-600 dark:text-accent-300 font-semibold">
                    {userProfile?.skillPoints || 0}
                  </span>
                  <span className="text-accent-500 dark:text-accent-400 text-sm">SP</span>
                </div>

                {/* Notifications */}
                <Link to="/notifications" className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                  <FiBell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full"></span>
                </Link>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    {userProfile?.photoURL ? (
                      <img
                        src={userProfile.photoURL}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                        {currentUser?.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-200 dark:border-gray-700">
                      <Link
                        to="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FiUser size={16} />
                        <span>My Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left text-red-600 dark:text-red-400"
                      >
                        <FiLogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/about" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  About
                </Link>
                <Link to="/pricing" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Pricing
                </Link>
                <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            {currentUser ? (
              <div className="flex flex-col space-y-3">
                <Link to="/discover" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-200">
                  Discover
                </Link>
                <Link to="/my-sessions" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-200">
                  My Sessions
                </Link>
                <Link to="/messages" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-200">
                  Messages
                </Link>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-200">
                  Dashboard
                </Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-200">
                  My Profile
                </Link>
                <button onClick={handleLogout} className="text-red-600 dark:text-red-400 text-left">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-200">
                  About
                </Link>
                <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-200">
                  Pricing
                </Link>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-200">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="btn-primary inline-block text-center">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
