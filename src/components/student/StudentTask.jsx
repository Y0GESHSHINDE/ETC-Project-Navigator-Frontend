import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  Loader2,
  UploadCloud,
  Calendar,
  Award,
  User,
  BookOpen,
  Clock,
  Upload,
  Eye,
  MessageSquare,
} from "lucide-react";

const StudentTask = () => {
  const [groupData, setGroupData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [uploadingTaskId, setUploadingTaskId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});
  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchGroupData = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/student/get-my-group`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroupData(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch group info");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/student/get-all-task/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchGroupData();
    fetchTasks();
  }, []);

  const handleFileChange = (e, taskId) => {
    setSelectedFiles({ ...selectedFiles, [taskId]: e.target.files[0] });
  };

  const handleSubmit = async (taskId) => {
    const file = selectedFiles[taskId];
    if (!file) {
      toast.warning("Please select a file.");
      return;
    }

    if (file.type !== "application/pdf" || file.size > 10 * 1024 * 1024) {
      toast.error("Only PDF up to 10MB allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadingTaskId(taskId);
    try {
      await axios.post(
        `${apiBaseUrl}/api/student/submission/${groupData._id}/tasks/${taskId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Submission successful");
      setSelectedFiles({ ...selectedFiles, [taskId]: null });
      await fetchGroupData();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingTaskId(null);
    }
  };

  const getSubmission = (taskId) =>
    groupData?.submissions?.find((s) => s.taskId === taskId);

  const isTaskActive = (taskId) =>
    groupData?.taskStatus?.find((t) => t.taskId === taskId)?.isActive;

  const getStudentMarks = (submission) => {
    const studentId = groupData?.members?.[0]?._id;
    return submission?.marksPerStudent?.find((m) => m.studentId === studentId)
      ?.marks;
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "resubmit":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "resubmit":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Project Tasks
              </h1>
            </div>
            <p className="text-slate-600 text-sm sm:text-base">
              Manage and submit your academic project tasks
            </p>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="space-y-6">
          {tasks.map((task) => {
            const active = isTaskActive(task._id);
            const submission = getSubmission(task._id);
            const canSubmit =
              task.isSubmissionRequired &&
              active &&
              (!submission || submission.status === "resubmit");
            const isExpanded = expandedTasks[task._id];

            return (
              <div
                key={task._id}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
                {/* Task Header */}
                <div className="p-4 sm:p-6 border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg w-fit">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                            Task {task.taskNo}: {task.title}
                          </h2>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                                active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}>
                              <div
                                className={`w-2 h-2 rounded-full mr-2 ${
                                  active ? "bg-green-500" : "bg-red-500"
                                }`}
                              />
                              {active ? "Active" : "Inactive"}
                            </span>
                            {task.isSubmissionRequired && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-amber-100 text-amber-700">
                                <Upload className="w-3 h-3 mr-1" />
                                Submission Required
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-left sm:text-right">
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                          <Award className="w-4 h-4" />
                          <span className="font-medium">Max Marks</span>
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">
                          {task.marks}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleTaskExpansion(task._id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors self-end sm:self-auto">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                <div
                  className={`transition-all duration-300 ${
                    isExpanded
                      ? "max-h-none opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}>
                  <div className="p-4 sm:p-6 space-y-6">
                    {/* Task Description */}
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <MessageSquare className="w-4 h-4" />
                        Description
                      </h3>
                      <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                        {task.description}
                      </p>
                    </div>

                    {/* Submission Status */}
                    {submission && (
                      <div className="bg-white border-2 border-slate-100 rounded-xl p-4 sm:p-6">
                        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
                          <Eye className="w-4 h-4" />
                          Submission Status
                        </h3>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(submission.status)}
                            <span
                              className={`px-4 py-2 rounded-lg border font-medium ${getStatusColor(
                                submission.status
                              )}`}>
                              {submission.status.charAt(0).toUpperCase() +
                                submission.status.slice(1)}
                            </span>
                          </div>

                          <div>
                            <a
                              href={submission.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 text-sm">
                              <Download className="w-4 h-4 mr-2" />
                              View Submitted File
                            </a>
                          </div>

                          {submission.teacherRemark && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                              <h4 className="font-semibold text-amber-800 mb-2 text-sm">
                                Teacher's Feedback
                              </h4>
                              <p className="text-amber-700 text-sm">
                                {submission.teacherRemark}
                              </p>
                            </div>
                          )}

                          {submission.status === "approved" && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2 text-sm">
                                <Award className="w-4 h-4" />
                                Marks Awarded
                              </h4>
                              <div className="text-xl font-bold text-green-700">
                                {getStudentMarks(submission)} / {task.marks}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* File Upload Section */}
                    {canSubmit && (
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6">
                        <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
                          <UploadCloud className="w-4 h-4" />
                          Submit Your Work
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-blue-700 mb-2">
                              Choose PDF file (Max 10MB)
                            </label>
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(e) => handleFileChange(e, task._id)}
                              className="block w-full max-w-full text-sm text-slate-500 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition-colors border border-blue-200 rounded-lg"
                            />
                          </div>

                          <button
                            onClick={() => handleSubmit(task._id)}
                            disabled={uploadingTaskId === task._id}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-sm">
                            {uploadingTaskId === task._id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <UploadCloud className="w-4 h-4 mr-2" />
                                Submit Task
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Always visible summary */}
                {!isExpanded && (
                  <div className="px-4 sm:px-6 pb-4 text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-slate-600">
                      <span className="break-words">
                        {task.description.substring(0, 100)}...
                      </span>
                      {submission && (
                        <div className="flex items-center gap-2">
                          {getStatusIcon(submission.status)}
                          <span className="font-medium">
                            {submission.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                No Tasks Available
              </h3>
              <p className="text-slate-500">
                Tasks will appear here once they are assigned by your
                instructor.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTask;
