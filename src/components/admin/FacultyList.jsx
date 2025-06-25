import React, { useEffect, useState } from "react";
import { Mail, LoaderCircle, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FacultyList = () => {
  const [faculty, setFaculty] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/all-faculty", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setFaculty(data.data);
      } catch (err) {
        toast.error("Failed to load faculty list");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchFaculty();
    } else {
      toast.error("You must be logged in to view this page");
    }
  }, [token]);

  const openModal = async (faculty) => {
    try {
      setModalLoading(true);
      const enrichedGroups = [];

      for (const groupId of faculty.assignedGroups || []) {
        const res = await fetch(
          `http://localhost:5000/api/admin/group/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await res.json();
        if (res.ok) enrichedGroups.push(result.data);
      }

      setSelectedFaculty({ ...faculty, assignedGroups: enrichedGroups });
      setModalOpen(true);
    } catch (err) {
      toast.error("Error fetching group details");
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedFaculty(null);
  };

  const filteredFaculty = faculty.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Faculty Members
      </h2>

      {/* Search Input */}
      <div className="mb-8 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <LoaderCircle
            className="animate-spin mx-auto text-blue-600"
            size={32}
          />
          <p className="mt-2 text-gray-600">Loading faculty...</p>
        </div>
      ) : filteredFaculty.length === 0 ? (
        <p className="text-gray-500 text-center">No faculty members found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredFaculty.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border p-4 flex flex-col md:flex-row gap-4">
              <div className="flex justify-center md:justify-start">
                <img
                  src={
                    member.profileImage
                      ? member.profileImage
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          member.name
                        )}&background=random&length=2&size=64`
                  }
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border"
                />
              </div>
              <div className="flex flex-col flex-1 items-center md:items-start text-center md:text-left">
                <p className="text-xl font-semibold text-gray-900">
                  {member.name}
                </p>
                <p className="flex items-center gap-2 mt-1 text-gray-600 text-sm">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span>{member.email}</span>
                </p>
                <p className="mt-1 text-gray-600 text-sm">
                  <span className="font-medium">Department:</span>{" "}
                  {member.department || "N/A"}
                </p>
                <button
                  onClick={() => openModal(member)}
                  disabled={modalLoading}
                  className={`mt-3 border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white transition px-3 py-1 rounded-md text-sm font-medium ${
                    modalLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}>
                  {modalLoading ? "Loading..." : "View Assigned Groups"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && selectedFaculty && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-6"
          onClick={closeModal}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-lg w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
              aria-label="Close modal">
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Assigned Project Groups for {selectedFaculty.name}
            </h3>

            {selectedFaculty.assignedGroups?.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                {selectedFaculty.assignedGroups.map((group, index) => (
                  <div
                    key={group._id || index}
                    className="relative border border-gray-200 rounded-lg p-5 shadow-sm bg-gray-50 flex flex-col h-full justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {group.projectTitle}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        {group.description || "No description provided."}
                      </p>

                      <div className="mt-4">
                        <p className="font-medium text-gray-700 mb-2">
                          Technology Stack
                        </p>
                        {group.technologyStack?.length > 0 ? (
                          <div className="grid grid-cols-4 gap-2">
                            {group.technologyStack.map((tech, i) => (
                              <span
                                key={i}
                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-md text-center">
                                {tech}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Not specified</p>
                        )}
                      </div>

                      {group.members?.length > 0 && (
                        <div className="mt-4 bg-gray-50 p-3 rounded-md border-l-4 border-indigo-400">
                          <p className="text-indigo-700 font-semibold mb-2">
                            Project Members
                          </p>
                          <ul className="space-y-2 text-indigo-900 pl-2 text-sm">
                            {group.members.map((member) => (
                              <li
                                key={member._id}
                                className="flex flex-wrap items-center gap-3 border border-gray-200 p-2 rounded-md bg-white shadow-sm">
                                <img
                                  src={
                                    member.profileImage
                                      ? member.profileImage
                                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                          member.name
                                        )}&background=random`
                                  }
                                  alt={member.name}
                                  className="w-10 h-10 rounded-full object-cover border flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium truncate">
                                    {member.name}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    <span className="font-bold">Roll No: </span>
                                    {member.rollNo}
                                  </p>
                                  <p className="text-xs text-gray-600 break-words">
                                    <span className="font-bold">Email: </span>
                                    {member.email}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    <span className="font-bold">Dept: </span>
                                    {member.department}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {group.guideId && (
                        <div className="mt-4 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400 text-sm">
                          <p className="text-yellow-800 font-semibold mb-1">
                            Guide Information
                          </p>
                          <div className="pl-2 space-y-1 text-yellow-900">
                            <p>
                              <strong>Name:</strong> {group.guideId.name}
                            </p>
                            <p>
                              <strong>Email:</strong> {group.guideId.email}
                            </p>
                            <p>
                              <strong>Department:</strong>{" "}
                              {group.guideId.department || "N/A"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-6 border-t text-right text-xs text-gray-500">
                      Created on:{" "}
                      {new Date(group.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm">
                No assigned groups for this faculty.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyList;
