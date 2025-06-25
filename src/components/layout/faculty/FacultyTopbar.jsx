import React from 'react';
import { Menu } from 'lucide-react';

const FacultyTopbar = ({ setSidebarOpen }) => {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; 
  };
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Hamburger for mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden text-gray-700"
      >
        <Menu size={24} />
      </button>

      <h1 className="text-lg font-semibold text-gray-800">Welcome, Faculty</h1>
      <button className="text-sm text-red-600 hover:underline cursor-pointer" onClick={logout}>Logout</button>
    </header>
  );
};

export default FacultyTopbar;
