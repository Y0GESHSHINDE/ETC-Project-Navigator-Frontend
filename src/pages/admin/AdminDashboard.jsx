import React, { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  FolderKanban,
  BookOpenCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalFaculty, setTotalFaculty] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0);
  const [recentGroups, setRecentGroups] = useState([]);
  const [topGroups, setTopGroups] = useState([]);
  const token = localStorage.getItem("token");

  const fetchDashboardData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [studentRes, facultyRes, groupRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/all-students", {
          method: "GET",
          headers,
        }),
        fetch("http://localhost:5000/api/admin/all-faculty", {
          method: "GET",
          headers,
        }),
        fetch("http://localhost:5000/api/admin/group", {
          method: "GET",
          headers,
        }),
      ]);

      const [studentData, facultyData, groupData] = await Promise.all([
        studentRes.json(),
        facultyRes.json(),
        groupRes.json(),
      ]);

      setTotalStudents(
        Array.isArray(studentData.data) ? studentData.data.length : 0
      );
      setTotalFaculty(
        Array.isArray(facultyData.data) ? facultyData.data.length : 0
      );
      setTotalGroups(Array.isArray(groupData) ? groupData.length : 0);
      setRecentGroups(Array.isArray(groupData) ? groupData.slice(0, 3) : []);

      // Calculate top groups using average marks
      if (Array.isArray(groupData)) {
        const groupsWithAverageMarks = groupData.map((group) => {
          const studentIds =
            group?.members?.map((m) => m._id?.toString()) || [];

          const studentMarksMap = {};

          (group?.submissions || []).forEach((submission) => {
            (submission?.marksPerStudent || []).forEach((entry) => {
              const sid = entry.studentId?.toString();
              if (studentIds.includes(sid)) {
                if (!studentMarksMap[sid]) {
                  studentMarksMap[sid] = 0;
                }
                studentMarksMap[sid] += entry.marks || 0;
              }
            });
          });

          const allMarks = Object.values(studentMarksMap);
          const totalMarks = allMarks.reduce((sum, mark) => sum + mark, 0);
          const avgMarks =
            allMarks.length > 0 ? totalMarks / allMarks.length : 0;

          return {
            ...group,
            avgMarks: parseFloat(avgMarks.toFixed(2)),
            totalMarks,
          };
        });

        const sortedTopGroups = groupsWithAverageMarks
          .sort((a, b) => b.avgMarks - a.avgMarks)
          .slice(0, 3);

        setTopGroups(sortedTopGroups);
      }
    } catch (error) {
      toast.error("Error fetching admin dashboard data");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const navButtons = [
    { label: "Manage Students", to: "/faculty/student-list" },
    { label: "Manage Faculty", to: "/faculty/list" },
    { label: "Add Faculty", to: "/faculty/add-faculty" },
    { label: "Add Student", to: "/faculty/add-student" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
          <Users className="text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">Total Students</p>
            <p className="text-lg font-semibold">{totalStudents}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
          <GraduationCap className="text-green-600" />
          <div>
            <p className="text-gray-500 text-sm">Total Faculty</p>
            <p className="text-lg font-semibold">{totalFaculty}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
          <FolderKanban className="text-purple-600" />
          <div>
            <p className="text-gray-500 text-sm">Project Groups</p>
            <p className="text-lg font-semibold">{totalGroups}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
          <BookOpenCheck className="text-orange-600" />
          <div>
            <p className="text-gray-500 text-sm">Submissions</p>
            <p className="text-lg font-semibold">
              {recentGroups.reduce(
                (acc, group) => acc + (group.submissions?.length || 0),
                0
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {navButtons.map((btn) => (
          <Link
            key={btn.label}
            to={btn.to}
            className="bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded shadow transition">
            {btn.label}
          </Link>
        ))}
      </div>

      {/* Top Performing Groups */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          Top 3 Performing Groups
        </h2>
        <div className="space-y-4">
          {topGroups.length === 0 && (
            <p className="text-gray-500">No top groups available yet.</p>
          )}
          {topGroups.map((group) => (
            <div
              key={group._id}
              className="bg-white border rounded-md shadow-sm p-4">
              <h3 className="text-lg font-bold text-green-800">
                {group.projectTitle}
              </h3>
              <p className="text-gray-600 text-sm">{group.description}</p>
              <p className="text-gray-500 text-sm mt-1">
                Faculty: {group?.guideId?.name}
              </p>
              <p className="text-sm text-gray-400">
                Members: {group?.members?.length}
              </p>
              <p className="mt-2 font-semibold text-green-600">
                Avg Marks: {group.avgMarks}
              </p>
              <p className="text-sm text-gray-500">Total Marks: {group.totalMarks}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Groups */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Project Groups</h2>
        <div className="space-y-4">
          {recentGroups.map((group) => (
            <div
              key={group._id}
              className="bg-white border rounded-md shadow-sm p-4">
              <h3 className="text-lg font-bold text-blue-700">
                {group.projectTitle}
              </h3>
              <p className="text-gray-600 text-sm">{group.description}</p>
              <p className="text-gray-500 text-sm mt-1">
                Faculty: {group?.guideId?.name}
              </p>
              <p className="text-sm text-gray-400">
                Members: {group?.members?.length}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
