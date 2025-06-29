import React, { useEffect, useState } from "react";
import Select from "react-select";
import { FileText, BadgeCheck, Loader2, Ban, BookOpen, Users, Award, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FacultyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loadingTaskId, setLoadingTaskId] = useState(null);

  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // ✅ Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/faculty/get-all-task/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const mappedTasks = data.tasks.map((task) => ({
        id: task._id,
        title: task.title,
        taskNo: task.taskNo,
        description: task.description,
        isSubmissionRequired: task.isSubmissionRequired,
        marks: task.marks,
      }));

      setTasks(mappedTasks);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    }
  };

  // ✅ Fetch faculty groups
  const fetchGroups = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/faculty/get-my-groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      const groupOptions = data.data.map((group) => ({
        label: group.projectTitle,
        value: group._id,
        fullGroup: group,
      }));

      setGroups(groupOptions);

      // Update selected group data if already selected
      if (selectedGroup) {
        const updated = groupOptions.find((g) => g.value === selectedGroup.value);
        setSelectedGroup(updated || null);
      }
    } catch (err) {
      toast.error("Failed to fetch groups");
    }
  };

  const handleActivateTask = async (taskId) => {
    if (!selectedGroup) return toast.warning("Select a group first");

    setLoadingTaskId(taskId);
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/faculty/group/${selectedGroup.value}/task/${taskId}/activate`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if(data.isActive === "true"){
        return toast.warn("Task is already active.");
      }
      toast.success("Task activated");

      // Refresh group data to reflect updated task status
      await fetchGroups();
    } catch {
      toast.error("Activation failed");
    } finally {
      setLoadingTaskId(null);
    }
  };

  const handleDeactivateTask = async (taskId) => {
    if (!selectedGroup) return toast.warning("Select a group first");

    setLoadingTaskId(taskId);
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/faculty/group/${selectedGroup.value}/task/${taskId}/deactivate`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if(data.isActive === "false"){
        return toast.warn("Task is not active.");
      }
      toast.success("Task deactivated");

      // Refresh group data to reflect updated task status
      await fetchGroups();
    } catch {
      toast.error("de Activation failed");
    } finally {
      setLoadingTaskId(null);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchGroups();
  }, []);

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: '12px',
      border: state.isFocused ? '2px solid #3b82f6' : '2px solid #e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
      padding: '4px 8px',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      '&:hover': {
        borderColor: '#3b82f6',
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      padding: '12px 16px',
      fontSize: '14px',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
      fontSize: '14px',
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ToastContainer 
        position="top-right" 
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-xl shadow-lg"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Project Task Management</h1>
              <p className="text-gray-600 mt-1">Manage and monitor student project tasks</p>
            </div>
          </div>
        </div>

        {/* Group Selection Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Select Project Group</h2>
          </div>
          <Select
            options={groups}
            value={selectedGroup}
            onChange={(selected) => setSelectedGroup(selected)}
            placeholder="Choose a project group to manage..."
            className="w-full max-w-2xl"
            styles={customSelectStyles}
            isSearchable
          />
          {selectedGroup && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Selected:</span> {selectedGroup.label}
              </p>
            </div>
          )}
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {tasks.map((task) => {
            const statusEntry = selectedGroup?.fullGroup?.taskStatus?.find(
              (ts) => ts.taskId === task.id
            );
            const isActive = statusEntry?.isActive;

            return (
              <div
                key={task.id}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          Task {task.taskNo}
                        </h3>
                        <p className="text-xs text-gray-500">Academic Assignment</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-lg">
                      <Award className="w-3 h-3" />
                      <span className="text-xs font-medium">{task.marks}pts</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-lg leading-tight">
                    {task.title}
                  </h4>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {task.description}
                  </p>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                        task.isSubmissionRequired
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-orange-100 text-orange-700 border border-orange-200"
                      }`}
                    >
                      {task.isSubmissionRequired ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Submission Required
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          Review Task
                        </>
                      )}
                    </span>

                    {selectedGroup && (
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                          isActive
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleActivateTask(task.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loadingTaskId === task.id}
                    >
                      {loadingTaskId === task.id ? (
                        <>
                          <Loader2 className="w-3 h-4 animate-spin" />
                          <span className="text-sm">Activating...</span>
                        </>
                      ) : (
                        <>
                          <BadgeCheck className="w-3 h-4" />
                          <span className="text-sm">Activate</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeactivateTask(task.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loadingTaskId === task.id}
                    >
                      {loadingTaskId === task.id ? (
                        <>
                          <Loader2 className="w-3 h-4 animate-spin" />
                          <span className="text-sm">Working...</span>
                        </>
                      ) : (
                        <>
                          <Ban className="w-3 h-4" />
                          <span className="text-sm">Deactivate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks available</h3>
            <p className="text-gray-500">Tasks will appear here once they are created.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyTasks;