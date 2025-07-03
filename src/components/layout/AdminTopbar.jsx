import React from 'react';
import { Menu ,LogOut} from 'lucide-react';

const AdminTopbar = ({ setSidebarOpen }) => {
    const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; 
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

      <h1 className="text-lg font-semibold text-gray-800">Welcome, Admin</h1>
      <button className="text-sm text-red-600 hover:underline  cursor-pointer" onClick={logout}>
        <LogOut/>
      </button>
    </header>
  );
};

export default AdminTopbar;
