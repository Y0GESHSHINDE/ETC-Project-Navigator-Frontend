import React, { useState } from 'react';
import { UserPlus, Mail, Lock, GraduationCap, Building2, Eye, EyeOff } from 'lucide-react';

const AddStudentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    department: 'E&TC',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${apiBaseUrl}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, role: 'student' }),
      });

      const data = await res.json();

      if (res.ok) {
        // Simulate toast notification
        alert('✅ Student added successfully!');
        setFormData({
          name: '',
          email: '',
          rollNo: '',
          department: 'E&TC',
          password: '',
        });
      } else {
        alert(data.message || '❌ Failed to add student');
      }
    } catch (error) {
      console.error('Add Student Error:', error);
      alert('❌ Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-5">
          {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div> */}
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Student Registration
          </h1>
          <p className="text-gray-600 text-lg">Add a new student to the academic system</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-300">
          <div className="space-y-6">
            {/* Full Name Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter student's full name"
                  className="w-full px-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400 text-gray-800 font-medium group-hover:border-gray-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              </div>
            </div>

            {/* Email Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute top-4 left-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" size={20} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@university.edu"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400 text-gray-800 font-medium group-hover:border-gray-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              </div>
            </div>

            {/* Roll Number Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Roll Number
              </label>
              <div className="relative">
                <GraduationCap className="absolute top-4 left-4 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" size={20} />
                <input
                  type="text"
                  name="rollNo"
                  required
                  value={formData.rollNo}
                  onChange={handleChange}
                  placeholder="PRN123456789"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400 text-gray-800 font-medium group-hover:border-gray-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              </div>
            </div>

            {/* Department Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Department
              </label>
              <div className="relative">
                <Building2 className="absolute top-4 left-4 text-gray-400 group-hover:text-orange-500 transition-colors duration-200" size={20} />
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="E&TC"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400 text-gray-800 font-medium group-hover:border-gray-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-yellow-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Temporary Password
              </label>
              <div className="relative">
                <Lock className="absolute top-4 left-4 text-gray-400 group-hover:text-red-500 transition-colors duration-200" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a secure password"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400 text-gray-800 font-medium group-hover:border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full h-11 sm:h-12 lg:h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <UserPlus size={20} />
                    Add Student to System
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default AddStudentForm;