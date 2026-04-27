import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/Student/ProtectedRoute";

import StudentLayout from "./components/Student/StudentLayout";
import DashboardHome from "./components/Student/DashboardHome";
import MyProjects from "./components/Student/MyProjects";
import CreateProject from "./components/Student/CreateProject";
import TeamPage from "./components/Student/TeamPage";
import ReviewsPage from "./components/Student/ReviewsPage";
import OpportunitiesPage from "./components/Student/OpportunitiesPage";
import ProjectDetails from "./components/Student/ProjectDetails";

import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboardHome from "./pages/admin/AdminDashboardHome";
import ReviewProjects from "./pages/admin/ReviewProjects";
import TeamsPage from "./pages/admin/TeamsPage";
import AdminOpportunitiesPage from "./pages/admin/OpportunitiesPage";
import ManageUsers from "./pages/admin/ManageUsers";
import SettingsPage from "./pages/admin/SettingsPage";

import CompanyLayout from "./components/Company/CompanyLayout";
import CompanyDashboardHome from "./pages/company/CompanyDashboardHome";
import CompanyOpportunities from "./pages/company/CompanyOpportunities";
import CompanyProjects from "./pages/company/CompanyProjects";
import CompanyApplicants from "./pages/company/CompanyApplicants";

import ExpertLayout from "./components/Expert/ExpertLayout";
import ExpertDashboardHome from "./pages/expert/ExpertDashboardHome";
import ExpertReviews from "./pages/expert/ExpertReviews";
import ExpertHistory from "./pages/expert/ExpertHistory";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="projects" element={<MyProjects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="create" element={<CreateProject />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="opportunities" element={<OpportunitiesPage />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute allowedRole={["mentor", "admin"]}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardHome />} />
          <Route path="reviews" element={<ReviewProjects />} />
          <Route path="reviews/:id" element={<ProjectDetails />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="opportunities" element={<AdminOpportunitiesPage />} />
          <Route path="users" element={<ProtectedRoute allowedRole="admin"><ManageUsers /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute allowedRole="admin"><SettingsPage /></ProtectedRoute>} />
        </Route>

        <Route path="/company" element={<ProtectedRoute allowedRole="company"><CompanyLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CompanyDashboardHome />} />
          <Route path="opportunities" element={<CompanyOpportunities />} />
          <Route path="projects" element={<CompanyProjects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="applicants" element={<CompanyApplicants />} />
        </Route>

        <Route path="/expert" element={<ProtectedRoute allowedRole="expert"><ExpertLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ExpertDashboardHome />} />
          <Route path="reviews" element={<ExpertReviews />} />
          <Route path="reviews/:id" element={<ProjectDetails />} />
          <Route path="history" element={<ExpertHistory />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
