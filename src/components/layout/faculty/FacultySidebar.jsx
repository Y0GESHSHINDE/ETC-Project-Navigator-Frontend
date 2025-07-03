import React, { useState } from "react";
import {
  X,
  LayoutDashboard,
  Users,
  LogOut,
  ChevronDown,
  ChevronUp,
  FileCheck,
  UserPlus,
  UserCircle,
  Group,
} from "lucide-react";
import { Link } from "react-router-dom";

const FacultySidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; 
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden transition-opacity ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-lg transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:block`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-purple-600">Project Navigator</h1>
          <button className="lg:hidden text-gray-600" onClick={() => setSidebarOpen(false)}>
            <X />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-4 text-gray-700">
          <Link
            to="/faculty"
            className="flex items-center gap-2 hover:text-blue-600"
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>

          {/* Project Dropdown */}
          <div>
            <button
              className="flex items-center justify-between w-full hover:text-blue-600"
              onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
            >
              <span className="flex items-center gap-2">
                <Group size={20} /> Projects
              </span>
              {isProjectMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {isProjectMenuOpen && (
              <div className="mt-2 ml-6 space-y-3 text-sm">
                <Link to="/faculty/get-my-groups" className="flex items-center gap-2 hover:text-blue-600" onClick={() => setSidebarOpen(false)}>
                  <Users size={18} /> My Groups
                </Link>
                <Link to="/faculty/project-groups" className="flex items-center gap-2 hover:text-blue-600" onClick={() => setSidebarOpen(false)}>
                  <Group size={18} /> All Groups
                </Link>
                <Link to="/faculty/task" className="flex items-center gap-2 hover:text-blue-600" onClick={() => setSidebarOpen(false)}>
                  <FileCheck size={18} /> Tasks
                </Link>
                <Link to="/faculty/evaluation" className="flex items-center gap-2 hover:text-blue-600" onClick={() => setSidebarOpen(false)}>
                  <FileCheck size={18} /> Evaluations
                </Link>
              </div>
            )}
          </div>

          {/* Static Links */}
          <Link
            to="/faculty/student-list"
            className="flex items-center gap-2 hover:text-blue-600"
            onClick={() => setSidebarOpen(false)}
          >
            <Users size={20} /> Student List
          </Link>

          <Link
            to="/faculty/add-student"
            className="flex items-center gap-2 hover:text-blue-600"
            onClick={() => setSidebarOpen(false)}
          >
            <UserPlus size={20} /> Add Student
          </Link>

          <Link
            to="/faculty/createGroup"
            className="flex items-center gap-2 hover:text-blue-600"
            onClick={() => setSidebarOpen(false)}
          >
            <Group size={20} /> Create Group
          </Link>

          <Link
            to="/faculty/profile"
            className="flex items-center gap-2 hover:text-blue-600"
            onClick={() => setSidebarOpen(false)}
          >
            <UserCircle size={20} /> Profile
          </Link>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-500 hover:underline mt-6"
          >
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default FacultySidebar;
