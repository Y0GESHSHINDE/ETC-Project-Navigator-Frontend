import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  CheckCircle, // For approved status
  AlertCircle, // For resubmit status
  FileText, // For default/submitted status
  Download, // For download button
  ChevronDown, // For expandable sections
  ChevronUp, // For collapsible sections
  Loader2, // For loading states (spinner)
  UploadCloud,
} from "lucide-react";

const StudentTask = () => {
  const [groupData, setGroupData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [uploadingTaskId, setUploadingTaskId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const fetchGroupData = async () => {
    try {
      const res = await axios.get(
        `${apiBaseUrl}/api/student/get-my-group`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroupData(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch group info");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${apiBaseUrl}/api/student/get-all-task/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      await fetchGroupData(); // Refresh data
      setSelectedFiles({ ...selectedFiles, [taskId]: null });
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

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 ">Update Project Tasks</h1>
      {tasks.map((task) => {
        const active = isTaskActive(task._id);
        const submission = getSubmission(task._id);
        const canSubmit =
          task.isSubmissionRequired &&
          active &&
          (!submission || submission.status === "resubmit");

        return (
          <div
            key={task._id}
            className="bg-white  shadow-sm  border rounded-lg p-4 mb-6 ">
            <div className="flex items-center justify-between ">
              <h2 className="font-semibold text-blue-700 flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5" />
                Task {task.taskNo}: {task.title}
              </h2>
              <span className="text-sm text-gray-600">{task.marks} Marks</span>
            </div>

            <p className="text-gray-700 text-sm mt-1">{task.description}</p>

            <div className="flex items-center gap-4 mt-2 text-sm">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                {active ? "Active" : "Inactive"}
              </span>
              {task.isSubmissionRequired && (
                <span className="text-yellow-800 font-medium text-xs">
                  (Submission Required)
                </span>
              )}
            </div>

            {submission && (
              <div className="mt-4 space-y-3">
                {/* Status and Download Row */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Badge - Keeping your original color logic */}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      submission.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : submission.status === "resubmit"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                    Status: {submission.status}
                  </span>

                  {/* Download Button - Same href but better styling */}
                  <a
                    href={submission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                    <Download className="w-3 h-3 mr-1.5" />
                    View Submitted File
                  </a>
                </div>

                {/* Teacher Remark - Same data but better presentation */}
                {submission.teacherRemark && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-gray-600">
                      Teacher's Remark:
                    </p>
                    <p className="text-sm text-gray-800 mt-1 p-2 bg-gray-50 rounded">
                      {submission.teacherRemark}
                    </p>
                  </div>
                )}

                {/* Marks Display - Same logic but improved layout */}
                {submission.status === "approved" && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-gray-600">
                      Marks:
                    </p>
                    <p className="text-sm text-gray-800 mt-1">
                      {getStudentMarks(submission)} / {task.marks}
                    </p>
                  </div>
                )}
              </div>
            )}
            {canSubmit && (
              <div className="mt-4">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, task._id)}
                  className="block w-full border text-sm p-2 rounded mb-2"
                />
                <button
                  onClick={() => handleSubmit(task._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm"
                  disabled={uploadingTaskId === task._id}>
                  {uploadingTaskId === task._id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      Submit
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StudentTask;
