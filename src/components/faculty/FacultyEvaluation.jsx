import React, { useEffect, useState } from "react";
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
  ClipboardCheck,
  Users,
  Calendar,
  User,
  Star,
  MessageSquare,
  Award,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";

const FacultyEvaluation = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);
  const [taskDetails, setTaskDetails] = useState({});
  const [localSubmissions, setLocalSubmissions] = useState({});
  const [submittingTasks, setSubmittingTasks] = useState({});

  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${apiBaseUrl}/api/faculty/get-my-groups`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      const updatedGroups = data.data.map((group) => ({
        label: group.projectTitle,
        value: group,
      }));

      setGroups(updatedGroups);

      // Update selected group if it exists in the new data
      if (selectedGroup) {
        const updatedSelectedGroup = updatedGroups.find(
          (g) => g.value._id === selectedGroup.value._id
        );
        if (updatedSelectedGroup) {
          setSelectedGroup(updatedSelectedGroup);
        }
      }
    } catch (err) {
      toast.error("Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskDetails = async (taskId) => {
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/faculty/get-task-info/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setTaskDetails((prev) => ({ ...prev, [taskId]: data.task }));
    } catch (err) {
      console.error("Failed to fetch task details", err);
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

      // Fetch task details for any new submissions
      selectedGroup.value.submissions.forEach((sub) => {
        if (!taskDetails[sub.taskId]) {
          fetchTaskDetails(sub.taskId);
        }
      });
    } else {
      setLocalSubmissions({});
    }
  }, [selectedGroup]);

  const handleEvaluationSubmit = async (submission, groupId, taskId) => {
    // Validate status
    const validStatuses = ["approved", "resubmit"];
    const status = validStatuses.includes(submission.statusChoice)
      ? submission.statusChoice
      : "resubmit";

    const teacherRemark = submission.teacherRemark || "";

    // Prepare marks data
    let marksPerStudent = [];
    if (status === "approved") {
      marksPerStudent = submission.marksPerStudent || [];
      
      // Validate marks data
      const allFilled =
        marksPerStudent.length === selectedGroup.value.members.length &&
        marksPerStudent.every((m) => m.marks !== "" && !isNaN(m.marks));

      if (!allFilled) {
        toast.warning("Please enter valid marks for all students");
        return;
      }

      // Convert string marks to numbers
      marksPerStudent = marksPerStudent.map((m) => ({
        ...m,
        marks: Number(m.marks),
      }));
    }

    // Optimistic update
    const previousSubmission = localSubmissions[taskId];
    setLocalSubmissions((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        status,
        teacherRemark,
        marksPerStudent,
      },
    }));

    setSubmittingTasks((prev) => ({ ...prev, [taskId]: true }));

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/faculty/evaluate/project-groups/${groupId}/tasks/${taskId}`,
        {
          method: 'PUT',
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status,
            teacherRemark,
            marksPerStudent,
          })
        }
      );

      const data = await response.json();

      toast.success(data.message || "Evaluation submitted successfully");
      
      // Refresh data from server to ensure consistency
      await fetchGroups();
    } catch (err) {
      console.error("Evaluation error:", err);
      
      // Revert optimistic update on failure
      setLocalSubmissions((prev) => ({
        ...prev,
        [taskId]: previousSubmission,
      }));

      toast.error(
        err.message || 
        "Evaluation failed. Please try again."
      );
    } finally {
      setSubmittingTasks((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const statusStyles = {
    approved: "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200",
    resubmit: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200",
    submitted: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200",
  };

  const statusIcons = {
    approved: <CheckCircle2 size={18} className="mr-2 text-emerald-600" />,
    resubmit: <Clock size={18} className="mr-2 text-amber-600" />,
    submitted: <FileText size={18} className="mr-2 text-blue-600" />,
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

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: '12px',
      border: state.isFocused ? '2px solid #3b82f6' : '2px solid #e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
      padding: '8px 12px',
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
              <ClipboardCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Project Evaluation Center</h1>
              <p className="text-gray-600 mt-1">Review, assess, and provide feedback on student submissions</p>
            </div>
          </div>
        </div>

        {/* Group Selection Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Select Project Group</h2>
          </div>
          <Select
            options={groups}
            value={selectedGroup}
            onChange={setSelectedGroup}
            placeholder="Search and select a project group..."
            className="w-full"
            styles={customSelectStyles}
            isLoading={loading}
            isSearchable
          />
          {selectedGroup && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <p className="text-sm text-indigo-800">
                  <span className="font-medium">Selected Project:</span> {selectedGroup.label}
                </p>
              </div>
              <p className="text-xs text-indigo-600 mt-1">
                {selectedGroup.value.members?.length || 0} team members
              </p>
            </div>
          )}
        </div>

        {/* Content Area */}
        {!selectedGroup?.value ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Ready to Evaluate
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Select a project group above to begin reviewing and evaluating student submissions
            </p>
          </div>
        ) : selectedGroup?.value?.submissions?.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Submissions Yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              This project group hasn't submitted any work for evaluation yet. Check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {selectedGroup.value.submissions.map((submission, index) => {
              const taskId = submission.taskId;
              const taskTitle = taskDetails[taskId]?.title || `Task ${index + 1}`;
              const taskDescription = taskDetails[taskId]?.description || "";
              const members = selectedGroup.value.members;
              const status = localSubmissions[taskId]?.statusChoice || "submitted";
              const isExpanded = expandedTask === taskId;
              const localSubmission = localSubmissions[taskId] || {};
              const submitter = members.find((m) => m._id === submission.submittedBy);

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  {/* Submission Header */}
                  <div
                    className={`px-6 py-5 flex justify-between items-center cursor-pointer hover:opacity-90 transition-opacity ${statusStyles[status]} border-l-4 ${
                      status === 'approved' ? 'border-l-emerald-500' : 
                      status === 'resubmit' ? 'border-l-amber-500' : 'border-l-blue-500'
                    }`}
                    onClick={() => toggleTaskExpansion(taskId)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp size={20} className="text-gray-600" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {statusIcons[status]}
                          <h3 className="font-semibold text-lg">{taskTitle}</h3>
                        </div>
                        {taskDescription && (
                          <p className="text-sm opacity-80 mb-2 line-clamp-2">
                            {taskDescription}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs opacity-75">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>Submitted: {new Date(submission.updatedAt).toLocaleDateString()}</span>
                          </div>
                          {submitter && (
                            <div className="flex items-center gap-1">
                              <User size={12} />
                              <span>{submitter.name} ({submitter.rollNo})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                        status === 'approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        status === 'resubmit' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                        {status === 'approved' ? 'Approved' : status === 'resubmit' ? 'Needs Revision' : 'Under Review'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="p-6 space-y-6 bg-gray-50/50">
                      {/* Download Section */}
                      {submission.fileUrl && (
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            Submission Files
                          </h4>
                          <a
                            href={submission.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            <Download size={16} />
                            Download Submission
                          </a>
                        </div>
                      )}

                      {/* Feedback Section */}
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-purple-600" />
                          Your Feedback
                        </h4>
                        <textarea
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors resize-none"
                          rows={4}
                          placeholder="Provide detailed, constructive feedback to help students improve..."
                          value={localSubmission.teacherRemark || ""}
                          onChange={(e) => handleRemarkChange(e, taskId)}
                        />
                      </div>

                      {/* Evaluation Decision */}
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Evaluation Decision
                        </h4>
                        <select
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors"
                          value={localSubmission.statusChoice || "resubmit"}
                          onChange={(e) => handleStatusChange(e, taskId)}
                        >
                          <option value="resubmit">Request Resubmission</option>
                          <option value="approved">Approve Submission</option>
                        </select>
                      </div>

                      {/* Marks Assignment */}
                      {localSubmission.statusChoice === "approved" && (
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <Award className="w-4 h-4 text-yellow-600" />
                            Assign Individual Marks (0-10 scale)
                          </h4>
                          <div className="space-y-4">
                            {members.map((student, i) => (
                              <div
                                key={student._id}
                                className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{student.name}</p>
                                  <p className="text-sm text-gray-500">Roll No: {student.rollNo}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <input
                                    type="number"
                                    placeholder="0-10"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-20 text-center focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors"
                                    value={localSubmission.marksPerStudent?.[i]?.marks || ""}
                                    onChange={(e) => handleMarksChange(e, taskId, i, student._id)}
                                  />
                                  <span className="text-sm text-gray-500 font-medium">/ 10</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Submit Button */}
                      <div className="flex justify-end pt-4">
                        <button
                          onClick={() =>
                            handleEvaluationSubmit(
                              localSubmission,
                              selectedGroup.value._id,
                              taskId
                            )
                          }
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={submittingTasks[taskId] || loading}
                        >
                          {submittingTasks[taskId] ? (
                            <>
                              <Loader2 className="animate-spin w-4 h-4" />
                              Processing Evaluation...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Submit Evaluation
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyEvaluation;