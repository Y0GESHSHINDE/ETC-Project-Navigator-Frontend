import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import LandingPage from "./components/landingPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";
import AddFacultyPage from "./components/admin/AddFacultyForm";
import AddStudentPage from "./components/admin/AddStudentForm";
import FacultyList from "./components/admin/FacultyList";
import StudentList from "./components/admin/StudentList";
import ProjectGroups from "./components/admin/ProjectGroups";
import FacultyLayout from "./components/layout/faculty/FacultyLayout";
import FacultyProjectGroups from "./components/faculty/FaculutyProjectGroups";
import CreateProjectGroup from "./components/admin/CreateProjectGroup";
import StudentLayout from "./components/layout/student/StudentLayout";
import ProjectGroup from './components/student/ProjectGroup';
import StudentProfile from "./components/student/StudentProfile";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
          {/* Nested routes inside admin */}
          <Route index element={<AdminDashboard />} />
          <Route path="add-faculty" element={<AddFacultyPage />} />
          <Route path="add-student" element={<AddStudentPage />} />
          <Route path="faculty-list" element={<FacultyList />} />
          <Route path="student-list" element={<StudentList />} />
          <Route path="project-groups" element={<ProjectGroups />} />
        </Route>

        <Route
          path="/faculty"
          element={
            <ProtectedRoute role="faculty">
              <FacultyLayout />
            </ProtectedRoute>
          }>
          {/* Nested routes inside admin */}
          <Route index element={<FacultyDashboard />} />
          <Route path="add-student" element={<AddStudentPage />} />
          <Route path="student-list" element={<StudentList />} />
          <Route path="get-my-grops" element={<FacultyProjectGroups />} />
          <Route path="project-groups" element={<ProjectGroups />} />
          <Route path="createGroup" element={<CreateProjectGroup />} />
        </Route>

        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentLayout />
            </ProtectedRoute>
          }>
          {/* Nested routes inside admin */}
          <Route index element={<StudentDashboard />} />
          <Route path="project" element={<ProjectGroup />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
