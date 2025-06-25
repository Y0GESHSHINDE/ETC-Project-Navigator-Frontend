import React, { useEffect, useState } from "react";
import { Mail, LoaderCircle, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [projectInfo, setProjectInfo] = useState(null);
  const [buttonLoadingId, setButtonLoadingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // <-- search state
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/admin/all-students`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setStudents(data.data);
      } catch (err) {
        console.error("Error fetching students:", err);
        toast.error("Failed to load student list");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const openModal = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
  };

  const handleProjectInfo = async (groupId, studentName) => {
    const token = localStorage.getItem("token");

    if (!groupId) {
      toast.warning("No group assigned.");
      return;
    }

    if (!token) {
      toast.error("Authentication token missing. Please log in again.");
      return;
    }

    setButtonLoadingId(groupId);

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/group/${groupId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorMsg = await res.text();
        console.error("API Error Response:", errorMsg);
        throw new Error("Failed to fetch project info");
      }

      const data = await res.json();
      setProjectInfo(data);
      setSelectedStudent({ name: studentName });
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching project info:", err);
      toast.error("Could not load project details.");
    } finally {
      setButtonLoadingId(null);
    }
  };

  // Filter students based on search query (case-insensitive)
  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      (student.rollNo && student.rollNo.toLowerCase().includes(query)) ||
      student.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Student List
      </h2>

      {/* Search Input */}
      <div className="mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search by name, roll no, or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden flex flex-col md:flex-row p-4 gap-4"
            >
              <div className="flex justify-center md:justify-start">
                <img
                  src={
                    student.profileImage
                      ? student.profileImage
                      : "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(student.name) +
                        "&background=random&length=2&size=64"
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
                <button
                  onClick={() =>
                    handleProjectInfo(student.groupId, student.name)
                  }
                  disabled={!student.groupId || buttonLoadingId === student._id}
                  className={`mt-3 border px-3 py-1 rounded-md text-sm font-medium transition ${
                    buttonLoadingId === student._id || !student.groupId
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "border-green-500 text-green-600 hover:bg-green-600 hover:text-white"
                  }`}
                >
                  {buttonLoadingId === student._id ? "Loading..." : "Project Info"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && selectedStudent && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-6"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 sm:p-8 relative animate-fadeIn"
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
              🎓 Project Info of {selectedStudent.name}
            </h3>

            {projectInfo?.success && projectInfo.data ? (
              <div className="space-y-6 text-sm text-gray-800">
                {/* Title & Description */}
                <div className="bg-gray-50 p-4 rounded-md shadow-inner space-y-2">
                  <p className="text-base font-semibold text-blue-700">📌 Title</p>
                  <p className="text-gray-900">{projectInfo.data.projectTitle}</p>

                  <p className="mt-3 text-base font-semibold text-blue-700">📝 Description</p>
                  <p className="text-gray-700">
                    {projectInfo.data.description || "No description available."}
                  </p>
                </div>

                {/* Tech, Domain, Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <p className="text-blue-700 font-medium">🧪 Technology Stack</p>
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

                  <div className="bg-green-50 p-4 rounded-md space-y-2">
                    <p className="text-green-700 font-medium">📚 Domain</p>
                    <p className="text-green-900">{projectInfo.data.domain || "N/A"}</p>

                    <p className="text-green-700 font-medium mt-2">📅 Year</p>
                    <p className="text-green-900">{projectInfo.data.year || "N/A"}</p>
                  </div>
                </div>

                {/* Guide Info */}
                <div className="bg-yellow-50 p-4 rounded-md space-y-2 border-l-4 border-yellow-400">
                  <p className="text-yellow-700 font-semibold">👨‍🏫 Guide Information</p>
                  {projectInfo.data.guideId ? (
                    <div className="text-yellow-900 text-sm pl-2">
                      <p>
                        <strong>Name:</strong> {projectInfo.data.guideId.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {projectInfo.data.guideId.email}
                      </p>
                      <p>
                        <strong>Department:</strong> {projectInfo.data.guideId.department}
                      </p>
                    </div>
                  ) : (
                    <p>Guide info not available.</p>
                  )}
                </div>

                {/* Metadata */}
                <div className="text-right text-xs text-gray-500 mt-4">
                  Created on:{" "}
                  {new Date(projectInfo.data.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center text-sm">No project info found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
