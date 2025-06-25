import React, { useEffect, useState } from "react";
import { LoaderCircle, Mail, Edit2, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectGroup = () => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form state for editing
  const [form, setForm] = useState({
    projectTitle: "",
    description: "",
    technologyStack: "",
    domain: "",
    year: "",
  });

  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/student/get-my-group`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setGroup(data.data);
          setForm({
            projectTitle: data.data.projectTitle,
            description: data.data.description,
            technologyStack: data.data.technologyStack.join(", "),
            domain: data.data.domain,
            year: data.data.year,
          });
        } else {
          toast.error(data.message || "Failed to load project group");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [token]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data
    const updateData = {
      projectTitle: form.projectTitle,
      description: form.description,
      technologyStack: form.technologyStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      domain: form.domain,
      year: form.year,
    };

    try {
      const res = await fetch(
        `${apiBaseUrl}/api/student/update-Project-Group/${group._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Project group updated successfully!");
        setGroup(data.data);
        setIsEditing(false);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 sm:px-4">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        My Project Group
      </h2>

      {loading ? (
        <div className="text-center py-10">
          <LoaderCircle
            className="animate-spin text-blue-600 mx-auto"
            size={32}
          />
          <p className="mt-2 text-gray-600">Loading your group...</p>
        </div>
      ) : !group ? (
        <p className="text-center text-gray-500">
          You are not assigned to any project group yet.
        </p>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {group.projectTitle}
            </h3>
            <button
              onClick={handleEditClick}
              aria-label="Edit Project Group"
              className="text-blue-600 hover:text-blue-800 transition cursor-pointer "
            >
              <Edit2 size={20} />
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-1">
            {group.description || "No description provided."}
          </p>

          <div>
            <p className="font-medium text-gray-700 mb-1">Technology Stack</p>
            <div className="flex flex-wrap gap-2">
              {group.technologyStack?.length > 0 ? (
                group.technologyStack.map((tech, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-md"
                  >
                    {tech}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">Not specified</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Domain: {group.domain}
            </span>
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
              Year: {group.year}
            </span>
          </div>

          {/* Members */}
          {group.members?.length > 0 && (
            <div className="mt-4 bg-gray-50 p-3 sm:p-4 rounded-md border-l-4 border-indigo-400">
              <p className="text-indigo-700 font-semibold mb-2">Group Members</p>
              <ul className="space-y-2">
                {group.members.map((member) => (
                  <li
                    key={member._id}
                    className="flex items-start gap-3 border border-gray-200 p-2 rounded-md bg-white shadow-sm"
                  >
                    <img
                      src={
                        member.profileImage ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          member.name
                        )}&background=random`
                      }
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-gray-600 break-all">
                        <Mail size={12} className="inline-block mr-1" />
                        {member.email}
                      </p>

                      <p className="text-xs text-gray-600">
                        Roll No: {member.rollNo || "N/A"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Guide Info */}
          {group.guideId && (
            <div className="mt-4 bg-yellow-50 p-4 rounded-md border-l-4 border-yellow-400 text-sm">
              <p className="text-yellow-800 font-semibold mb-1">
                Guide Information
              </p>
              <p>
                <strong>Name:</strong> {group.guideId.name}
              </p>
              <p>
                <strong>Email:</strong> {group.guideId.email}
              </p>
              <p>
                <strong>Department:</strong> {group.guideId.department || "N/A"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-6">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 cursor-pointer"
              aria-label="Close edit form"
            >
              <X size={24} />
            </button>

            <h3 className="text-xl font-bold mb-4">Edit Project Group</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Project Title</label>
                <input
                  type="text"
                  name="projectTitle"
                  value={form.projectTitle}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 resize-none"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Technology Stack (comma separated)
                </label>
                <input
                  type="text"
                  name="technologyStack"
                  value={form.technologyStack}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Domain</label>
                <input
                  type="text"
                  name="domain"
                  value={form.domain}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Year</label>
                <input
                  type="text"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="2025-26"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Update Project Group
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectGroup;
