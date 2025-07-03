import React from "react";
import {
  X,
  LayoutDashboard,
  Users,
  LogOut,
  UserPlus,
  Shield,
  Group,
  UserCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-lg transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:block`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-purple-600">Admin Panel</h2>
          <button
            className="lg:hidden text-gray-600"
            onClick={() => setSidebarOpen(false)}>
            <X />
          </button>
        </div>

        {/* Nav links */}
        <nav className="p-4 space-y-4 text-gray-700">
          <Link
            to="/admin"
            className="flex items-center gap-2 hover:text-blue-600"
            onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>

          {/* User Management Section */}
          <div className="space-y-3 pl-1">
            <h4 className="text-sm font-semibold text-gray-500">
              User Management
            </h4>

            <Link
              to="/admin/faculty-list"
              className="flex items-center gap-2 hover:text-blue-600"
              onClick={() => setSidebarOpen(false)}>
              <Shield size={20} /> Faculty List
            </Link>

            <Link
              to="/admin/student-list"
              className="flex items-center gap-2 hover:text-blue-600"
              onClick={() => setSidebarOpen(false)}>
              <Users size={20} /> Student List
            </Link>

            <Link
              to="/admin/add-faculty"
              className="flex items-center gap-2 hover:text-blue-600"
              onClick={() => setSidebarOpen(false)}>
              <UserPlus size={20} /> Add Faculty
            </Link>

            <Link
              to="/admin/add-student"
              className="flex items-center gap-2 hover:text-blue-600"
              onClick={() => setSidebarOpen(false)}>
              <UserPlus size={20} /> Add Student
            </Link>
          </div>

          {/* Project Section */}
          <div className="space-y-3 pl-1">
            <h4 className="text-sm font-semibold text-gray-500">Projects</h4>

            <Link
              to="/admin/project-groups"
              className="flex items-center gap-2 hover:text-blue-600"
              onClick={() => setSidebarOpen(false)}>
              <Group size={20} /> Project Groups
            </Link>

            <Link
              to="/admin/task"
              className="flex items-center gap-2 hover:text-blue-600"
              onClick={() => setSidebarOpen(false)}>
              <Group size={20} /> Task
            </Link>

            <Link
              to="/admin/evaluation"
              className="flex items-center gap-2 hover:text-blue-600"
              onClick={() => setSidebarOpen(false)}>
              <Group size={20} /> Evaluation
            </Link>
          </div>

          {/* Profile */}
          <Link
            to="/admin/profile"
            className="flex items-center gap-2 hover:text-blue-600 mt-2"
            onClick={() => setSidebarOpen(false)}>
            <UserCircle size={20} /> Profile
          </Link>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-500 hover:underline mt-6">
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
