import React, { useEffect, useState } from "react";
import { Menu ,LogOut} from "lucide-react";

const StudentTopbar = ({ setSidebarOpen }) => {
  const [UserData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/student/student-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        // console.log(data.data);
        if (data.success) {
          setUserData(data.data);
        } else {
          toast.error("Failed to fetch groups");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [apiBaseUrl, token]);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";  
  };

  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Hamburger for mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden text-gray-700">
        <Menu size={24} />
      </button>

      <h1 className=" text:md sm:text-lg font-semibold text-black">{UserData.name}</h1>
      <button className="text-sm text-red-600 hover:underline hover:text-red-600 cursor-pointer" onClick={logout}>
        <LogOut/>
      </button>
    </header>
  );
};

export default StudentTopbar;
