import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import DisputeForm from "./components/DisputeForm";
import AdminDashboard from "./components/AdminDashboard";
import Hero from "./components/Hero";
import LoadingSpinner from "./components/LoadingSpinner";
import "./App.css";

interface NavigationProps {
  onNavigate: (path: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  const location = useLocation();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <nav className="app-navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <img src="/Logo.png" alt="AI Judge" className="nav-logo" />
        </div>
        <div className="nav-links">
          <a
            href="/"
            onClick={(e) => handleNavClick(e, "/")}
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
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
        </div>
      </div>
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
          <Hero />
          <Routes>
            <Route path="/" element={<DisputeForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    );
  };

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
