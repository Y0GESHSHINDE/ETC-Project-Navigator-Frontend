import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  Loader2,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const FacultyEvaluation = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);
  const [taskDetails, setTaskDetails] = useState({});
  const [localSubmissions, setLocalSubmissions] = useState({});

  const token = localStorage.getItem("token");

  const fetchGroups = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/faculty/get-my-groups",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const groupOptions = res.data.data.map((group) => ({
        label: group.projectTitle,
        value: group,
      }));
      setGroups(groupOptions);
    } catch (err) {
      toast.error("Failed to fetch groups");
    }
  };

  const fetchTaskDetails = async (taskId) => {
    if (!taskDetails[taskId]) {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/faculty/get-task-info/${taskId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTaskDetails((prev) => ({ ...prev, [taskId]: res.data.task }));
      } catch (err) {
        console.error("Failed to fetch task details", err);
      }
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup?.value) {
      const subs = selectedGroup.value.submissions.reduce((acc, submission) => {
        acc[submission.taskId] = {
          ...submission,
          marksPerStudent: submission.marksPerStudent || [],
          statusChoice: submission.status || "resubmit",
          teacherRemark: submission.teacherRemark || "",
        };
        return acc;
      }, {});
      setLocalSubmissions(subs);

      const taskIds = selectedGroup.value.submissions.map((s) => s.taskId);
      taskIds.forEach((id) => {
        if (!taskDetails[id]) {
          fetchTaskDetails(id);
        }
      });
    } else {
      setLocalSubmissions({});
    }
  }, [selectedGroup]);

  const handleEvaluationSubmit = async (submission, groupId, taskId) => {
    const status = submission.statusChoice || "resubmit";
    const teacherRemark = submission.teacherRemark || "";

    let marksPerStudent = [];
    if (status === "approved") {
      marksPerStudent = submission.marksPerStudent || [];
      const allFilled =
        marksPerStudent.length === selectedGroup.value.members.length &&
        marksPerStudent.every((m) => m.marks !== "");
      if (!allFilled) {
        toast.warning("Enter marks for all students");
        return;
      }
    }

    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5000/api/faculty/evaluate/project-groups/${groupId}/tasks/${taskId}`,
        {
          status,
          teacherRemark,
          marksPerStudent,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Evaluation submitted successfully");
      fetchGroups();
    } catch (err) {
      toast.error("Evaluation failed");
    } finally {
      setLoading(false);
    }
  };

  const statusStyles = {
    approved: "bg-green-50 text-green-700 border-green-200",
    resubmit: "bg-yellow-50 text-yellow-700 border-yellow-200",
    submitted: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const statusIcons = {
    approved: <CheckCircle size={16} className="mr-1" />,
    resubmit: <AlertCircle size={16} className="mr-1" />,
    submitted: <FileText size={16} className="mr-1" />,
  };

  const toggleTaskExpansion = (taskId) => {
    if (expandedTask !== taskId) {
      fetchTaskDetails(taskId);
    }
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const handleStatusChange = (e, taskId) => {
    const newStatus = e.target.value;
    setLocalSubmissions((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        statusChoice: newStatus,
        marksPerStudent:
          newStatus === "approved" ? prev[taskId].marksPerStudent || [] : [],
      },
    }));
  };

  const handleRemarkChange = (e, taskId) => {
    const newRemark = e.target.value;
    setLocalSubmissions((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        teacherRemark: newRemark,
      },
    }));
  };

  const handleMarksChange = (e, taskId, studentIndex, studentId) => {
    const newMarks = e.target.value;
    setLocalSubmissions((prev) => {
      const submission = prev[taskId];
      const newMarksPerStudent = [...(submission.marksPerStudent || [])];
      newMarksPerStudent[studentIndex] = {
        studentId,
        marks: newMarks,
      };
      return {
        ...prev,
        [taskId]: {
          ...submission,
          marksPerStudent: newMarksPerStudent,
        },
      };
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Project Evaluation
        </h1>
        <p className="text-gray-600">Review and evaluate student submissions</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Project Group
        </label>
        <Select
          options={groups}
          value={selectedGroup}
          onChange={setSelectedGroup}
          placeholder="Search groups..."
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      {!selectedGroup?.value ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            No group selected
          </h3>
          <p className="text-gray-500">
            Please select a project group to view submissions
          </p>
        </div>
      ) : selectedGroup?.value?.submissions?.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-yellow-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            No submissions available
          </h3>
          <p className="text-gray-500">
            This group hasn't submitted any work yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {selectedGroup.value.submissions.map((submission, index) => {
            const taskId = submission.taskId;
            const taskTitle = taskDetails[taskId]?.title || `Task ${index + 1}`;
            const taskDescription = taskDetails[taskId]?.description || "";
            const members = selectedGroup.value.members;
            const status =
              localSubmissions[taskId]?.statusChoice || "submitted";
            const isExpanded = expandedTask === taskId;
            const localSubmission = localSubmissions[taskId] || {};
            const submitter = members.find((m) => m._id === submission.submittedBy);

            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border w-full overflow-hidden">
                <div
                  className={`px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 ${statusStyles[status]}`}
                  onClick={() => toggleTaskExpansion(taskId)}>
                  <div className="flex items-start gap-4 flex-1 flex-col sm:flex-row">
                    <div className="flex-shrink-0">{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
                    <div className="flex-1">
                      <h3 className="font-medium flex items-center">
                        {statusIcons[status]} {taskTitle}
                      </h3>
                      {taskDescription && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {taskDescription}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted on: {new Date(submission.updatedAt).toLocaleString()}
                      </p>
                      {submitter && (
                        <p className="text-xs text-gray-500">
                          Submitted by: {submitter.name} ({submitter.rollNo})
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-white">
                    {status}
                  </span>
                </div>

                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t space-y-6">
                    {submission.fileUrl && (
                      <div>
                        <a
                          href={submission.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                          <Download size={16} className="mr-2" />
                          Download Submission
                        </a>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Feedback
                      </label>
                      <textarea
                        className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        rows={3}
                        placeholder="Provide constructive feedback..."
                        value={localSubmission.teacherRemark || ""}
                        onChange={(e) => handleRemarkChange(e, taskId)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Evaluation Decision
                      </label>
                      <select
                        className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        value={localSubmission.statusChoice || "resubmit"}
                        onChange={(e) => handleStatusChange(e, taskId)}>
                        <option value="resubmit">Request Resubmission</option>
                        <option value="approved">Approve Submission</option>
                      </select>
                    </div>

                    {localSubmission.statusChoice === "approved" && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          Assign Marks (0-10)
                        </h4>
                        <div className="space-y-3">
                          {members.map((student, i) => (
                            <div
                              key={student._id}
                              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                              <div className="sm:w-48">
                                <p className="text-sm font-medium">
                                  {student.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                 <span> Roll No: </span>
                                  { student.rollNo}
                                </p>
                              </div>
                              <input
                                type="number"
                                placeholder="0-10"
                                min="0"
                                max="10"
                                className="border rounded-lg px-3 py-2 text-sm w-full sm:w-24 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                                value={
                                  localSubmission.marksPerStudent?.[i]?.marks || ""
                                }
                                onChange={(e) =>
                                  handleMarksChange(e, taskId, i, student._id)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() =>
                        handleEvaluationSubmit(
                          localSubmission,
                          selectedGroup.value._id,
                          taskId
                        )
                      }
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center"
                      disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-4 w-4" />
                          Processing...
                        </>
                      ) : (
                        "Submit Evaluation"
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FacultyEvaluation;
