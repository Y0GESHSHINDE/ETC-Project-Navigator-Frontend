import React, { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FacultyProjectGroups() {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/faculty/get-my-groups`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setGroups(data.data);
          setFilteredGroups(data.data);
        } else {
          toast.error("Failed to fetch groups");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [token]);

  useEffect(() => {
    const filtered = groups.filter((group) =>
      group.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGroups(filtered);
  }, [searchQuery, groups]);

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        My Assigned Project Groups
      </h2>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by Project Title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-10">
          <LoaderCircle className="animate-spin mx-auto text-blue-600" size={32} />
          <p className="mt-2 text-gray-600">Loading project groups...</p>
        </div>
      ) : filteredGroups.length === 0 ? (
        <p className="text-center text-gray-500">No project groups found.</p>
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
                <p className="text-sm text-gray-600 mt-1">
                  {group.description || "No description provided."}
                </p>

                {/* Tech Stack */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Technology Stack
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {group.technologyStack?.length > 0 ? (
                      group.technologyStack.map((tech, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-md text-center"
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Not specified</p>
                    )}
                  </div>
                </div>

                {/* Domain & Year */}
                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Domain: {group.domain || "N/A"}
                  </div>
                  <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                    Year: {group.year || "N/A"}
                  </div>
                </div>

                {/* Members */}
                {group.members?.length > 0 && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-md border-l-4 border-indigo-400">
                    <p className="text-indigo-700 font-semibold mb-2">
                      Members
                    </p>
                    <ul className="space-y-2 text-sm text-indigo-900">
                      {group.members.map((member) => (
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
                            className="w-10 h-10 rounded-full object-cover border flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-gray-600 break-words">
                              <strong>Email:</strong> {member.email}
                            </p>
                            {member.rollNo && (
                              <p className="text-xs text-gray-600">
                                <strong>Roll No:</strong> {member.rollNo}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
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
      )}
    </div>
  );
}

export default FacultyProjectGroups;
