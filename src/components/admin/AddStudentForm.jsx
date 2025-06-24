import React, { useState } from 'react';
import { UserPlus, Mail, Lock, GraduationCap } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddStudentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    department: 'E&TC',
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
        body: JSON.stringify({ ...formData, role: 'student' }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('✅ Student added successfully!');
        setFormData({
          name: '',
          email: '',
          rollNo: '',
          department: 'E&TC',
          password: '',
        });
      } else {
        toast.error(data.message || '❌ Failed to add student');
      }
    } catch (error) {
      console.error('Add Student Error:', error);
      toast.error('❌ Something went wrong!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl border">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <UserPlus className="w-6 h-6 text-blue-600" />
        Add New Student
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label className="block font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Rohan Pawar"
            className="w-full mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Email</label>
          <div className="relative">
            <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="student@example.com"
              className="w-full pl-10 mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Roll Number</label>
          <div className="relative">
            <GraduationCap className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="text"
              name="rollNo"
              required
              value={formData.rollNo}
              onChange={handleChange}
              placeholder="PRN123456"
              className="w-full pl-10 mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="E&TC"
            className="w-full mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Temporary Password</label>
          <div className="relative">
            <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Password123"
              className="w-full pl-10 mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Add Student
        </button>
      </form>
    </div>
  );
};

export default AddStudentForm;
