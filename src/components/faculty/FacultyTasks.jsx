import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { FileText, BadgeCheck, Loader2, Ban } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure this is imported once

const FacultyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loadingTaskId, setLoadingTaskId] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/faculty/get-all-task/", {
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
      const res = await fetch("http://localhost:5000/api/faculty/get-my-groups", {
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
        `http://localhost:5000/api/faculty/group/${selectedGroup.value}/task/${taskId}/activate`,
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
        `http://localhost:5000/api/faculty/group/${selectedGroup.value}/task/${taskId}/deactivate`,
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

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ToastContainer position="top-right" autoClose={2500} />

      <h1 className="text-2xl font-bold mb-4">Project Tasks</h1>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium">
          Select Project Group:
        </label>
        <Select
          options={groups}
          value={selectedGroup}
          onChange={(selected) => setSelectedGroup(selected)}
          placeholder="Choose a group"
          className="w-full max-w-md rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map((task) => {
          const statusEntry = selectedGroup?.fullGroup?.taskStatus?.find(
            (ts) => ts.taskId === task.id
          );
          const isActive = statusEntry?.isActive;

          return (
            <div
              key={task.id}
              className="border border-gray-200 rounded-xl p-2 sm:p-5 shadow-md bg-white"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
                  <FileText className="w-5 h-5" />
                  Task {task.taskNo}: {task.title}
                </h2>
                <span className="text-sm text-gray-600">{task.marks} marks</span>
              </div>

              <p className="text-sm text-gray-800 mb-2">{task.description}</p>

              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    task.isSubmissionRequired
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.isSubmissionRequired ? "Submission Required" : "Review Task"}
                </span>

                {selectedGroup && (
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleActivateTask(task.id)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
                  disabled={loadingTaskId === task.id}
                >
                  {loadingTaskId === task.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Activating...
                    </>
                  ) : (
                    <>
                      <BadgeCheck className="w-4 h-4" />
                      Activate
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDeactivateTask(task.id)}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition"
                  disabled={loadingTaskId === task.id}
                >
                  {loadingTaskId === task.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Working...
                    </>
                  ) : (
                    <>
                      <Ban className="w-4 h-4" />
                      Deactivate
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FacultyTasks;
