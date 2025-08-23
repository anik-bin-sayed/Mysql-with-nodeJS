import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./components/signup";
import Signin from "./components/Signin";
import Dashboard from "./components/dashboard";
import { ProtectedRoutes, PublicRoutes } from "./components/ProtectedRoute";
import useStore from "./store/useStore";

function App() {
  const { checkAuth, isCheckingAuth, isLoading } = useStore();

  useEffect(() => {
    checkAuth();
  }, []);



  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoutes>
              <Signin />
            </PublicRoutes>
          }
        />

        {/* ✅ Register পেজ */}
        <Route
          path="/register"
          element={
            <PublicRoutes>
              <Signup />
            </PublicRoutes>
          }
        />

        {/* ✅ Dashboard পেজ */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />

        {/* ✅ যদি কোন path না মিলে */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
