import React, { useState } from "react";
import {
  X,
  LayoutDashboard,
  Users,
  LogOut,
  ChevronUp,
  ChevronDown,
  FileCheck,
  UserCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const StudentSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity lg:hidden ${
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

        {/* Navigation */}
        <nav className="p-4 space-y-4 text-gray-700">
          <Link
            to="/student"
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
                <Users size={20} /> Project
              </span>
              {isProjectMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {isProjectMenuOpen && (
              <div className="mt-2 ml-6 space-y-3 text-sm">
                <Link
                  to="/student/project"
                  className="flex items-center gap-2 hover:text-blue-600"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Users size={18} /> Group Info
                </Link>
                <Link
                  to="/student/task"
                  className="flex items-center gap-2 hover:text-blue-600"
                  onClick={() => setSidebarOpen(false)}
                >
                  <FileCheck size={18} /> Tasks
                </Link>
              </div>
            )}
          </div>

          {/* Profile */}
          <Link
            to="/student/profile"
            className="flex items-center gap-2 hover:text-blue-600"
            onClick={() => setSidebarOpen(false)}
          >
            <UserCircle size={20} /> Profile
          </Link>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-600 hover:underline mt-6"
          >
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default StudentSidebar;
