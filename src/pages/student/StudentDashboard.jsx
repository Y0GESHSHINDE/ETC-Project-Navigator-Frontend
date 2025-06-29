import React, { useEffect, useState } from "react";
import {
  Folder,
  FileUp,
  UserCircle,
  BookOpen,
  Users,
  Target,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  Star,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom"; // Using anchor tags for navigation

export default function StudentDashboard() {
  const [groupData, setGroupData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    async function fetchGroup() {
      setLoading(true);
      try {
        const res = await fetch(`${apiBaseUrl}/api/student/get-my-group`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userres = await fetch(
          `${apiBaseUrl}/api/student/student-profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch your project group.");
        if (!userres.ok) throw new Error("Failed to fetch student data.");

        const json = await res.json();
        const data = await userres.json();

        if (json.success && data.success) {
          setGroupData(json.data);
          setUserData(data.data);
        } else {
          toast.error("Failed to load your group data.");
        }
      } catch (error) {
        toast.error(error.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchGroup();
  }, [apiBaseUrl, token]);

  // Derived values
  let studentId = null;
  let studentMarks = 0;
  let totalMarks = 100;
  let totalTasks = 0;
  let activeTasks = 0;
  let inactiveTasks = 0;
  let totalSubmissions = 0;
  let approvedSubmissions = 0;

  if (userData && groupData) {
    studentId = userData._id;

    if (groupData.submissions?.length) {
      groupData.submissions.forEach((submission) => {
        submission.marksPerStudent.forEach((m) => {
          if (m.studentId === studentId) studentMarks += m.marks;
        });
      });
    }

    totalTasks = groupData.taskStatus?.length || 0;
    activeTasks = groupData.taskStatus?.filter((t) => t.isActive).length || 0;
    inactiveTasks = totalTasks - activeTasks;

    totalSubmissions = groupData.submissions?.length || 0;
    approvedSubmissions =
      groupData.submissions?.filter((s) => s.status === "approved").length || 0;
  }

  const progressPercentage =
    totalMarks > 0 ? (studentMarks / totalMarks) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="  border-slate-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-1xl lg:text-2xl font-bold text-slate-800 mb-1 sm:mb-2">
                Academic Dashboard
              </h1>
              <p className="text-slate-600 text-sm sm:text-base lg:text-lg">
                Track your project progress and achievements
              </p>
            </div>
            {/* <div className="flex justify-center sm:justify-end">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold shadow-lg text-sm sm:text-base">
                <Calendar className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden xs:inline">Academic Year </span>2024-25
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {loading || !groupData || !userData ? (
        <div className="flex items-center justify-center min-h-96 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600 text-base sm:text-lg">
              Loading your academic data...
            </p>
          </div>
        </div>
      ) : (

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
          
          {/* Performance Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-2 sm:mb-0 w-fit">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-slate-800">
                    {totalTasks}
                  </span>
                </div>
                <h3 className="text-slate-600 font-medium text-sm sm:text-base">
                  Total Tasks
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Project assignments
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-2 sm:mb-0 w-fit">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-slate-800">
                    {activeTasks}
                  </span>
                </div>
                <h3 className="text-slate-600 font-medium text-sm sm:text-base">
                  Active Tasks
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Currently working
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-4">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-2 sm:mb-0 w-fit">
                    <FileUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-slate-800">
                    {approvedSubmissions}
                  </span>
                </div>
                <h3 className="text-slate-600 font-medium text-sm sm:text-base">
                  Approved
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Out of {totalSubmissions}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-2 sm:mb-0 w-fit">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-slate-800">
                    {studentMarks}
                  </span>
                </div>
                <h3 className="text-slate-600 font-medium text-sm sm:text-base">
                  Total Score
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Out of {totalMarks}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-white gap-4">
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
                    Academic Progress
                  </h2>
                  <p className="text-indigo-100 text-sm sm:text-base">
                    Your current performance overview
                  </p>
                </div>
                <div className="text-center sm:text-right">
                  <div className="text-2xl sm:text-3xl font-bold">
                    {progressPercentage.toFixed(1)}%
                  </div>
                  <div className="text-indigo-100 text-xs sm:text-sm">
                    Overall Score
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-6">
                <div className="bg-white/20 rounded-full h-2 sm:h-3">
                  <div
                    className="bg-white rounded-full h-2 sm:h-3 transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Project Overview
                </h2>
              </div>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2 text-sm sm:text-base">
                    {groupData.projectTitle}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {groupData.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <span className="text-slate-500 text-xs sm:text-sm font-medium">
                      Domain
                    </span>
                    <p className="text-slate-800 font-semibold text-sm sm:text-base">
                      {groupData.domain}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs sm:text-sm font-medium">
                      Year
                    </span>
                    <p className="text-slate-800 font-semibold text-sm sm:text-base">
                      {groupData.year}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-xs sm:text-sm font-medium">
                    Technology Stack
                  </span>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                    {groupData.technologyStack?.length ? (
                      groupData.technologyStack.map((tech, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs sm:text-sm">
                        No tech stack specified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Project Team
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                {/* Guide Section */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-slate-700 font-semibold mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-amber-500" />
                    Project Guide
                  </h3>
                  <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl">
                    <img
                      src={
                        groupData.guideId.profileImage ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          groupData.guideId.name
                        )}&background=4f46e5&color=ffffff`
                      }
                      alt={groupData.guideId.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-md"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                        {groupData.guideId.name}
                      </p>
                      <p className="text-slate-600 text-xs sm:text-sm truncate">
                        {groupData.guideId.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <h3 className="text-slate-700 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Team Members
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {groupData.members?.length ? (
                      groupData.members.map((member, index) => (
                        <div
                          key={member._id}
                          className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 bg-slate-50 rounded-lg sm:rounded-xl hover:bg-slate-100 transition-colors">
                          <img
                            src={
                              member.profileImage ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                member.name
                              )}&background=random`
                            }
                            alt={member.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-slate-800 text-sm sm:text-base truncate">
                              {member.name}
                            </p>
                            <p className="text-slate-600 text-xs sm:text-sm truncate">
                              {member.email}
                            </p>
                            <p className="text-slate-500 text-xs">
                              Roll: {member.rollNo}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-center py-4 text-sm">
                        No team members found
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submissions Section */}
          {groupData.submissions?.length > 0 && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Submission History
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {groupData.submissions.map((submission, index) => {
                    const marksObj = submission.marksPerStudent.find(
                      (m) => m.studentId === studentId
                    );
                    return (
                      <div
                        key={submission._id}
                        className="border border-slate-200 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col xs:flex-row xs:items-center space-y-2 xs:space-y-0 xs:space-x-3 mb-2">
                              <span className="bg-slate-100 text-slate-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit">
                                Task #{submission.taskId}
                              </span>
                              <span
                                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit ${
                                  submission.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}>
                                {submission.status === "approved" ? (
                                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                                ) : (
                                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                                )}
                                {submission.status}
                              </span>
                            </div>
                            <p className="text-slate-600 text-xs sm:text-sm mb-2 break-words">
                              <strong>Feedback:</strong>{" "}
                              {submission.teacherRemark || "No feedback yet"}
                            </p>
                          </div>
                          <div className="text-center sm:text-right flex-shrink-0">
                            <div className="text-xl sm:text-2xl font-bold text-slate-800">
                              {marksObj ? marksObj.marks : "-"}
                            </div>
                            <div className="text-slate-500 text-xs sm:text-sm">
                              marks
                            </div>
                          </div>
                        </div>
                        <a
                          href={submission.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium text-xs sm:text-sm transition-colors">
                          <FileUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          View Submission
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Quick Actions
              </h2>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <a
                  href="/student/project"
                  className="group flex flex-col items-center justify-center p-6 sm:p-8 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl sm:rounded-2xl border-2 border-indigo-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300">
                  <div className="bg-indigo-600 rounded-full p-3 sm:p-4 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    <Folder className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-2">
                    View Project
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm text-center">
                    Access your project details and documentation
                  </p>
                </a>

                <a
                  href="/student/task"
                  className="group flex flex-col items-center justify-center p-6 sm:p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl border-2 border-green-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                  <div className="bg-green-600 rounded-full p-3 sm:p-4 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    <FileUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-2">
                    Submit Tasks
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm text-center">
                    Upload and manage your task submissions
                  </p>
                </a>

                <a
                  href="/student/profile"
                  className="group flex flex-col items-center justify-center p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl sm:rounded-2xl border-2 border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 sm:col-span-2 lg:col-span-1">
                  <div className="bg-purple-600 rounded-full p-3 sm:p-4 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    <UserCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-2">
                    Profile
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm text-center">
                    Update your personal information
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
