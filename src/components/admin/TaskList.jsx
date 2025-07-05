import React, { useEffect, useState } from "react";
import {
  FileText,
  PlusCircle,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    taskNo: "",
    title: "",
    description: "",
    marks: 10,
    isSubmissionRequired: true,
  });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/admin/get-all-task/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!form.taskNo || !form.title || !form.description) {
      return toast.warn("All fields are required");
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/admin/add-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Task creation failed");

      toast.success("Task created");
      setForm({
        taskNo: "",
        title: "",
        description: "",
        marks: 10,
        isSubmissionRequired: true,
      });
      fetchTasks();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    setDeletingId(taskId);
    try {
      const res = await fetch(`${apiBaseUrl}/api/admin/delete-task/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      toast.success("Task deleted");
      fetchTasks();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <ToastContainer />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Admin Task Manager
        </h1>

        {/* Form to Add Task */}
        <form
          onSubmit={handleAddTask}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-green-500" />
            Add New Task
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input
              type="number"
              placeholder="Task Number"
              value={form.taskNo}
              onChange={(e) => setForm({ ...form, taskNo: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              required
            />
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              required
            />
            <input
              type="number"
              placeholder=" Marks"
            //   value={form.marks}
              onChange={(e) => setForm({ ...form, marks: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
            <select
              value={form.isSubmissionRequired}
              onChange={(e) =>
                setForm({ ...form, isSubmissionRequired: e.target.value === "true" })
              }
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            >
              <option value="true">Submission Required</option>
              <option value="false">No Submission</option>
            </select>
          </div>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
            rows={3}
            required
          ></textarea>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Creating...
              </span>
            ) : (
              "Create Task"
            )}
          </button>
        </form>

        {/* Task List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between"
            >
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Task {task.taskNo}: {task.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-sm mt-2 text-gray-500">
                  Marks: <strong>{task.marks}</strong> |{" "}
                  {task.isSubmissionRequired ? "Submission Required" : "No Submission"}
                </p>
              </div>

              <button
                onClick={() => handleDelete(task._id)}
                className="self-end text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                disabled={deletingId === task._id}
              >
                {deletingId === task._id ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" /> Delete
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center mt-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No tasks created yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
