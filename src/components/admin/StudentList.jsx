import React, { useEffect, useState } from "react";
import {
  Mail,
  LoaderCircle,
  X,
  Edit,
  Trash2,
  Users,
  BookOpen,
  Calendar,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { exportToCSV } from "../../utils/exportToCSV"; // adjust path as needed

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [projectInfo, setProjectInfo] = useState(null);
  const [buttonLoadingId, setButtonLoadingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNo: "",
    department: "",
    profileImage: "",
  });
  const [modalLoading, setModalLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [studentRes, groupRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/admin/all-students`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch(`${apiBaseUrl}/api/admin/group`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        const [studentData, groupData] = await Promise.all([
          studentRes.json(),
          groupRes.json(),
        ]);

        setStudents(studentData.data);
        setGroups(groupData); // all group info
      } catch (err) {
        toast.error("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const openProjectModal = (student) => {
    setSelectedStudent(student);
    setViewModalOpen(true);
  };

  const openUpdateModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      rollNo: student.rollNo,
      department: student.department || "",
      profileImage: student.profileImage || "",
    });
    setUpdateModalOpen(true);
  };

  const openDeleteModal = (student) => {
    setSelectedStudent(student);
    setDeleteModalOpen(true);
  };

  const closeModal = () => {
    setViewModalOpen(false);
    setUpdateModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedStudent(null);
    setProjectInfo(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProjectInfo = async (groupId, studentName) => {
    if (!groupId) {
      toast.warning("No group assigned.");
      return;
    }

    setButtonLoadingId(groupId);

    try {
      const res = await fetch(`${apiBaseUrl}/api/admin/group/${groupId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch project info");
      }

      const data = await res.json();
      setProjectInfo(data);
      setSelectedStudent({ name: studentName });
      setViewModalOpen(true);
    } catch (err) {
      console.error("Error fetching project info:", err);
      toast.error("Could not load project details.");
    } finally {
      setButtonLoadingId(null);
    }
  };

  const handleUpdateStudent = async () => {
    try {
      setModalLoading(true);

      // Filter out empty fields
      const payload = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== "")
      );

      if (Object.keys(payload).length === 0) {
        throw new Error("At least one field must be updated");
      }
      // console.log(selectedStudent._id, payload);
      console.log(apiBaseUrl);
      const res = await fetch(
        `${apiBaseUrl}/api/admin/update-student/${selectedStudent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update student");
      }

      toast.success("Student updated successfully");
      setStudents(
        students.map((s) =>
          s._id === selectedStudent._id ? { ...s, ...payload } : s
        )
      );
      closeModal();
    } catch (err) {
      toast.error(err.message);
      console.error("Update error:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    try {
      setModalLoading(true);

      const res = await fetch(
        `${apiBaseUrl}/api/admin/delete-student/${selectedStudent._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete student");
      }

      toast.success("Student deleted successfully");
      setStudents(students.filter((s) => s._id !== selectedStudent._id));
      closeModal();
    } catch (err) {
      toast.error(err.message);
      console.error("Delete error:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      (student.rollNo && student.rollNo.toLowerCase().includes(query)) ||
      student.email.toLowerCase().includes(query)
    );
  });

  const handleExport = () => {
    const sanitized = students.map((student) => {
      const group = groups.find((g) => g._id === student.groupId);
      return {
        Name: student.name,
        Email: student.email,
        RollNo: student.rollNo,
        Department: student.department || "N/A",
        ProjectTitle: group?.projectTitle || "Not Assigned",
      };
    });

    exportToCSV(sanitized, "student-list-with-projects");
    console.log(sanitized);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6">Student List</h2>

      {/* Search Input */}
      <div className="mb-6 ">
        <input
          type="text"
          placeholder="Search by name, roll no, or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className=" w-full sm:max-w-md p-2 border rounded"
        />
        <button
          onClick={handleExport}
          className="mb-4 bg-green-600 text-white mt-5 w-full  sm:w-fit sm:mt-0 sm:ml-20 px-4 py-2 rounded hover:bg-green-700 transition">
          📤 Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <LoaderCircle
            className="animate-spin mx-auto text-blue-600"
            size={32}
          />
          <p className="mt-2 text-gray-600">Loading students...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <p className="text-gray-500 text-center">No students found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden flex flex-col md:flex-row p-4 gap-4">
              <div className="flex justify-center md:justify-start">
                <img
                  src={
                    student.profileImage ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      student.name
                    )}&background=random&length=2&size=64`
                  }
                  alt={student.name}
                  className="w-24 h-24 rounded-full object-cover border border-gray-300"
                />
              </div>
              <div className="flex flex-col flex-1 items-center text-center md:items-start md:text-left">
                <p className="text-xl font-semibold text-gray-900">
                  {student.name}
                </p>
                <p className="flex items-center gap-2 mt-1 text-gray-600 text-sm">
                  <span className="font-medium">Roll No:</span>
                  <span className="break-words">{student.rollNo}</span>
                </p>
                <p className="flex items-center gap-2 mt-1 text-gray-600 text-sm">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="break-words">{student.email}</span>
                </p>
                <p className="mt-1 text-gray-600 text-sm">
                  <span className="font-medium">Department:</span>{" "}
                  {student.department || "N/A"}
                </p>

                <div className="flex flex-col w-full mt-3 gap-2">
                  <button
                    onClick={() => openUpdateModal(student)}
                    className="flex items-center justify-center gap-1 border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white transition px-3 py-1 rounded-md text-sm font-medium">
                    <Edit size={14} /> Edit
                  </button>

                  <button
                    onClick={() => openDeleteModal(student)}
                    className="flex items-center justify-center gap-1 border border-red-500 text-red-600 hover:bg-red-600 hover:text-white transition px-3 py-1 rounded-md text-sm font-medium">
                    <Trash2 size={14} /> Delete
                  </button>

                  <button
                    onClick={() =>
                      handleProjectInfo(student.groupId, student.name)
                    }
                    disabled={
                      !student.groupId || buttonLoadingId === student._id
                    }
                    className={`flex items-center justify-center gap-1 border px-3 py-1 rounded-md text-sm font-medium ${
                      buttonLoadingId === student._id || !student.groupId
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
                        : "border-green-500 text-green-600 hover:bg-green-600 hover:text-white"
                    }`}>
                    {buttonLoadingId === student._id ? (
                      <LoaderCircle className="animate-spin" size={14} />
                    ) : (
                      <Users size={14} />
                    )}
                    Project Info
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Info Modal */}
      {viewModalOpen && selectedStudent && (
        <Modal
          onClose={closeModal}
          title={`🎓 Project Info of ${selectedStudent.name}`}
          type="project">
          {projectInfo?.success && projectInfo.data ? (
            <div className=" text-sm  text-gray-800">
              <div className="bg-gray-50 p-4 rounded-md shadow-inner space-y-2">
                <p className="text-base font-semibold text-blue-700">
                  📌 Title
                </p>
                <p className="text-gray-900">{projectInfo.data.projectTitle}</p>
                <p className="mt-3 text-base font-semibold text-blue-700">
                  📝 Description
                </p>
                <p className="text-gray-700">
                  {projectInfo.data.description || "No description available."}
                </p>
              </div>

              <div className="grid grid-cols-1 py-4 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-blue-700 font-medium">
                    🧪 Technology Stack
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-blue-900 text-sm">
                    {projectInfo.data.technologyStack?.length > 0 ? (
                      projectInfo.data.technologyStack.map((tech, index) => (
                        <li key={index}>{tech}</li>
                      ))
                    ) : (
                      <li>Not specified</li>
                    )}
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-md border border-green-100">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        Domain
                      </p>
                      <p className="text-green-900 mt-1">
                        {projectInfo.data.domain || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mt-3">
                    <Calendar className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-700">Year</p>
                      <p className="text-green-900 mt-1">
                        {projectInfo.data.year || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-md space-y-2 border-l-4 border-yellow-400">
                <p className="text-yellow-700 font-semibold">
                  👨‍🏫 Guide Information
                </p>
                {projectInfo.data.guideId ? (
                  <div className="text-yellow-900 text-sm pl-2">
                    <p>
                      <strong>Name:</strong> {projectInfo.data.guideId.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {projectInfo.data.guideId.email}
                    </p>
                    <p>
                      <strong>Department:</strong>{" "}
                      {projectInfo.data.guideId.department}
                    </p>
                  </div>
                ) : (
                  <p>Guide info not available.</p>
                )}
              </div>

              <div className="text-right text-xs text-gray-500 mt-4">
                Created on:{" "}
                {new Date(projectInfo.data.createdAt).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center text-sm">
              No project info found.
            </p>
          )}
        </Modal>
      )}

      {/* Update Student Modal */}
      {updateModalOpen && selectedStudent && (
        <Modal
          onClose={closeModal}
          title="Update Student Details"
          type="update">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Roll Number
              </label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image URL
              </label>
              <input
                type="text"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://example.com/profile.jpg"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleUpdateStudent}
                disabled={modalLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                {modalLoading && (
                  <LoaderCircle className="animate-spin" size={18} />
                )}
                Update
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Student Modal */}
      {deleteModalOpen && selectedStudent && (
        <Modal
          onClose={closeModal}
          title="Confirm Student Deletion"
          type="delete">
          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Trash2 className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Warning: This action cannot be undone
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      You are about to permanently delete {selectedStudent.name}
                      's account. All associated data will be removed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleDeleteStudent}
                disabled={modalLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2">
                {modalLoading && (
                  <LoaderCircle className="animate-spin" size={18} />
                )}
                Delete Permanently
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Reusable Modal Component
// Reusable Modal Component with responsive fixes
const Modal = ({ onClose, title, children, type = "default" }) => {
  // Determine max-width based on modal type
  const getMaxWidth = () => {
    switch (type) {
      case "project":
        return "max-w-3xl"; // Wider for project info
      case "update":
        return "max-w-md"; // Medium for forms
      case "delete":
        return "max-w-sm"; // Smaller for confirmations
      default:
        return "max-w-xl"; // Default size
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className={`bg-white rounded-xl shadow-xl w-full ${getMaxWidth()} mx-auto p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}>
        {/* Close button with better mobile positioning */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1 rounded-full hover:bg-gray-100 transition"
          aria-label="Close modal">
          <X size={24} className="text-gray-500 hover:text-red-500" />
        </button>

        {/* Scrollable content area */}
        <div className="pr-2">
          {" "}
          {/* Add padding to prevent content from hiding behind scrollbar */}
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center mt-2 text-gray-800">
            {title}
          </h3>
          <div className="text-sm sm:text-base">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
