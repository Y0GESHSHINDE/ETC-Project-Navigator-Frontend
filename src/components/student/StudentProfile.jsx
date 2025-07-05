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
  Camera,
  Upload,
} from "lucide-react";

const StudentProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", profileImage: null });
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({}); // Add errors state

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
          setFormData({ name: data.data.name, email: data.data.email, password: "", profileImage: null });
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
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      
      // Clear image error when file is selected
      if (errors.profileImage) {
        setErrors((prev) => ({ ...prev, profileImage: "" }));
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    // Check if name is empty
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    // Check if image is required (only if user doesn't have an existing profile image)
    if (!userData.profileImage && !formData.profileImage) {
      newErrors.profileImage = "Profile image is required";
    }
    
    // Optional: Add password validation if password is provided
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    // Validate form before submission
    if (!validateForm()) {
      showToast("Please fix the errors before submitting", "error");
      return;
    }

    setUpdating(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      
      if (formData.password.trim()) {
        formDataToSend.append("password", formData.password);
      }
      
      if (formData.profileImage) {
        formDataToSend.append("file", formData.profileImage);
      }

      const res = await fetch(`${apiBaseUrl}/api/student/update-student-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      const data = await res.json();

      if (res.ok) {
        setUserData((prev) => ({ 
          ...prev, 
          name: formData.name,
          ...(data.data?.profileImage && { profileImage: data.data.profileImage })
        }));
        showToast("Profile updated successfully", "success");
        setShowModal(false);
        setPreviewImage(null);
        setErrors({}); // Clear errors on success
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
    setFormData((prev) => ({ ...prev, password: "", profileImage: null }));
    setPreviewImage(null);
    setErrors({}); // Clear errors when modal closes
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
            {/* Profile Image Section */}
            <div className="bg-white/80 rounded-2xl shadow-xl p-6 border">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                    {userData.profileImage ? (
                      <img 
                        src={userData.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-200 to-indigo-200 flex items-center justify-center">
                        <UserRound className="text-blue-600 w-16 h-16" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-full shadow-lg">
                    <Camera className="text-white w-4 h-4" />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-bold text-gray-800">{userData.name}</h3>
                  <p className="text-gray-600">{userData.email}</p>
                  <p className="text-sm text-blue-600 font-medium mt-1">{userData.department} • {userData.role}</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm px-6 py-2 rounded-xl shadow hover:scale-105 transition"
                  >
                    <PencilLine size={16} className="inline mr-2" /> Update Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-white/80 rounded-2xl shadow-xl p-6 border">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-100 rounded-md">
                  <UserRound className="text-blue-600 w-5 h-5" />
                </div>
                Personal Information
              </h2>

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
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Update Profile</h3>
                <button onClick={handleModalClose} className="p-1 rounded-full hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Profile Image Upload */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Profile Image {!userData.profileImage && <span className="text-red-500">*</span>}
                  </label>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
                      {previewImage ? (
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : userData.profileImage ? (
                        <img src={userData.profileImage} alt="Current" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <UserRound className="text-gray-400 w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <label className={`cursor-pointer px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition ${
                      errors.profileImage ? 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-300' : 'bg-gray-100 hover:bg-gray-200'
                    }`}>
                      <Upload size={16} />
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {errors.profileImage && (
                      <p className="text-red-500 text-xs text-center flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.profileImage}
                      </p>
                    )}
                  </div>
                </div>

                <InputField 
                  label="Full Name" 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={errors.name}
                  required={true}
                />
                <InputField 
                  label="Email" 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => handleInputChange("email", e.target.value)} 
                  disabled={true}
                />
                <InputField 
                  label="New Password" 
                  type="password" 
                  placeholder="Leave blank to keep current" 
                  value={formData.password} 
                  onChange={(e) => handleInputChange("password", e.target.value)} 
                  icon={<Lock className="w-4 h-4 text-gray-400" />}
                  error={errors.password}
                />
                
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    onClick={handleModalClose} 
                    disabled={updating} 
                    className="px-4 py-2 bg-gray-100 rounded-xl text-sm hover:bg-gray-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpdate} 
                    disabled={updating} 
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 disabled:opacity-50"
                  >
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
const InputField = ({ label, type, value, onChange, placeholder = "", icon, disabled = false, error, required = false }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative mt-1">
      {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{icon}</div>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${
          disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
        } ${error ? "border-red-300 focus:ring-red-500" : "border-gray-300"}`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  </div>
);

export default StudentProfile;