import React, { useEffect, useState } from "react";
import {
  PencilLine,
  UserRound,
  GraduationCap,
  Mail,
  Loader2,
  Lock,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/student/student-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUserData(data.data);
          setFormData({ name: data.data.name, email: data.data.email });
        } else {
          toast.error(data.message || "Failed to load profile");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/student/update-student-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully");
        setUserData(prev => ({ ...prev, ...formData }));
        setShowModal(false);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 mt-6 bg-white rounded-xl shadow-md border space-y-6">
      <ToastContainer />
      <div className="flex items-center gap-3">
        <UserRound className="text-blue-600 w-6 h-6" />
        <h2 className="text-2xl font-bold text-gray-800">Student Profile</h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-blue-600 w-6 h-6" />
        </div>
      ) : userData ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ProfileCard icon={<UserRound />} label="Name" value={userData.name} />
            <ProfileCard icon={<Mail />} label="Email" value={userData.email} />
            <ProfileCard icon={<GraduationCap />} label="Roll No" value={userData.rollNo} />
            <ProfileCard label="Department" value={userData.department} />
            <ProfileCard label="Role" value={userData.role} />
            <ProfileCard label="Created At" value={new Date(userData.createdAt).toLocaleDateString()} />
          </div>

          {userData.groupId && (
            <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
              <h3 className="text-indigo-800 font-semibold text-sm mb-2">Project Info</h3>
              <p className="text-gray-800 text-md font-medium">{userData.groupId.projectTitle}</p>
              <p className="text-gray-800 text-[13px] font-medium">{userData.groupId.description}</p>
            </div>
          )}

          <div className="text-right">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              <PencilLine size={16} /> Update Profile
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Profile not found.</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-6">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg border">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Update Profile</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">New Password</label>
                <input
                  type="password"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="keep blank to keep current password"
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
                >Cancel</button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileCard = ({ icon, label, value }) => (
  <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
      {icon && <span className="text-blue-500">{icon}</span>} {label}
    </div>
    <div className="mt-1 text-gray-900 font-semibold text-sm break-all">{value}</div>
  </div>
);

export default StudentProfile;
