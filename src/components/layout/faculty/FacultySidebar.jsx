import React, { useState } from "react";
import {
  X,
  LayoutDashboard,
  Users,
  LogOut,
  ChevronDown,
  ChevronUp,
  FileCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const FacultySidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [isProjectGroupsOpen, setIsProjectGroupsOpen] = useState(false);
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-transparent bg-opacity-25 transition-opacity lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}></div>

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:block`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Faculty Panel</h2>
          <button
            className="lg:hidden text-gray-600"
            onClick={() => setSidebarOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="p-4 space-y-4">
          <Link
            to="/faculty"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>

          {/* Project Groups Dropdown */}
          <div className="space-y-2">
            <button
              className="flex items-center justify-between w-full text-gray-700 hover:text-blue-600"
              onClick={() => setIsProjectGroupsOpen(!isProjectGroupsOpen)}>
              <div className="flex items-center gap-2">
                <Users size={20} /> Project
              </div>
              {isProjectGroupsOpen ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>

            {isProjectGroupsOpen && (
              <div className="pl-8 space-y-3">
                <Link
                  to="/faculty/get-my-grops"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setSidebarOpen(false)}>
                  <Users size={20} /> My Groups
                </Link>

                <Link
                  to="/faculty/project-groups"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setSidebarOpen(false)}>
                  <Users size={20} /> All Groups
                </Link>

                <Link
                  to="/faculty/task"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setSidebarOpen(false)}>
                  <FileCheck  size={20} /> Task
                </Link>

                <Link
                  to="/faculty/evaluation"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setSidebarOpen(false)}>
                  <FileCheck  size={20} /> Task Evaluation
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/faculty/student-list"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            onClick={() => setSidebarOpen(false)}>
            <Users size={20} /> Student List
          </Link>

          <Link
            to="/faculty/add-student"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            onClick={() => setSidebarOpen(false)}>
            <Users size={20} /> Add Student
          </Link>

          <Link
            to="/faculty/createGroup"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            onClick={() => setSidebarOpen(false)}>
            <Users size={20} /> Create Project Group
          </Link>

          <Link
            to="/faculty/profile"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            onClick={() => setSidebarOpen(false)}>
            <Users size={20} /> Profile
          </Link>

          <button
            className="flex items-center gap-2 text-red-500 hover:underline mt-4 cursor-pointer"
            onClick={logout}>
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default FacultySidebar;
