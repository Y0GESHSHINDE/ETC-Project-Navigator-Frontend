import React, { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProjectGroups() {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/admin/group`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch groups");
        const data = await res.json();
        setGroups(data);
        setFilteredGroups(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project groups");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [token]);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = groups.filter((group) =>
      group.projectTitle?.toLowerCase().includes(lowerSearch)
    );
    setFilteredGroups(filtered);
  }, [searchTerm, groups]);

  const openModal = (group) => {
    setSelectedGroup(group);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedGroup(null);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        All Project Groups
      </h2>

      {/* Search Input */}
      <div className="mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search by project title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-10">
          <LoaderCircle className="animate-spin mx-auto text-blue-600" size={32} />
          <p className="mt-2 text-gray-600">Loading groups...</p>
        </div>
      ) : filteredGroups.length === 0 ? (
        <p className="text-center text-gray-500">No matching project groups found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredGroups.map((group) => (
            <div
              key={group._id}
              className="bg-white border rounded-lg shadow-sm p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {group.projectTitle}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                  {group.description || "No description provided."}
                </p>
                <button
                  onClick={() => openModal(group)}
                  className="mt-4 border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1 rounded-md text-sm font-medium transition"
                >
                  View Details
                </button>
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
      )}

      {/* Modal */}
      {modalOpen && selectedGroup && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-6"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-lg w-full sm:w-[50%] max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]"
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition text-xl"
              aria-label="Close modal"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
              {selectedGroup.projectTitle}
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              {selectedGroup.description || "No description provided."}
            </p>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Technology Stack</p>
              <div className="flex flex-wrap gap-2">
                {selectedGroup.technologyStack?.length > 0 ? (
                  selectedGroup.technologyStack.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-md"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Not specified</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                Domain: {selectedGroup.domain || "N/A"}
              </div>
              <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                Year: {selectedGroup.year || "N/A"}
              </div>
            </div>

            {selectedGroup.members?.length > 0 && (
              <div className="mb-4 bg-gray-50 p-3 rounded-md border-l-4 border-indigo-400">
                <p className="text-indigo-700 font-semibold mb-2">Members</p>
                <ul className="space-y-2 text-sm text-indigo-900">
                  {selectedGroup.members.map((member) => (
                    <li
                      key={member._id}
                      className="flex gap-3 items-start border border-gray-200 p-2 rounded-md bg-white shadow-sm"
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
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-gray-600 break-words">
                          <strong>Email:</strong> {member.email}
                        </p>
                        <p className="text-xs text-gray-600">
                          <strong>Roll No:</strong> {member.rollNo || "N/A"}
                        </p>
                        <p className="text-xs text-gray-600">
                          <strong>Dept:</strong> {member.department}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedGroup.guideId && (
              <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400 text-sm">
                <p className="text-yellow-800 font-semibold mb-1">Guide</p>
                <div className="space-y-1 text-yellow-900">
                  <p>
                    <strong>Name:</strong> {selectedGroup.guideId.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedGroup.guideId.email}
                  </p>
                  <p>
                    <strong>Department:</strong>{" "}
                    {selectedGroup.guideId.department || "N/A"}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 mt-6 border-t text-right text-xs text-gray-500">
              Created on:{" "}
              {new Date(selectedGroup.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectGroups;
