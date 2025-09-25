import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import DisputeForm from "./components/DisputeForm";
import AdminDashboard from "./components/AdminDashboard";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import "./App.css";

interface NavigationProps {
  onNavigate: (path: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    onNavigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    onNavigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="app-navigation">
      <div className="nav-container">
        <div
          className="nav-brand"
          onClick={() => onNavigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img src="/Logo.png" alt="AI Judge" className="nav-logo" />
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links desktop-nav">
          <a
            href="/dispute"
            onClick={(e) => handleNavClick(e, "/dispute")}
            className={`nav-link ${
              location.pathname === "/dispute" ? "active" : ""
            }`}
          >
            Submit Dispute
          </a>
          <a
            href="/admin"
            onClick={(e) => handleNavClick(e, "/admin")}
            className={`nav-link ${
              location.pathname === "/admin" ? "active" : ""
            }`}
          >
            Admin Dashboard
          </a>

          {isAuthenticated ? (
            <>
              <button
                onClick={handleLogout}
                className="nav-link nav-logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                onClick={(e) => handleNavClick(e, "/login")}
                className={`nav-link ${
                  location.pathname === "/login" ? "active" : ""
                }`}
              >
                Login
              </a>
              <a
                href="/signup"
                onClick={(e) => handleNavClick(e, "/signup")}
                className={`nav-link nav-signup ${
                  location.pathname === "/signup" ? "active" : ""
                }`}
              >
                Sign Up
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span
            className={`hamburger-line ${isMobileMenuOpen ? "open" : ""}`}
          ></span>
          <span
            className={`hamburger-line ${isMobileMenuOpen ? "open" : ""}`}
          ></span>
          <span
            className={`hamburger-line ${isMobileMenuOpen ? "open" : ""}`}
          ></span>
        </button>

        {/* Mobile Navigation Dropdown */}
        <div className={`mobile-nav ${isMobileMenuOpen ? "open" : ""}`}>
          <div className="mobile-nav-content">
            <a
              href="/dispute"
              onClick={(e) => handleNavClick(e, "/dispute")}
              className={`mobile-nav-link ${
                location.pathname === "/dispute" ? "active" : ""
              }`}
            >
              Submit Dispute
            </a>
            <a
              href="/admin"
              onClick={(e) => handleNavClick(e, "/admin")}
              className={`mobile-nav-link ${
                location.pathname === "/admin" ? "active" : ""
              }`}
            >
              Admin Dashboard
            </a>

            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="mobile-nav-link mobile-logout-btn"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  onClick={(e) => handleNavClick(e, "/login")}
                  className={`mobile-nav-link ${
                    location.pathname === "/login" ? "active" : ""
                  }`}
                >
                  Login
                </a>
                <a
                  href="/signup"
                  onClick={(e) => handleNavClick(e, "/signup")}
                  className={`mobile-nav-link mobile-signup ${
                    location.pathname === "/signup" ? "active" : ""
                  }`}
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};

function App() {
  const [isNavigating, setIsNavigating] = useState(false);

  const AppContent: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigate = (path: string) => {
      // Don't show loading if already on the same path
      if (location.pathname === path) return;

      setIsNavigating(true);

      setTimeout(() => {
        navigate(path);
        setIsNavigating(false);
      }, 300);
    };

    return (
      <div className="App">
        <LoadingSpinner isVisible={isNavigating} />
        <Navigation onNavigate={handleNavigate} />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dispute"
              element={
                <ProtectedRoute>
                  <DisputeForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <footer className="app-footer">
          <div className="footer-content">
            <span className="footer-text">© LEX 2025</span>
          </div>
        </footer>
      </div>
    );
  };

  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
