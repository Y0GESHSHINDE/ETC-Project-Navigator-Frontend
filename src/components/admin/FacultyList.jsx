import React, { useEffect, useState } from "react";
import { Mail, LoaderCircle, X, Edit, Trash2, Users } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateFacultyModal from "./UpdateFacultyModal"; // Modal for updating faculty
import DeleteFacultyModal from "./DeleteFacultyModal"; // Modal for deleting faculty
import ViewGroupsModal from "./ViewGroupsModal"; // Modal for viewing assigned groups

const FacultyList = () => {
  const [faculty, setFaculty] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    profileImage: "",
  });

  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiBaseUrl}/api/admin/all-faculty`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setFaculty(data.data || []);
      } catch (err) {
        toast.error("Failed to load faculty list");
      } finally {
        setLoading(false);
      }
    };
    token ? fetchFaculty() : toast.error("Authentication required");
  }, [token]);

  // Open Update Modal and set form data
  const openUpdateModal = (faculty) => {
    setSelectedFaculty(faculty);
    setFormData({
      name: faculty.name,
      email: faculty.email,
      department: faculty.department || "",
      profileImage: faculty.profileImage || "",
    });
    setUpdateModalOpen(true);
  };

  // Open Delete Modal
  const openDeleteModal = (faculty) => {
    setSelectedFaculty(faculty);
    setDeleteModalOpen(true);
  };

  // Open View Groups Modal with enriched group data
  const openViewModal = async (faculty) => {
    try {
      setModalLoading(true);
      const enrichedGroups = [];

      for (const groupId of faculty.assignedGroups || []) {
        const res = await fetch(`${apiBaseUrl}/api/admin/group/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (res.ok) enrichedGroups.push(result.data);
      }

      setSelectedFaculty({ ...faculty, assignedGroups: enrichedGroups });
      setViewModalOpen(true);
    } catch (err) {
      toast.error("Error fetching group details");
    } finally {
      setModalLoading(false);
    }
  };

  // Close any open modal and reset selected faculty
  const closeModal = () => {
    setViewModalOpen(false);
    setUpdateModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedFaculty(null);
  };

  // Handle form input changes in Update modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated faculty data
  const handleUpdateFaculty = async () => {
    try {
      setModalLoading(true);
      const payload = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== "")
      );

      if (Object.keys(payload).length === 0) {
        throw new Error("At least one field must be updated");
      }

      const res = await fetch(
        `${apiBaseUrl}/api/admin/update-faculty/${selectedFaculty._id}`,
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
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Faculty updated successfully");
      setFaculty((prev) =>
        prev.map((f) => (f._id === selectedFaculty._id ? { ...f, ...payload } : f))
      );
      closeModal();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  // Handle faculty deletion
  const handleDeleteFaculty = async () => {
    try {
      setModalLoading(true);
      const res = await fetch(
        `${apiBaseUrl}/api/admin/delete-faculty/${selectedFaculty._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Deletion failed");

      toast.success("Faculty deleted successfully");
      setFaculty((prev) => prev.filter((f) => f._id !== selectedFaculty._id));
      closeModal();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  // Filter faculty list based on search query
  const filteredFaculty = faculty.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render each faculty card with action buttons
  const FacultyCard = ({ member }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border p-4 flex flex-col md:flex-row gap-4">
      <div className="flex justify-center md:justify-start">
        <img
          src={
            member.profileImage ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              member.name
            )}&background=random&length=2&size=64`
          }
          alt={member.name}
          className="w-24 h-24 rounded-full object-cover border"
        />
      </div>
      <div className="flex flex-col flex-1 items-center md:items-start text-center md:text-left">
        <p className="text-xl font-semibold text-gray-900">{member.name}</p>
        <p className="flex items-center gap-2 mt-1 text-gray-600 text-sm">
          <Mail className="w-4 h-4 text-blue-500" />
          <span>{member.email}</span>
        </p>
        <p className="mt-1 text-gray-600 text-sm">
          <span className="font-medium">Department:</span> {member.department || "N/A"}
        </p>
        <div className=" bg-white w-full sm:flex gap-3 justify-center md:block">
          <button
            onClick={() => openUpdateModal(member)}
            className="flex items-center gap-1  w-full md:w-full sm:w-30 mt-4 cursor-pointer   justify-center border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white transition px-3 py-1 rounded-md text-sm font-medium"
          >
            <Edit size={14} /> Edit
          </button>
          <button
            onClick={() => openDeleteModal(member)}
            className="flex items-center gap-1 border mt-4 w-full md:w-full sm:w-30  cursor-pointer   justify-center border-red-500 text-red-600 hover:bg-red-600 hover:text-white transition px-3 py-1 rounded-md text-sm font-medium"
          >
            <Trash2 size={14} /> Delete
          </button>
          <button
            onClick={() => openViewModal(member)}
            className="flex items-center gap-1 border mt-4 w-full md:w-full sm:w-30  cursor-pointer  justify-center border-green-500 text-green-600 hover:bg-green-600 hover:text-white transition px-3 py-1 rounded-md text-sm font-medium"
          >
            <Users size={14} /> Groups
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Faculty Members
      </h2>

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
        <p className="text-gray-500 text-center">No faculty members found</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredFaculty.map((member) => (
            <FacultyCard key={member._id} member={member} />
          ))}
        </div>
      )}

      {/* Modals */}
      {viewModalOpen && selectedFaculty && (
        <ViewGroupsModal
          onClose={closeModal}
          facultyName={selectedFaculty.name}
          groups={selectedFaculty.assignedGroups || []}
        />
      )}

      {updateModalOpen && selectedFaculty && (
        <UpdateFacultyModal
          formData={formData}
          setFormData={setFormData}
          onClose={closeModal}
          loading={modalLoading}
          onSubmit={handleUpdateFaculty}
          handleInputChange={handleInputChange}
        />
      )}

      {deleteModalOpen && selectedFaculty && (
        <DeleteFacultyModal
          onClose={closeModal}
          onDelete={handleDeleteFaculty}
          facultyName={selectedFaculty.name}
          loading={modalLoading}
        />
      )}
    </div>
  );
};

export default FacultyList;
