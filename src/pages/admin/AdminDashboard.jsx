import React, { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  FolderKanban,
  BookOpenCheck,
  TrendingUp,
  Award,
  Calendar,
  ChevronRight,
  Star,
  Target,
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
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchDashboardData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [studentRes, facultyRes, groupRes] = await Promise.all([
        fetch(`${apiBaseUrl}/api/admin/all-students`, {
          method: "GET",
          headers,
        }),
        fetch(`${apiBaseUrl}/api/admin/all-faculty`, {
          method: "GET",
          headers,
        }),
        fetch(`${apiBaseUrl}/api/admin/group`, {
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
    {
      label: "Manage Students",
      to: "/admin/student-list",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      description: "View & manage all students",
    },
    {
      label: "Manage Faculty",
      to: "/admin/faculty-list",
      icon: GraduationCap,
      color: "from-emerald-500 to-emerald-600",
      description: "Faculty administration",
    },
    {
      label: "Add Faculty",
      to: "/admin/add-faculty",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      description: "Register new faculty",
    },
    {
      label: "Add Student",
      to: "/admin/add-student",
      icon: GraduationCap,
      color: "from-orange-500 to-orange-600",
      description: "Enroll new students",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 top-0 z-10">
        <div className="p-4 sm:p-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Academic Dashboard
              </h1>
              <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
                Administrative Control Center
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg flex-shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {/* Card 1 */}
          <div className="group relative bg-white/70 backdrop-blur-sm hover:bg-white/90 shadow-lg hover:shadow-xl border border-slate-200/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="p-1.5 sm:p-2 lg:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
                  <Users className="text-white w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-slate-500 text-xs font-medium">
                    Total Students
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-800 leading-tight">
                    {totalStudents.toLocaleString()}
                  </p>
                </div>
              </div>
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-500 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
            <div className="mt-2 sm:mt-3 lg:mt-4 h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
          </div>

          {/* Card 2 */}
          <div className="group relative bg-white/70 backdrop-blur-sm hover:bg-white/90 shadow-lg hover:shadow-xl border border-slate-200/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="p-1.5 sm:p-2 lg:p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
                  <GraduationCap className="text-white w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-slate-500 text-xs font-medium">
                    Total Faculty
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-800 leading-tight">
                    {totalFaculty}
                  </p>
                </div>
              </div>
              <Award className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
            <div className="mt-2 sm:mt-3 lg:mt-4 h-0.5 sm:h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
          </div>

          {/* Card 3 */}
          <div className="group relative bg-white/70 backdrop-blur-sm hover:bg-white/90 shadow-lg hover:shadow-xl border border-slate-200/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="p-1.5 sm:p-2 lg:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
                  <FolderKanban className="text-white w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-slate-500 text-xs font-medium">
                    Project Groups
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-800 leading-tight">
                    {totalGroups}
                  </p>
                </div>
              </div>
              <Target className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-purple-500 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
            <div className="mt-2 sm:mt-3 lg:mt-4 h-0.5 sm:h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
          </div>

          {/* Card 4 */}
          <div className="group relative bg-white/70 backdrop-blur-sm hover:bg-white/90 shadow-lg hover:shadow-xl border border-slate-200/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="p-1.5 sm:p-2 lg:p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
                  <BookOpenCheck className="text-white w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-slate-500 text-xs font-medium">
                    Submissions
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-800 leading-tight">
                    {recentGroups.reduce(
                      (acc, group) => acc + (group.submissions?.length || 0),
                      0
                    )}
                  </p>
                </div>
              </div>
              <BookOpenCheck className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-orange-500 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
            <div className="mt-2 sm:mt-3 lg:mt-4 h-0.5 sm:h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
          </div>
        </div>

        {/* Enhanced Navigation Cards */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-slate-200/60 p-3 xs:p-4 sm:p-6">
          <h2 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 mb-3 xs:mb-4 sm:mb-6 flex items-center gap-2">
            <div className="p-1 xs:p-1.5 sm:p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md sm:rounded-lg flex-shrink-0">
              <Target className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="truncate">Quick Actions</span>
          </h2>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2.5 xs:gap-3 sm:gap-4">
            {navButtons.map((btn) => {
              const IconComponent = btn.icon;
              return (
                <Link
                  key={btn.label}
                  to={btn.to}
                  className="group relative bg-white/80 hover:bg-white border border-slate-200/60 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 sm:hover:-translate-y-1 min-h-[100px] xs:min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] flex flex-col active:scale-95 touch-manipulation">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${btn.color} opacity-0 group-hover:opacity-10 rounded-lg xs:rounded-xl transition-opacity duration-300`}></div>

                  <div className="relative flex-1 flex flex-col">
                    <div
                      className={`inline-flex p-1.5 xs:p-2 sm:p-2.5 lg:p-3 bg-gradient-to-r ${btn.color} rounded-md sm:rounded-lg shadow-lg mb-2 xs:mb-2 sm:mb-3 self-start`}>
                      <IconComponent className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                    </div>

                    <h3 className="font-semibold text-slate-800 mb-1 xs:mb-1 sm:mb-2 text-xs xs:text-sm sm:text-base leading-tight line-clamp-2">
                      {btn.label}
                    </h3>

                    <p className="text-[10px] xs:text-xs sm:text-sm text-slate-600 mb-2 xs:mb-2 sm:mb-3 flex-1 leading-relaxed line-clamp-2 xs:line-clamp-3">
                      {btn.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[9px] xs:text-xs text-slate-500 font-medium truncate">
                        Click to access
                      </span>
                      <ChevronRight className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 sm:group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Enhanced Top Performing Groups */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-slate-200/60 p-3 xs:p-4 sm:p-6">
          <div className="flex items-center gap-2 xs:gap-2 sm:gap-3 mb-3 xs:mb-4 sm:mb-6">
            <div className="p-1 xs:p-1.5 sm:p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-md sm:rounded-lg flex-shrink-0">
              <Award className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-sm xs:text-base sm:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent leading-tight">
              Top 3 Performing Groups
            </h2>
          </div>

          <div className="space-y-2.5 xs:space-y-3 sm:space-y-4">
            {topGroups.length === 0 && (
              <div className="text-center py-6 xs:py-8 sm:py-12">
                <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-2 xs:mb-3 sm:mb-4">
                  <Star className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-xs xs:text-sm sm:text-base lg:text-lg">
                  No top groups available yet.
                </p>
                <p className="text-slate-400 text-[10px] xs:text-xs sm:text-sm mt-1">
                  Performance data will appear here once submissions are
                  evaluated.
                </p>
              </div>
            )}

            {topGroups.map((group, index) => (
              <div
                key={group._id}
                className="group relative bg-gradient-to-r from-white/90 to-white/70 border border-slate-200/60 rounded-lg xs:rounded-xl shadow-md hover:shadow-lg p-3 xs:p-4 sm:p-6 transition-all duration-300 hover:-translate-y-0.5 sm:hover:-translate-y-1 active:scale-95 touch-manipulation">
                <div className="flex flex-col gap-3 xs:gap-4">
                  {/* Header Section */}
                  <div className="flex items-start justify-between gap-2 xs:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 xs:gap-2 sm:gap-3 mb-2 xs:mb-2 sm:mb-3">
                        <div
                          className={`
                    flex items-center justify-center w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 rounded-full text-white font-bold text-[10px] xs:text-xs sm:text-sm flex-shrink-0
                    ${
                      index === 0
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                        : index === 1
                        ? "bg-gradient-to-r from-gray-400 to-gray-500"
                        : "bg-gradient-to-r from-orange-400 to-orange-500"
                    }
                  `}>
                          {index + 1}
                        </div>
                        <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl font-bold text-slate-800 line-clamp-2 leading-tight">
                          {group.projectTitle}
                        </h3>
                      </div>

                      <p className="text-slate-600 mb-2 xs:mb-3 leading-relaxed text-xs xs:text-sm sm:text-base line-clamp-2 xs:line-clamp-3">
                        {group.description}
                      </p>
                    </div>

                    {/* Score Badge - Mobile: Top Right */}
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl shadow-lg text-center">
                        <div className="text-[9px] xs:text-xs sm:text-sm font-medium opacity-90 leading-none">
                          Avg Score
                        </div>
                        <div className="text-sm xs:text-base sm:text-lg lg:text-xl font-bold leading-tight mt-0.5">
                          {group.avgMarks}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-2 sm:gap-3">
                    <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 min-w-0">
                      <GraduationCap className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-[10px] xs:text-xs sm:text-sm text-slate-600 truncate">
                        <span className="font-medium">Faculty:</span>{" "}
                        {group?.guideId?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                      <Users className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-[10px] xs:text-xs sm:text-sm text-slate-600">
                        <span className="font-medium">Members:</span>{" "}
                        {group?.members?.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 xs:col-span-2 lg:col-span-1">
                      <BookOpenCheck className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-[10px] xs:text-xs sm:text-sm text-slate-600">
                        <span className="font-medium">Total:</span>{" "}
                        {group.totalMarks} pts
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Recent Groups */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
              <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">
              Recent Project Groups
            </h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {recentGroups.map((group) => (
              <div
                key={group._id}
                className="group bg-gradient-to-r from-white/90 to-white/70 border border-slate-200/60 rounded-xl shadow-md hover:shadow-lg p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-blue-700 mb-2">
                      {group.projectTitle}
                    </h3>
                    <p className="text-slate-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                      {group.description}
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg">
                        <GraduationCap className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">
                          <span className="font-medium">Faculty:</span>{" "}
                          {group?.guideId?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">
                          <span className="font-medium">Members:</span>{" "}
                          {group?.members?.length}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-200 mt-2 self-center sm:self-start flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
