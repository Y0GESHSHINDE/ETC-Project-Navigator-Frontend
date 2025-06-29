import React, { useEffect, useState } from "react";
import {
  LoaderCircle,
  Edit,
  Trash2,
  X,
  Check,
  Users,
  Search,
  Plus,
  Eye,
  Calendar,
  Code,
  Building,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

function FacultyProjectGroups() {
  // State
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(null); // 'view', 'edit', 'delete'
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [formData, setFormData] = useState({
    projectTitle: "",
    description: "",
    technologyStack: [],
    domain: "",
    year: "",
    members: [],
  });
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch groups
        const groupsRes = await fetch(
          `${apiBaseUrl}/api/faculty/get-my-groups`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const groupsData = await groupsRes.json();

        // Fetch students
        const studentsRes = await fetch(
          `${apiBaseUrl}/api/faculty/all-students`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const studentsData = await studentsRes.json();

        if (groupsData.success) setGroups(groupsData.data);
        if (studentsData.success) setAllStudents(studentsData.data);
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter groups
  useEffect(() => {
    const filtered = groups.filter((group) =>
      group.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGroups(filtered);
  }, [searchQuery, groups]);

  // Modal handlers
  const openModal = (type, group) => {
    setSelectedGroup(group);
    if (type === "edit") {
      setFormData({
        projectTitle: group.projectTitle,
        description: group.description || "",
        technologyStack: group.technologyStack || [],
        domain: group.domain || "",
        year: group.year || "",
        members: group.members?.map((m) => m._id) || [],
      });
    }
    setModalOpen(type);
  };

  const closeModal = () => {
    setModalOpen(null);
    setSelectedGroup(null);
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechAdd = (tech) => {
    if (tech && !formData.technologyStack.includes(tech)) {
      setFormData((prev) => ({
        ...prev,
        technologyStack: [...prev.technologyStack, tech],
      }));
    }
  };

  const handleTechRemove = (tech) => {
    setFormData((prev) => ({
      ...prev,
      technologyStack: prev.technologyStack.filter((t) => t !== tech),
    }));
  };

  // API calls
  const handleUpdateGroup = async () => {
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/faculty/update-group/${selectedGroup._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Group updated successfully!");
      setGroups(
        groups.map((g) => (g._id === selectedGroup._id ? data.data : g))
      );
      closeModal();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/faculty/delete-group/${selectedGroup._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Group deleted successfully!");
      setGroups(groups.filter((g) => g._id !== selectedGroup._id));
      closeModal();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Student select component
  const StudentSelect = () => {
    const options = allStudents.map((student) => ({
      value: student._id,
      label: `${student.name} (${student.rollNo || "No Roll No"})`,
    }));

    const selected = formData.members.map((memberId) => {
      const student = allStudents.find((s) => s._id === memberId);
      return {
        value: memberId,
        label: `${student?.name || "Unknown"} (${
          student?.rollNo || "No Roll No"
        })`,
      };
    });

    return (
      <Select
        isMulti
        options={options}
        value={selected}
        onChange={(selected) =>
          setFormData((prev) => ({
            ...prev,
            members: selected.map((option) => option.value),
          }))
        }
        className="basic-multi-select"
        placeholder="Select students..."
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Users className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              My Project Groups
            </h1>
          </div>
          <p className="text-gray-600">
            Manage and monitor your supervised project groups
          </p>
        </div>
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search project groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <LoaderCircle
                className="animate-spin mx-auto mb-4 text-blue-600"
                size={48}
              />
              <p className="text-gray-600 text-lg">
                Loading your project groups...
              </p>
            </div>
          </div>
        )}
        {/* Empty State */}
        {!loading && filteredGroups.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-6">
              <Users className="mx-auto text-gray-300" size={64} />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Project Groups Found
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try adjusting your search terms"
                : "You haven't created any project groups yet"}
            </p>
          </div>
        )}
        {/* Groups Grid */}
        {!loading && filteredGroups.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <div
                key={group._id}
                className="group bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Project Title */}
                <div className="mb-4">
                  <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">
                    {group.projectTitle}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {group.description || "No description provided"}
                  </p>
                </div>

                {/* Technology Stack */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {group.technologyStack?.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                        <Code size={12} />
                        {tech}
                      </span>
                    ))}
                    {group.technologyStack?.length > 3 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{group.technologyStack.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <div className="mb-4 space-y-2">
                  {group.domain && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building size={14} />
                      <span>{group.domain}</span>
                    </div>
                  )}
                  {group.year && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={14} />
                      <span>{group.year}</span>
                    </div>
                  )}
                </div>

                {/* Members Count & Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {group.members?.length || 0} members
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => openModal("view", group)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 group-hover:scale-105"
                      title="View Details">
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => openModal("edit", group)}
                      className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors duration-200 group-hover:scale-105"
                      title="Edit Group">
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => openModal("delete", group)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 group-hover:scale-105"
                      title="Delete Group">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* View Modal */}
        {modalOpen === "view" && selectedGroup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                      {selectedGroup.projectTitle}
                    </h2>
                    <p className="text-gray-600">Project Details</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  {/* Description */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedGroup.description || "No description provided"}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Code size={18} className="text-blue-600" />
                      Technology Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedGroup.technologyStack?.map((tech) => (
                        <span
                          key={tech}
                          className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
                          {tech}
                        </span>
                      ))}
                      {!selectedGroup.technologyStack?.length && (
                        <p className="text-gray-500 italic">
                          No technologies specified
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Building size={16} className="text-amber-600" />
                        Domain
                      </h3>
                      <p className="text-gray-700">
                        {selectedGroup.domain || "Not specified"}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Calendar size={16} className="text-green-600" />
                        Academic Year
                      </h3>
                      <p className="text-gray-700">
                        {selectedGroup.year || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Members */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Users size={18} className="text-green-600" />
                      Team Members ({selectedGroup.members?.length || 0})
                    </h3>
                    {selectedGroup.members?.length > 0 ? (
                      <div className="grid gap-3">
                        {selectedGroup.members.map((member) => (
                          <div
                            key={member._id}
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-shadow">
                            <img
                              src={
                                member.profileImage ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  member.name
                                )}&background=random&color=fff`
                              }
                              alt={member.name}
                              className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">
                                {member.name}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {member.email}
                              </p>
                              {member.rollNo && (
                                <p className="text-gray-500 text-xs">
                                  Roll No: {member.rollNo}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <Users
                          className="mx-auto mb-2 text-gray-300"
                          size={32}
                        />
                        <p className="text-gray-500">No members assigned</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Edit Modal */}
        {modalOpen === "edit" && selectedGroup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                      Edit Project Group
                    </h2>
                    <p className="text-gray-600">Update group information</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* FIX: Add form wrapper and Save button */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateGroup();
                }}
                className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="space-y-6">
                  {/* ...all your input fields here... */}
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* // ...existing code... */}
        {/* Delete Modal */}
        {modalOpen === "delete" && selectedGroup && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in slide-in-from-bottom duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Trash2 className="text-red-600" size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        Delete Project Group
                      </h2>
                      <p className="text-gray-600 text-sm">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-gray-800 mb-2">
                      Are you sure you want to delete{" "}
                      <span className="font-semibold text-red-700">
                        "{selectedGroup.projectTitle}"
                      </span>
                      ?
                    </p>
                    <p className="text-sm text-gray-600">
                      This will permanently remove the project group and all
                      associated data.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteGroup}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                    Delete Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FacultyProjectGroups;
