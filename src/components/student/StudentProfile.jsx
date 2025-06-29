import React, { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  GraduationCap,
  PencilLine,
  Loader2,
  Building2,
  Award,
  Calendar,
  Users,
  Lock,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

const StudentProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/student/student-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUserData(data.data);
          setFormData({ name: data.data.name, email: data.data.email, password: "" });
        } else {
          showToast(data.message || "Failed to load profile", "error");
        }
      } catch (error) {
        showToast("Something went wrong", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      const res = await fetch(`${apiBaseUrl}/api/student/update-student-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        setUserData((prev) => ({ ...prev, ...payload }));
        showToast("Profile updated successfully", "success");
        setShowModal(false);
      } else {
        showToast(data.message || "Update failed", "error");
      }
    } catch (err) {
      showToast("Error updating profile", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFormData((prev) => ({ ...prev, password: "" }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white text-sm font-medium flex items-center gap-3
          ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {toast.message}
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6 border">
          <div className="flex flex-wrap justify-between gap-4 items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                <UserRound className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Student Profile
                </h1>
                <p className="text-gray-600 text-sm">Manage your academic information</p>
              </div>
            </div>
            <div className="text-sm text-right text-blue-700 hidden sm:block">
              <div className="text-xs text-gray-500 uppercase">Academic Portal</div>
              2024–25 Session
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white/80 p-12 rounded-2xl shadow-xl text-center">
            <Loader2 className="animate-spin text-blue-600 w-10 h-10 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading your profile...</p>
          </div>
        ) : userData ? (
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white/80 rounded-2xl shadow-xl p-6 border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-md">
                    <UserRound className="text-blue-600 w-5 h-5" />
                  </div>
                  Personal Information
                </h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm px-4 py-2 rounded-xl shadow hover:scale-105 transition"
                >
                  <PencilLine size={16} className="inline mr-1" /> Update
                </button>
              </div>

              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <ProfileCard icon={<UserRound />} label="Full Name" value={userData.name} color="blue" />
                <ProfileCard icon={<Mail />} label="Email Address" value={userData.email} color="green" />
                <ProfileCard icon={<GraduationCap />} label="Roll Number" value={userData.rollNo} color="purple" />
                <ProfileCard icon={<Building2 />} label="Department" value={userData.department} color="indigo" />
                <ProfileCard icon={<Award />} label="Role" value={userData.role} color="orange" />
                <ProfileCard icon={<Calendar />} label="Joined Date" value={new Date(userData.createdAt).toLocaleDateString()} color="teal" />
              </div>
            </div>

            {/* Project Info */}
            {userData.groupId && (
              <div className="bg-white/80 rounded-2xl shadow-xl p-6 border">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <Users className="text-green-600 w-5 h-5" />
                  Current Project
                </h2>
                <div className="bg-green-50 p-5 rounded-xl border-l-4 border-green-500 shadow-sm">
                  <h3 className="text-green-800 font-bold text-lg">{userData.groupId.projectTitle}</h3>
                  <p className="text-gray-700 mt-2">{userData.groupId.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">Active Project</span>
                    <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Team Member</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/80 p-12 rounded-2xl text-center shadow-xl">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">Profile Not Found</h3>
            <p className="text-gray-500">Please try refreshing the page or contact support.</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-6">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Update Profile</h3>
                <button onClick={handleModalClose} className="p-1 rounded-full hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <InputField label="Full Name" type="text" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                <InputField label="Email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                <InputField label="New Password" type="password" placeholder="Leave blank to keep current" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} icon={<Lock className="w-4 h-4 text-gray-400" />} />
                <div className="flex justify-end gap-3 pt-4">
                  <button onClick={handleModalClose} disabled={updating} className="px-4 py-2 bg-gray-100 rounded-xl text-sm hover:bg-gray-200">
                    Cancel
                  </button>
                  <button onClick={handleUpdate} disabled={updating} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2">
                    {updating ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Profile Card Component
const ProfileCard = ({ icon, label, value, color = "gray" }) => {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    indigo: "bg-indigo-100 text-indigo-600",
    orange: "bg-orange-100 text-orange-600",
    teal: "bg-teal-100 text-teal-600",
    gray: "bg-gray-100 text-gray-600",
  };
  const colors = colorMap[color] || colorMap.gray;

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl p-4 shadow-sm min-w-0 break-words">
      <div className="flex items-center gap-2 mb-1 text-sm text-gray-700 font-medium">
        <div className={`p-2 rounded-md ${colors.split(" ")[0]}`}>
          <div className={`${colors.split(" ")[1]}`}>{icon}</div>
        </div>
        {label}
      </div>
      <div className="text-gray-900 text-sm font-semibold break-words">{value}</div>
    </div>
  );
};

// Input Field Component
const InputField = ({ label, type, value, onChange, placeholder = "", icon }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative mt-1">
      {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{icon}</div>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none`}
      />
    </div>
  </div>
);

export default StudentProfile;
