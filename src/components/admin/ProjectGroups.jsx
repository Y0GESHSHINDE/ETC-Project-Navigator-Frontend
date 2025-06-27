import React, { useEffect, useState } from "react";
import { LoaderCircle, X } from "lucide-react";
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

  // console.log(groups);

  return (
    <div className="max-w-6xl mx-auto  p-4">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6">
        All Project Groups
      </h2>

      {/* Search Input */}
      <div className="mb-6 ">
        <input
          type="text"
          placeholder="Search by project title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-2 border rounded"
        />
      </div>

      {loading ? (
        <div className="text-center py-10">
          <LoaderCircle
            className="animate-spin mx-auto text-blue-600"
            size={32}
          />
          <p className="mt-2 text-gray-600">Loading groups...</p>
        </div>
      ) : filteredGroups.length === 0 ? (
        <p className="text-center text-gray-500">
          No matching project groups found.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2  lg:grid-cols-3 ">
          {filteredGroups.map((group) => (
            <div
              key={group._id}
              className="bg-white border  rounded-lg shadow-sm p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {group.projectTitle}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                  {group.description || "No description provided."}
                </p>

                <div>
                  <h3 className="font-semibold mt-2">Guide</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3 p-2 border rounded">
                      <img
                        src={
                          group.guideId.profileImage ||
                          `https://ui-avatars.com/api/?name=${group.guideId.name}&background=random`
                        }
                        alt={group.guideId.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p>{group.guideId.name}</p>
                        <p className="text-sm text-gray-600">
                          {group.guideId.email}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => openModal(group)}
                  className="mt-4 border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1 rounded-md text-sm w-full font-medium transition">
                  View Details
                </button>
              </div>
              <div className="pt-4  text-right text-xs text-gray-500">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">
                  {selectedGroup.projectTitle}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Description</h3>
                  <p>{selectedGroup.description || "No description"}</p>
                </div>

                <div>
                  <h3 className="font-medium">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedGroup.technologyStack?.map((tech) => (
                      <span
                        key={tech}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Domain</h3>
                    <p>{selectedGroup.domain || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Year</h3>
                    <p>{selectedGroup.year || "Not specified"}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium">Members</h3>
                  {selectedGroup.members?.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedGroup.members.map((member) => (
                        <li
                          key={member._id}
                          className="flex items-center gap-3 p-2 border rounded">
                          <img
                            src={
                              member.profileImage ||
                              `https://ui-avatars.com/api/?name=${member.name}&background=random`
                            }
                            alt={member.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p>{member.name}</p>
                            <p className="text-sm text-gray-600">
                              {member.email}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No members</p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium">Guide</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3 p-2 border rounded">
                      <img
                        src={
                          selectedGroup.guideId.profileImage ||
                          `https://ui-avatars.com/api/?name=${selectedGroup.guideId.name}&background=random`
                        }
                        alt={selectedGroup.guideId.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p>{selectedGroup.guideId.name}</p>
                        <p className="text-sm text-gray-600">
                          {selectedGroup.guideId.email}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectGroups;
