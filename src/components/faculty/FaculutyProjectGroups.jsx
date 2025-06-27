import React, { useEffect, useState } from "react";
import { LoaderCircle, Edit, Trash2, X, Check, Users } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from 'react-select';

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
    members: []
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
        const groupsRes = await fetch(`${apiBaseUrl}/api/faculty/get-my-groups`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const groupsData = await groupsRes.json();
        
        // Fetch students
        const studentsRes = await fetch(`${apiBaseUrl}/api/faculty/all-students`, {
          headers: { Authorization: `Bearer ${token}` }
        });
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
    const filtered = groups.filter(group =>
      group.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGroups(filtered);
  }, [searchQuery, groups]);

  // Modal handlers
  const openModal = (type, group) => {
    setSelectedGroup(group);
    if (type === 'edit') {
      setFormData({
        projectTitle: group.projectTitle,
        description: group.description || "",
        technologyStack: group.technologyStack || [],
        domain: group.domain || "",
        year: group.year || "",
        members: group.members?.map(m => m._id) || []
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTechAdd = (tech) => {
    if (tech && !formData.technologyStack.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        technologyStack: [...prev.technologyStack, tech]
      }));
    }
  };

  const handleTechRemove = (tech) => {
    setFormData(prev => ({
      ...prev,
      technologyStack: prev.technologyStack.filter(t => t !== tech)
    }));
  };

  // API calls
  const handleUpdateGroup = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/faculty/update-group/${selectedGroup._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Group updated");
      setGroups(groups.map(g => g._id === selectedGroup._id ? data.data : g));
      closeModal();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/faculty/delete-group/${selectedGroup._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Group deleted");
      setGroups(groups.filter(g => g._id !== selectedGroup._id));
      closeModal();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Student select component
  const StudentSelect = () => {
    const options = allStudents.map(student => ({
      value: student._id,
      label: `${student.name} (${student.rollNo || 'No Roll No'})`
    }));

    const selected = formData.members.map(memberId => {
      const student = allStudents.find(s => s._id === memberId);
      return {
        value: memberId,
        label: `${student?.name || 'Unknown'} (${student?.rollNo || 'No Roll No'})`
      };
    });

    return (
      <Select
        isMulti
        options={options}
        value={selected}
        onChange={(selected) => setFormData(prev => ({
          ...prev,
          members: selected.map(option => option.value)
        }))}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Select students..."
      />
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">My Project Groups</h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md p-2 border rounded"
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-10">
          <LoaderCircle className="animate-spin mx-auto" size={32} />
          <p>Loading...</p>
        </div>
      )}

      {/* Groups list */}
      {!loading && filteredGroups.length === 0 ? (
        <p>No groups found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2  lg:grid-cols-3">
          {filteredGroups.map(group => (
            <div key={group._id} className="border bg-white  rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-lg">{group.projectTitle}</h3>
              <p className="text-sm text-gray-600 my-2">
                {group.description || "No description"}
              </p>
              
              <div className="flex flex-wrap gap-2 my-2">
                {group.technologyStack?.slice(0, 3).map(tech => (
                  <span key={tech} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm">
                  {group.members?.length || 0} members
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openModal('view', group)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Users size={18} />
                  </button>
                  <button 
                    onClick={() => openModal('edit', group)}
                    className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => openModal('delete', group)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {modalOpen === 'view' && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{selectedGroup.projectTitle}</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
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
                    {selectedGroup.technologyStack?.map(tech => (
                      <span key={tech} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
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
                      {selectedGroup.members.map(member => (
                        <li key={member._id} className="flex items-center gap-3 p-2 border rounded">
                          <img
                            src={member.profileImage || `https://ui-avatars.com/api/?name=${member.name}&background=random`}
                            alt={member.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p>{member.name}</p>
                            <p className="text-sm text-gray-600">{member.email}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No members</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modalOpen === 'edit' && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Edit Group</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleUpdateGroup(); }}>
                <div className="space-y-4">
                  <div>
                    <label>Project Title</label>
                    <input
                      type="text"
                      name="projectTitle"
                      value={formData.projectTitle}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label>Technologies</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleTechAdd(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        placeholder="Add technology (press Enter)"
                        className="flex-1 p-2 border rounded"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.technologyStack.map(tech => (
                        <div key={tech} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {tech}
                          <button
                            type="button"
                            onClick={() => handleTechRemove(tech)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label>Domain</label>
                      <input
                        type="text"
                        name="domain"
                        value={formData.domain}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label>Year</label>
                      <input
                        type="text"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label>Members</label>
                    <StudentSelect />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modalOpen === 'delete' && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Delete Group</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <p>Are you sure you want to delete <strong>{selectedGroup.projectTitle}</strong>?</p>
                <p className="text-sm text-gray-600">This action cannot be undone.</p>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteGroup}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyProjectGroups;