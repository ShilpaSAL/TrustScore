import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Predict from "./pages/Predict";
import History from "./pages/History";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";

import CompanyProfile from "./pages/CompanyProfile";
import PostJob from "./pages/PostJob";
import Applicants from "./pages/Applicants";
import BrowseJobs from "./pages/BrowseJobs";
import AppliedJobs from "./pages/AppliedJobs";

const Private = ({ children, adminRequired }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminRequired && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<Layout />}>

        <Route
          path="/dashboard"
          element={
            <Private>
              <Dashboard />
            </Private>
          }
        />

        <Route
          path="/company-profile"
          element={
            <Private>
              <CompanyProfile />
            </Private>
          }
        />

        <Route
          path="/post-job"
          element={
            <Private>
              <PostJob />
            </Private>
          }
        />

        <Route
          path="/applicants"
          element={
            <Private>
              <Applicants />
            </Private>
          }
        />

        <Route
          path="/browse-jobs"
          element={
            <Private>
              <BrowseJobs />
            </Private>
          }
        />

        <Route
          path="/applied-jobs"
          element={
            <Private>
              <AppliedJobs />
            </Private>
          }
        />

        <Route
          path="/predict"
          element={
            <Private>
              <Predict />
            </Private>
          }
        />

        <Route
          path="/history"
          element={
            <Private>
              <History />
            </Private>
          }
        />

        <Route
          path="/profile"
          element={
            <Private>
              <Profile />
            </Private>
          }
        />

        <Route
          path="/admin"
          element={
            <Private adminRequired>
              <AdminPanel />
            </Private>
          }
        />

      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}