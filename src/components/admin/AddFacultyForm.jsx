import React, { useState } from 'react';
import { Mail, User, Lock, Building2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddFacultyPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    password: '',
  });

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${apiBaseUrl}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: 'faculty',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('🎉 Faculty added successfully!');
        setFormData({ name: '', email: '', department: '', password: '' });
      } else {
        toast.error(data.message || 'Failed to add faculty');
      }
    } catch (err) {
      toast.error('❌ Error adding faculty');
      console.error('Error:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        ➕ Add New Faculty
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-5">
        {/* Name */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
            <User className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              name="name"
              value={formData.name}
              required
              onChange={handleChange}
              placeholder="Prof. A. Sharma"
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Email</label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
            <Mail className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              required
              onChange={handleChange}
              placeholder="faculty@example.com"
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Department */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Department</label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
            <Building2 className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="E&TC"
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Temporary Password</label>
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
            <Lock className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              value={formData.password}
              required
              onChange={handleChange}
              placeholder="Password123"
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Faculty
        </button>
      </form>
    </div>
  );
};

export default AddFacultyPage;
