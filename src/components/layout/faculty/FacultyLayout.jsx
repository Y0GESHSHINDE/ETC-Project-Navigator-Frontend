import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import FacultySidebar from './FacultySidebar';
import FacultyTopbar from './FacultyTopbar';

const FacultyLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <FacultySidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <FacultyTopbar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FacultyLayout;
