import React from "react";
import { Menu, LogOut } from "lucide-react";

const FacultyTopbar = ({ setSidebarOpen }) => {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; 
  };

  return (
    <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
      {/* Mobile menu button */}
      <button
        className="lg:hidden text-gray-700"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Title */}
      <h1 className="text-lg font-semibold text-gray-800">
        Welcome, Faculty
      </h1>

      {/* Logout button */}
      <button
        className="text-red-600 hover:underline flex items-center gap-1"
        onClick={logout}
      >
        <LogOut size={20} /> Logout
      </button>
    </header>
  );
};

export default FacultyTopbar;
