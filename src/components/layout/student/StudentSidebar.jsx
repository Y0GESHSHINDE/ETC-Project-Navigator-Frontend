import React from "react";
import { X, LayoutDashboard, Users, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const StudentSidebar = ({ sidebarOpen, setSidebarOpen }) => {

  console.log("StudentSidebar rendered");
  const token = localStorage.getItem("token");
  console.log("Token:", token);
  
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
          <h2 className="text-lg font-bold text-gray-800">Student Panel</h2>
          <button
            className="lg:hidden text-gray-600"
            onClick={() => setSidebarOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="p-4 space-y-4">
          <Link
            to="/student"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>

          <Link
            to="/student/project"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            onClick={() => setSidebarOpen(false)}>
            <Users size={20} /> Project 
          </Link>


          <Link
            to="/student/profile"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            onClick={() => setSidebarOpen(false)}>
            <Users size={20} /> Profile 
          </Link>


          <button className="flex items-center gap-2 text-red-400 hover:underline mt-4 hover:text-red-600 cursor-pointer" onClick={logout}>
            <LogOut size={20}  /> Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default StudentSidebar;
