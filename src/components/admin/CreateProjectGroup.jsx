import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import { FilePlus2, Users, Code2, BookOpenCheck, GraduationCap, Briefcase, Calendar, FileText, Sparkles } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const CreateProjectGroup = () => {
  const [formData, setFormData] = useState({
    projectTitle: "",
    description: "",
    technologyStack: "",
    domain: "",
    year: "",
    members: [],
  });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/faculty/all-students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setStudents(data.data);
        else toast.error("❌ Failed to fetch students");
      } catch (err) {
        toast.error("❌ Error fetching students");
      }
    };

    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions.map((opt) => opt.value);
    setFormData((prev) => ({
      ...prev,
      members: selectedIds,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      technologyStack: formData.technologyStack
        .split(",")
        .map((item) => item.trim()),
    };

    if (payload.members.length === 0) {
      toast.warn("⚠️ Select at least one student");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/faculty/create-group`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("✅ Project group created!");
        setFormData({
          projectTitle: "",
          description: "",
          technologyStack: "",
          domain: "",
          year: "",
          members: [],
        });
      } else {
        toast.error(data.message || "❌ Creation failed");
      }
    } catch (err) {
      toast.error("❌ Server error while creating group");
    } finally {
      setLoading(false);
    }
  };

  const studentOptions = students.map((student) => ({
    value: student._id,
    label: `${student.name} (${student.rollNo || "No Roll"})`,
  }));

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#3b82f6',
      },
      borderRadius: '8px',
      minHeight: '40px',
      background: 'white',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#eff6ff',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#dbeafe',
      borderRadius: '6px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#1e40af',
      fontWeight: '500',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#1e40af',
      '&:hover': {
        backgroundColor: '#bfdbfe',
        color: '#1e40af',
      },
    }),
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
      <ToastContainer position="top-right" autoClose={3000} />


      {/* Main Form Container */}
      <div className="max-w-4xl  mx-auto">
        <div className="bg-white/80 h-fit backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4  py-3 ">
            <div className="flex items-center gap-2 sm:gap-5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FilePlus2 className="w-4 h-3 sm:w-5 sm:h-3 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Project Details</h2>
                <p className="text-blue-100 text-xs sm:text-sm">Fill in the information to create your project team</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Project Title & Description Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  Project Title
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="projectTitle"
                    required
                    value={formData.projectTitle}
                    onChange={handleChange}
                    placeholder="e.g. Smart Water Monitoring System"
                    className="w-full h-10 sm:h-12 pl-3 sm:pl-4 pr-3 sm:pr-4 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none text-sm sm:text-base text-gray-700 placeholder-gray-400"
                  />
                  <div className="absolute inset-0 rounded-lg sm:rounded-xl ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all duration-200 pointer-events-none"></div>
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  Domain
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="domain"
                    required
                    value={formData.domain}
                    onChange={handleChange}
                    placeholder="AI, IoT, Web Development, Mobile Apps"
                    className="w-full h-10 sm:h-12 pl-3 sm:pl-4 pr-3 sm:pr-4 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none text-sm sm:text-base text-gray-700 placeholder-gray-400"
                  />
                  <div className="absolute inset-0 rounded-lg sm:rounded-xl ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all duration-200 pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1 sm:space-y-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                Project Description
              </label>
              <div className="relative group">
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your project goals, methodology, and expected outcomes..."
                  rows={3}
                  className="w-full p-3 sm:p-4 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none text-sm sm:text-base text-gray-700 placeholder-gray-400 resize-none"
                />
                <div className="absolute inset-0 rounded-lg sm:rounded-xl ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all duration-200 pointer-events-none"></div>
              </div>
            </div>

            {/* Technology Stack & Year Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  <Code2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  Technology Stack
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="technologyStack"
                    required
                    value={formData.technologyStack}
                    onChange={handleChange}
                    placeholder="React, Node.js, Arduino, Python, TensorFlow"
                    className="w-full h-10 sm:h-12 pl-3 sm:pl-4 pr-3 sm:pr-4 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none text-sm sm:text-base text-gray-700 placeholder-gray-400"
                  />
                  <div className="absolute inset-0 rounded-lg sm:rounded-xl ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all duration-200 pointer-events-none"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Separate technologies with commas</p>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  Academic Year
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="year"
                    required
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="2025-26"
                    className="w-full h-10 sm:h-12 pl-3 sm:pl-4 pr-3 sm:pr-4 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none text-sm sm:text-base text-gray-700 placeholder-gray-400"
                  />
                  <div className="absolute inset-0 rounded-lg sm:rounded-xl ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all duration-200 pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Student Selection */}
            <div className="space-y-1 sm:space-y-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                Select Team Members
              </label>
              <div className="relative">
                <Select
                  options={studentOptions}
                  isMulti
                  onChange={handleSelectChange}
                  value={studentOptions.filter((opt) =>
                    formData.members.includes(opt.value)
                  )}
                  placeholder="Search and select students for your project..."
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={customSelectStyles}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">You can select multiple students to form your project team</p>
            </div>

            {/* Submit Button */}
            <div className="pt-3 sm:pt-4 lg:pt-6">
              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className="w-full h-11 sm:h-12 lg:h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Project Group...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    Create Project Group
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-4 sm:mt-6 lg:mt-8 text-center">
        <p className="text-gray-500 text-xs sm:text-sm">
          Empowering academic excellence through collaborative innovation
        </p>
      </div>
    </div>
  );
};

export default CreateProjectGroup;