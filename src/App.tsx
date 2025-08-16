import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import { Questions } from "./pages/Questions";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Layout from "./layouts";

const ProtectedRoute = ({
  children,
  isAuthenticated,
  isLoading,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const code = localStorage.getItem("code");
      const loginTime = localStorage.getItem("loginTime");

      // Check if code exists and matches
      if (code !== import.meta.env.VITE_LOGIN_CODE) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Check if login time exists
      if (!loginTime) {
        // Code exists but no login time, clear storage and require re-login
        localStorage.removeItem("code");
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Check if login is expired (1 week = 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
      const currentTime = new Date().getTime();
      const storedLoginTime = parseInt(loginTime);

      if (currentTime - storedLoginTime > oneWeekInMs) {
        // Login expired, clear storage
        localStorage.removeItem("code");
        localStorage.removeItem("loginTime");
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // All checks passed, user is authenticated
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    // Check auth on mount
    checkAuth();

    // Listen for storage changes (when localStorage is updated)
    window.addEventListener("storage", checkAuth);

    // Custom event for when we update localStorage in the same tab
    window.addEventListener("auth-changed", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-changed", checkAuth);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
              >
                <Questions />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
