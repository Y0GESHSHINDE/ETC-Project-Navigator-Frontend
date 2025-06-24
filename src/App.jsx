import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
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
          }
        >
          {/* Nested routes inside admin */}
          <Route index element={<AdminDashboard />} />
          <Route path="add-faculty" element={<AddFacultyPage />} />
          <Route path="add-student" element={<AddStudentPage/>} />
          <Route path="faculty-list" element={<FacultyList/>} />
          <Route path="student-list" element={<StudentList/>} />
        </Route>

        <Route 
          path="/faculty" 
          element={
            <ProtectedRoute role="faculty">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;