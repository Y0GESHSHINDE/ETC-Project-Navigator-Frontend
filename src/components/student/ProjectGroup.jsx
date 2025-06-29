import React, { useEffect, useState } from "react";
import { 
  LoaderCircle, 
  Mail, 
  Edit2, 
  X, 
  Users, 
  BookOpen, 
  Calendar, 
  Code, 
  Globe, 
  User, 
  GraduationCap,
  Building,
  Save,
  UserCheck,
  Briefcase,
  Star
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectGroup = () => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-800">My Project Group</h1>
              </div>
              <p className="text-slate-600">Manage your academic project group details and collaboration</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
                <LoaderCircle className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
                <p className="text-slate-600 font-medium">Loading your project group...</p>
              </div>
            </div>
          ) : !group ? (
            <div className="text-center py-20">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No Project Group Assigned</h3>
                <p className="text-slate-500">You haven't been assigned to any project group yet. Please contact your instructor.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Main Project Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                {/* Project Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">{group.projectTitle}</h2>
                      <p className="text-blue-100 leading-relaxed">
                        {group.description || "No description provided."}
                      </p>
                    </div>
                    <button
                      onClick={handleEditClick}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      aria-label="Edit Project Group"
                    >
                      <Edit2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6 space-y-6">
                  {/* Technology Stack */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Code className="w-5 h-5 text-slate-600" />
                      <h3 className="font-semibold text-slate-800">Technology Stack</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.technologyStack?.length > 0 ? (
                        group.technologyStack.map((tech, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                          >
                            {tech}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">No technologies specified</span>
                      )}
                    </div>
                  </div>

                  {/* Domain and Year */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-green-800">Domain</h3>
                      </div>
                      <p className="text-green-700 font-medium">{group.domain}</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <h3 className="font-semibold text-purple-800">Academic Year</h3>
                      </div>
                      <p className="text-purple-700 font-medium">{group.year}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group Members */}
              {group.members?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Users className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">Group Members</h3>
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                        {group.members.length} Member{group.members.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.members.map((member, index) => (
                        <div
                          key={member._id}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <img
                                src={
                                  member.profileImage ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    member.name
                                  )}&background=random`
                                }
                                alt={member.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                              />
                              {index === 0 && (
                                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                                  <Star className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-slate-800 truncate">{member.name}</h4>
                              <div className="flex items-center gap-1 mt-1 text-slate-600">
                                <Mail className="w-3 h-3" />
                                <span className="text-xs truncate">{member.email}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1 text-slate-600">
                                <UserCheck className="w-3 h-3" />
                                <span className="text-xs">Roll: {member.rollNo || "N/A"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Guide Information */}
              {group.guideId && (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">Project Guide</h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <User className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-amber-800 mb-2">{group.guideId.name}</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-amber-700">
                              <Mail className="w-4 h-4" />
                              <span>{group.guideId.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-amber-700">
                              <Building className="w-4 h-4" />
                              <span>{group.guideId.department || "Department not specified"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit Modal */}
          {isEditing && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-6">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Edit2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">Edit Project Group</h3>
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      aria-label="Close edit form"
                    >
                      <X className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 font-semibold text-slate-700 mb-2">
                        <BookOpen className="w-4 h-4" />
                        Project Title
                      </label>
                      <input
                        type="text"
                        name="projectTitle"
                        value={form.projectTitle}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter your project title"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 font-semibold text-slate-700 mb-2">
                        <BookOpen className="w-4 h-4" />
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                        placeholder="Describe your project in detail"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 font-semibold text-slate-700 mb-2">
                        <Code className="w-4 h-4" />
                        Technology Stack
                      </label>
                      <input
                        type="text"
                        name="technologyStack"
                        value={form.technologyStack}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="e.g., React, Node.js, MongoDB"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Separate technologies with commas
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 font-semibold text-slate-700 mb-2">
                          <Globe className="w-4 h-4" />
                          Domain
                        </label>
                        <input
                          type="text"
                          name="domain"
                          value={form.domain}
                          onChange={handleChange}
                          required
                          className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="e.g., Web Development"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 font-semibold text-slate-700 mb-2">
                          <Calendar className="w-4 h-4" />
                          Academic Year
                        </label>
                        <input
                          type="text"
                          name="year"
                          value={form.year}
                          onChange={handleChange}
                          required
                          className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="e.g., 2025-26"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-6 py-3 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium inline-flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Update Project Group
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectGroup;