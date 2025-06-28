import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  FileText,
  BarChart2,
  LogIn,
  ClipboardList,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="w-full bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">Project Navigator</h1>
        <Link
          to="/login"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md transition"
        >
          <LogIn size={18} />
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8 px-6 py-10">
        {/* Text */}
        <div className="md:w-1/2">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Welcome to <span className="text-indigo-600">Project Navigator</span>
          </h2>
          <p className="text-gray-600 mt-3 text-base">
            A centralized system to manage final year projects of the{" "}
            <span className="font-medium">Electronics & Telecommunication Engineering</span> department.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Department of E&TC, PREC Loni
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-md transition"
          >
            <LogIn size={18} />
            Get Started
          </Link>
        </div>

        {/* Image (Dummy) */}
        <div className="md:w-1/2">
          <img
            src="/images/project-illustration.png" // Replace this path later
            alt="Project Department"
            className="w-full max-h-80 object-contain"
          />
        </div>
      </header>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Feature icon={<ClipboardList size={22} />} title="Task Management" desc="Activate & track tasks assigned to groups." />
        <Feature icon={<Users size={22} />} title="Team Collaboration" desc="View team members and assigned guides." />
        <Feature icon={<FileText size={22} />} title="Submissions" desc="Upload, approve, or request resubmissions." />
        <Feature icon={<BarChart2 size={22} />} title="Evaluation" desc="Evaluate student marks per task with remarks." />
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto py-6 px-6 text-sm text-gray-600">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-center sm:text-left">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">About</h4>
            <p>
              Project Navigator is built for managing final-year projects of
              PREC's E&TC department.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Contact</h4>
            <p>Pravara Rural Engineering College, Loni</p>
            <p>Email: hod.entc@pravara.in</p>
            <p>Phone: +91 9123456780</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><Link to="/login" className="hover:text-indigo-600">Login</Link></li>
              <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600">Terms of Use</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-6 text-xs text-gray-400">
          © 2025 Project Navigator • E&TC Dept. • PREC Loni
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="bg-white border rounded-md p-4 shadow hover:shadow-md transition">
      <div className="flex items-center gap-2 text-indigo-600 font-medium mb-2">
        {icon}
        {title}
      </div>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
