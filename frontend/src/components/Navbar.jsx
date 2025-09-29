import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from './Toast';
import Register from './Register';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userName, role, logout } = useAuth();
  const [register, setRegister] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
      navigate('/Login');
    }, 2000);
  };

  const handleOpenRegister = () => {
    setRegister(true);
  };

  const handleProfile = () => {
    navigate('/profile');
    setMobileMenuOpen(false);
  };

  const handleAddEvent = () => {
    navigate('/Events');
    setMobileMenuOpen(false);
  };

  const handleExploreEvents = () => {
    navigate('/ExploreEvents');
    setMobileMenuOpen(false);
  };

  const handleFindEvents = () => {
    navigate('/PublicEvents');
    setMobileMenuOpen(false);
  };

  const handleAbout = () => {
    navigate('/about');
    setMobileMenuOpen(false);
  };

  const handleHome = () => {
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navigationLinks = [
    { name: 'Find Events', path: '/PublicEvents', icon: 'search', handler: handleFindEvents },
    { name: 'About', path: '/about', icon: 'info', handler: handleAbout },
  ];

  const getIcon = (iconName) => {
    const icons = {
      search: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      info: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      user: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      add: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      explore: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      logout: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      bell: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12 7H4.828z" />
        </svg>
      ),
      menu: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      close: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    };
    return icons[iconName] || null;
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center text-xl font-bold text-gray-900 cursor-pointer group"
              onClick={handleHome}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className="group-hover:text-blue-600 transition-colors duration-200">FestiFly</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={link.handler}
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center space-x-2 group"
                >
                  {getIcon(link.icon)}
                  <span>{link.name}</span>
                </button>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Get Notified Button */}
              <button
                onClick={handleOpenRegister}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg transform hover:scale-105"
              >
                {getIcon('bell')}
                <span>Get Notified</span>
              </button>

              {/* User Actions */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {/* User Info */}
                  <div className="flex items-center space-x-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border border-gray-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {userName ? userName.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Hi, {userName}</span>
                      <span className="text-xs text-gray-500 capitalize">{role}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleProfile}
                      className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors duration-200"
                      title="Profile"
                    >
                      {getIcon('user')}
                    </button>

                    {(role === "Agent" || role === "Admin") ? (
                      <button
                        onClick={handleAddEvent}
                        className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 shadow-sm"
                        title="Add Event"
                      >
                        {getIcon('add')}
                      </button>
                    ) : (
                      <button
                        onClick={handleExploreEvents}
                        className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 shadow-sm"
                        title="Explore Events"
                      >
                        {getIcon('explore')}
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors duration-200"
                      title="Logout"
                    >
                      {getIcon('logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate('/Login')}
                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/Signup')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                {mobileMenuOpen ? getIcon('close') : getIcon('menu')}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {/* Navigation Links */}
              {navigationLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={link.handler}
                  className="w-full flex items-center space-x-3 text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
                >
                  {getIcon(link.icon)}
                  <span>{link.name}</span>
                </button>
              ))}

              <div className="border-t border-gray-200 pt-4">
                {/* Get Notified Button */}
                <button
                  onClick={handleOpenRegister}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg mb-4"
                >
                  {getIcon('bell')}
                  <span>Get Notified</span>
                </button>

                {/* User Actions */}
                {isAuthenticated ? (
                  <div className="space-y-3">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {userName ? userName.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Hi, {userName}</div>
                        <div className="text-sm text-gray-500 capitalize">{role}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleProfile}
                        className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-colors duration-200"
                      >
                        {getIcon('user')}
                        <span>Profile</span>
                      </button>

                      {(role === "Agent" || role === "Admin") ? (
                        <button
                          onClick={handleAddEvent}
                          className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors duration-200"
                        >
                          {getIcon('add')}
                          <span>Add Event</span>
                        </button>
                      ) : (
                        <button
                          onClick={handleExploreEvents}
                          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-200"
                        >
                          {getIcon('explore')}
                          <span>Explore</span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-lg transition-colors duration-200"
                    >
                      {getIcon('logout')}
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/Login')}
                      className="w-full text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => navigate('/Signup')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-200"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Toast and Register Modal */}
      {toastVisible && <Toast message="Logged out successfully!" onClose={() => setToastVisible(false)} />}
      {register && <Register />}
    </div>
  );
};

export default Navbar;