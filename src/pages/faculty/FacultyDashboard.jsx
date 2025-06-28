import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  BookOpen,
  LayoutDashboard,
  List,
  UserPlus,
  PlusCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function FacultyDashboard() {
  const token = localStorage.getItem("token");
  const [groups, setGroups] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch faculty groups
  const fetchGroups = async () => {
    try {
      const res = await axios.get(
        `${apiBaseUrl}/api/faculty/get-my-groups`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroups(res.data.data || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${apiBaseUrl}/api/faculty/get-all-task/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchGroups(), fetchTasks()]).finally(() => setLoading(false));
  }, []);

  // Calculate stats
  const totalGroups = groups.length;
  const totalTasks = tasks.length;

  // Total students in all groups
  const totalStudents = groups.reduce(
    (acc, g) => acc + (g.members?.length || 0),
    0
  );

  // Total active tasks count across all groups
  const totalActiveTasks = groups.reduce((acc, g) => {
    return (
      acc +
      (g.taskStatus
        ? g.taskStatus.filter((ts) => ts.isActive === true).length
        : 0)
    );
  }, 0);

  // Total pending evaluations count: submissions with status 'submitted' or 'resubmit'
  const totalPendingEvaluations = groups.reduce((acc, g) => {
    return (
      acc +
      (g.submissions
        ? g.submissions.filter(
            (sub) => sub.status === "submitted" || sub.status === "resubmit"
          ).length
        : 0)
    );
  }, 0);

  // Recent activated tasks (last 5 by activatedAt)
  const recentActivatedTasks = [];
  groups.forEach((g) => {
    (g.taskStatus || []).forEach((ts) => {
      if (ts.isActive && ts.activatedAt) {
        recentActivatedTasks.push({
          groupTitle: g.projectTitle,
          taskId: ts.taskId,
          activatedAt: ts.activatedAt,
        });
      }
    });
  });
  recentActivatedTasks.sort(
    (a, b) => new Date(b.activatedAt) - new Date(a.activatedAt)
  );
  const recentActivatedTasksTop5 = recentActivatedTasks.slice(0, 5);

  // Recent pending submissions (last 5)
  const recentPendingSubs = [];
  groups.forEach((g) => {
    (g.submissions || []).forEach((sub) => {
      if (sub.status === "submitted" || sub.status === "resubmit") {
        recentPendingSubs.push({
          groupTitle: g.projectTitle,
          fileUrl: sub.fileUrl,
          status: sub.status,
          submittedBy: sub.submittedBy, // could fetch name if populated, else id
          updatedAt: sub.updatedAt,
        });
      }
    });
  });
  recentPendingSubs.sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );
  const recentPendingSubsTop5 = recentPendingSubs.slice(0, 5);

  const navButtons = [
    { label: "My Groups", to: "/faculty/get-my-groups", icon: LayoutDashboard },
    { label: "Task Panel", to: "/faculty/task", icon: ClipboardList },
    { label: "Evaluation Panel", to: "/faculty/evaluation", icon: CheckCircle },
    { label: "Student List", to: "/faculty/student-list", icon: Users },
    { label: "Add Student", to: "/faculty/add-student", icon: UserPlus },
    { label: "Create Group", to: "/faculty/createGroup", icon: PlusCircle },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-gray-900">
        Faculty Dashboard
      </h1>
      <p className="text-gray-600">
        Welcome, manage your project groups, tasks, and evaluations here.
      </p>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {navButtons.map(({ label, to, icon: Icon }) => (
          <Link
            key={label}
            to={to}
            className="flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-400 transition">
            <Icon className="w-5 h-5 text-blue-600" />
            {label}
          </Link>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <Users className="w-10 h-10 text-indigo-600 mb-2" />
          <h2 className="text-xl font-bold">{totalStudents}</h2>
          <p className="text-gray-500">Total Students</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <LayoutDashboard className="w-10 h-10 text-green-600 mb-2" />
          <h2 className="text-xl font-bold">{totalGroups}</h2>
          <p className="text-gray-500">My Groups</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <ClipboardList className="w-10 h-10 text-blue-600 mb-2" />
          <h2 className="text-xl font-bold">{totalTasks}</h2>
          <p className="text-gray-500">Total Tasks</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <CheckCircle className="w-10 h-10 text-yellow-600 mb-2" />
          <h2 className="text-xl font-bold">{totalActiveTasks}</h2>
          <p className="text-gray-500">Active Tasks</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <AlertCircle className="w-10 h-10 text-red-600 mb-2" />
          <h2 className="text-xl font-bold">{totalPendingEvaluations}</h2>
          <p className="text-gray-500">Pending Evaluations</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activated Tasks */}
        <section className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold mb-4">Recent Activated Tasks</h3>
          {recentActivatedTasksTop5.length === 0 ? (
            <p className="text-gray-500">No tasks activated recently.</p>
          ) : (
            <ul className="space-y-3">
              {recentActivatedTasksTop5.map(
                ({ groupTitle, taskId, activatedAt }, i) => {
                  const task = tasks.find((t) => t._id === taskId);
                  return (
                    <li
                      key={i}
                      className="flex justify-between border-b border-gray-200 pb-2">
                      <div>
                        <p className="font-medium text-gray-800">
                          {task ? task.title : "Unknown Task"}
                        </p>
                        <p className="text-sm text-gray-500">{groupTitle}</p>
                      </div>
                      <time
                        className="text-sm text-gray-400 whitespace-nowrap"
                        dateTime={activatedAt}
                        title={new Date(activatedAt).toLocaleString()}>
                        {new Date(activatedAt).toLocaleDateString()}
                      </time>
                    </li>
                  );
                }
              )}
            </ul>
          )}
        </section>

        {/* Recent Pending Evaluations */}
        <section className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold mb-4">
            Recent Pending Evaluations
          </h3>
          {recentPendingSubsTop5.length === 0 ? (
            <p className="text-gray-500">No pending evaluations.</p>
          ) : (
            <ul className="space-y-3">
              {recentPendingSubsTop5.map(
                ({ groupTitle, status, fileUrl, updatedAt }, i) => (
                  <li
                    key={i}
                    className="flex flex-col border-b border-gray-200 pb-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-800">{groupTitle}</p>
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded ${
                          status === "submitted"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                        {status.toUpperCase()}
                      </span>
                    </div>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm mt-1">
                      View Submission
                    </a>
                    <time
                      className="text-gray-400 text-xs mt-1"
                      dateTime={updatedAt}
                      title={new Date(updatedAt).toLocaleString()}>
                      Submitted: {new Date(updatedAt).toLocaleDateString()}
                    </time>
                  </li>
                )
              )}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
