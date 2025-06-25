import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import { FilePlus2, Users, Code2, BookOpenCheck } from "lucide-react";
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

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl border">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FilePlus2 className="text-blue-600" />
        Create Project Group
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Project Title */}
        <div>
          <label className="block font-medium text-gray-700">Project Title</label>
          <input
            type="text"
            name="projectTitle"
            required
            value={formData.projectTitle}
            onChange={handleChange}
            placeholder="e.g. Smart Water Monitoring"
            className="w-full mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Short project description..."
            rows={3}
            className="w-full mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block font-medium text-gray-700">Technology Stack</label>
          <div className="relative">
            <Code2 className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="text"
              name="technologyStack"
              required
              value={formData.technologyStack}
              onChange={handleChange}
              placeholder="React, java , NodeMcu , Aurdino , etc. "
              className="w-full pl-10 mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
        </div>

        {/* Domain */}
        <div>
          <label className="block font-medium text-gray-700">Domain</label>
          <input
            type="text"
            name="domain"
            required
            value={formData.domain}
            onChange={handleChange}
            placeholder="AI, IoT, Web Development"
            className="w-full mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        {/* Year */}
        <div>
          <label className="block font-medium text-gray-700">Academic Year</label>
          <input
            type="text"
            name="year"
            required
            value={formData.year}
            onChange={handleChange}
            placeholder="2025-26"
            className="w-full mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        {/* Students Multi-Select */}
        <div>
          <label className=" font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Users className="text-gray-500" size={16} />
            Select Students
          </label>
          <Select
            options={studentOptions}
            isMulti
            onChange={handleSelectChange}
            value={studentOptions.filter((opt) =>
              formData.members.includes(opt.value)
            )}
            placeholder="Search & select students..."
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "🚀 Create Group"}
        </button>
      </form>
    </div>
  );
};

export default CreateProjectGroup;
