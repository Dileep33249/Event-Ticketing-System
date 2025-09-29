import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Signup from "./components/Signup";
import Login from "./components/Login";
import HomePage from "./components/Home";
import AboutUs from "./components/AboutUs";
import Events from "./components/Events";
import PublicEvents from "./components/PublicEvents";
import AnotherPublicEvents from "./components/AnotherPublicEvents";
import Profile from "./components/Profile";
import MyBookings from "./components/MyBookings";
import AdminDashboard from "./components/AdminDashboard";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import EmailVerification from "./components/auth/EmailVerification";
import Logout from "./components/auth/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";
import Layout from "./components/Layout";
import MyEvents from "./components/PublicEvents";
import SearchEvents from "./components/SearchEvents";
import ExploreEvents from "./components/ExploreEvents";
import EventDetails from "./components/EventDetails";

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/HomePage" /> : <Navigate to="/Login" />} />
      {/* Auth */}
      <Route path="/Login" element={<AuthRedirect><Login /></AuthRedirect>} />
      <Route path="/Signup" element={<AuthRedirect><Signup /></AuthRedirect>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<EmailVerification />} />
      <Route path="/Logout" element={<Logout />} />

      {/* App layout with navbar */}
      <Route element={<Layout />}>
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/Events" element={<ProtectedRoute roles={["Agent", "Admin"]}><Events /></ProtectedRoute>} />
        <Route path="/PublicEvents" element={<MyEvents />} />
        <Route path="/SearchEvents" element={<SearchEvents />} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/AnotherPublicEvents" element={<AnotherPublicEvents />} />
        <Route path="/admin" element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/ExploreEvents" element={<ExploreEvents />} />
        <Route path="/event/:id" element={<EventDetails />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
