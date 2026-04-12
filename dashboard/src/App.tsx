import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import DashboardWrapper from "./components/DashboardWrapper";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import UserManagement from "./pages/UserManagement";
import CircularsPage from "./pages/CircularsPage";

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard/*" 
          element={token ? <DashboardWrapper role={role} /> : <Navigate to="/login" />}
        >
          {role === "ADMIN" && (
            <>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="circulars" element={<CircularsPage role={role} />} />
              <Route path="" element={<Navigate to="/dashboard/analytics" />} />
            </>
          )}
          {role === "STAFF" && (
            <>
              <Route path="staff" element={<StaffDashboard />} />
              <Route path="circulars" element={<CircularsPage role={role} />} />
              <Route path="" element={<Navigate to="/dashboard/staff" />} />
            </>
          )}
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
