import React, { useEffect, useContext, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { DrawingProvider } from "./context/DrawingContext";
import GlobalStyle from "./styles/GlobalStyle";
import AnimatedSwitch from "./components/AnimatedSwitch";
import FloatingAddButton from "./components/FloatingAddButton";
import ModalRoot from "./components/ModalRoot";
import HeaderBar from "./components/HeaderBar";
import "./App.css";

// Lazy-loaded pages for code splitting
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const DrawingPage = lazy(() => import("./pages/DrawingPage"));
const DrawingViewPage = lazy(() => import("./pages/DrawingViewPage"));

// Protected route wrapper
function RequireAuth({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  if (loading) return <div className="centered_loader">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function AppRoutes() {
  return (
    <AnimatedSwitch>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/draw"
        element={
          <RequireAuth>
            <DrawingPage />
          </RequireAuth>
        }
      />
      <Route
        path="/drawing/:id"
        element={
          <RequireAuth>
            <DrawingViewPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </AnimatedSwitch>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <AuthProvider>
      <DrawingProvider>
        <GlobalStyle />
        <Router>
          <HeaderBar />
          <Suspense fallback={<div className="centered_loader">Loading...</div>}>
            <AppRoutes />
            <FloatingAddButton />
            <ModalRoot />
          </Suspense>
        </Router>
      </DrawingProvider>
    </AuthProvider>
  );
}
export default App;
