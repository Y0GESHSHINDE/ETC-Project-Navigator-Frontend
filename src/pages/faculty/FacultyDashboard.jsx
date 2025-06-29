import React, { useEffect, useState } from "react";
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
  Calendar,
  Clock,
  FileText,
  TrendingUp,
  Award,
  Activity,
  ChevronRight,
  Download,
  Eye,
  Bell,
  Settings,
  Filter,
  Search,
  MoreVertical,
  GraduationCap,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function FacultyDashboard() {
  const token = localStorage.getItem("token");
  const [groups, setGroups] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [UserData, setUserData] = useState([])
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/faculty/get-faculty`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        // console.log(data.data);
        if (data.success) {
          setUserData(data.data);
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

    fetchUserData();
  }, [apiBaseUrl, token]);

  console.log();

  // Fetch faculty groups
  const fetchGroups = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/faculty/get-my-groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setGroups(data.data || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/faculty/get-all-task/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data.tasks || []);
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
          submittedBy: sub.submittedBy,
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
    {
      label: "My Groups",
      to: "/faculty/get-my-groups",
      icon: LayoutDashboard,
      color: "blue",
    },
    {
      label: "Task Panel",
      to: "/faculty/task",
      icon: ClipboardList,
      color: "purple",
    },
    {
      label: "Evaluation Panel",
      to: "/faculty/evaluation",
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "Student List",
      to: "/faculty/student-list",
      icon: Users,
      color: "indigo",
    },
    {
      label: "Add Student",
      to: "/faculty/add-student",
      icon: UserPlus,
      color: "orange",
    },
    {
      label: "Create Group",
      to: "/faculty/createGroup",
      icon: PlusCircle,
      color: "pink",
    },
  ];

  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: GraduationCap,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Active Groups",
      value: totalGroups,
      icon: Users,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: Target,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      change: "+15%",
      changeType: "positive",
    },
    {
      title: "Active Tasks",
      value: totalActiveTasks,
      icon: Activity,
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
      change: "5",
      changeType: "neutral",
    },
    {
      title: "Pending Reviews",
      value: totalPendingEvaluations,
      icon: AlertCircle,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      change: totalPendingEvaluations > 10 ? "High" : "Normal",
      changeType: totalPendingEvaluations > 10 ? "negative" : "positive",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <BookOpen className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
          </div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      {/* <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Faculty Portal
                  </h1>
                  <p className="text-sm text-gray-500">
                    Academic Management System
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                {totalPendingEvaluations > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {totalPendingEvaluations > 9
                      ? "9+"
                      : totalPendingEvaluations}
                  </span>
                )}
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Welcome Back, {UserData.name}! 👋
                </h2>
                {/* <p className="text-blue-100 text-lg">
                  Ready to manage your academic projects and guide your students
                  to success.
                </p> */}
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Quick Actions
            </h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons - responsive layout */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-m lg:grid-cols-3 xl:grid-cols-6 gap-4 flex-wrap">
            {navButtons.map(({ label, to, icon: Icon, color }) => (
              <Link
                to={to}
                key={label}
                className="group flex flex-col sm:flex-row items-center justify-center sm:justify-between w-full lg:w-auto p-2 sm:px-4 sm:py-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
                <div className="flex flex-col sm:flex-row items-center sm:space-x-3 text-center sm:text-left">
                  <div
                    className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-5 h-5 text-${color}-600`} />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-800 group-hover:text-gray-700 mt-1 sm:mt-0">
                    {label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform group-hover:translate-x-1 hidden sm:block mt-2 sm:mt-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map(
            ({ title, value, icon: Icon, color, change, changeType }) => (
              <div
                key={title}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow">
                <div className={`${color} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm font-medium">
                        {title}
                      </p>
                      <p className="text-3xl font-bold mt-1">{value}</p>
                    </div>
                    <Icon className="w-8 h-8 text-white/80" />
                  </div>
                </div>
                <div className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        changeType === "positive"
                          ? "bg-green-100 text-green-700"
                          : changeType === "negative"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                      {change}
                    </span>
                    <span className="text-xs text-gray-500">vs last month</span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activated Tasks */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Recent Activated Tasks</h3>
                  <p className="text-purple-100 text-sm">
                    Latest task assignments
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="p-6">
              {recentActivatedTasksTop5.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No recent task activations
                  </p>
                  <p className="text-gray-400 text-sm">
                    New activations will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivatedTasksTop5.map(
                    ({ groupTitle, taskId, activatedAt }, i) => {
                      const task = tasks.find((t) => t._id === taskId);
                      return (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Target className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {task ? task.title : "Unknown Task"}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {groupTitle}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <time
                              className="text-sm text-gray-400 block"
                              dateTime={activatedAt}
                              title={new Date(activatedAt).toLocaleString()}>
                              {new Date(activatedAt).toLocaleDateString()}
                            </time>
                            <span className="text-xs text-gray-400">
                              {new Date(activatedAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Recent Pending Evaluations */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-red-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Pending Evaluations</h3>
                  <p className="text-amber-100 text-sm">
                    Submissions awaiting review
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="p-6">
              {recentPendingSubsTop5.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">All caught up!</p>
                  <p className="text-gray-400 text-sm">
                    No pending evaluations
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPendingSubsTop5.map(
                    ({ groupTitle, status, fileUrl, updatedAt }, i) => (
                      <div
                        key={i}
                        className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">
                            {groupTitle}
                          </h4>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              status === "submitted"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                            {status.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors">
                              <Eye className="w-4 h-4" />
                              <span>View Submission</span>
                            </a>
                          </div>
                          <time
                            className="text-xs text-gray-400"
                            dateTime={updatedAt}
                            title={new Date(updatedAt).toLocaleString()}>
                            {new Date(updatedAt).toLocaleDateString()}
                          </time>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
