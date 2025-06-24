import React, { useEffect, useState } from "react";
import { Mail, LoaderCircle, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FacultyList = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/all-faculty");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setFaculty(data.data);
      } catch (err) {
        console.error("Error fetching faculty:", err);
        toast.error("Failed to load faculty list");
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  const openModal = (faculty) => {
    setSelectedFaculty(faculty);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedFaculty(null);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Faculty Members
      </h2>

      {loading ? (
        <div className="text-center py-8">
          <LoaderCircle
            className="animate-spin mx-auto text-blue-600"
            size={32}
          />
          <p className="mt-2 text-gray-600">Loading faculty...</p>
        </div>
      ) : faculty.length === 0 ? (
        <p className="text-gray-500 text-center">No faculty members found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {faculty.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden flex flex-col md:flex-row p-4 gap-4">
              <div className="flex justify-center md:justify-start">
                <img
                  src={
                    member.profileImage
                      ? member.profileImage
                      : "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(member.name) +
                        "&background=random&length=2&size=64"
                  }
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border border-gray-300"
                />
              </div>
              <div className="flex flex-col flex-1 items-center text-center md:items-start md:text-left">
                <p className="text-xl font-semibold text-gray-900">
                  {member.name}
                </p>
                <p className="flex items-center gap-2 mt-1 text-gray-600 text-sm">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="break-words">{member.email}</span>
                </p>
                <p className="mt-1 text-gray-600 text-sm">
                  <span className="font-medium">Department:</span>{" "}
                  {member.department || "N/A"}
                </p>
                <button
                  onClick={() => openModal(member)}
                  className="mt-3 border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white transition px-3 py-1 rounded-md text-sm font-medium">
                  View Assigned Groups
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
            className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
              aria-label="Close modal">
              <X size={24} />
            </button>

            {/* Modal Header */}
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Assigned Groups for {selectedFaculty.name}
            </h3>

            {/* Modal Content */}
            {selectedFaculty.assignedGroups?.length > 0 ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {selectedFaculty.assignedGroups.map((group, idx) => (
                  <li
                    key={idx}
                    className="bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-700">
                    {group.projectTitle || "Untitled Project"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center text-sm">
                No assigned groups.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyList;
