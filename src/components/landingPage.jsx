import {
  ClipboardList,
  FileText,
  Users,
  BarChart2,
  MessageSquare,
  CheckCircle,
  ChevronRight,
  LogIn,
  Star,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Globe,
  Clock,
  Award,
  Menu,
  X,
  BookOpen,
  Calendar,
  Target,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-900 to-blue-900/20"></div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.2) 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)`,
            transform: `translateY(${scrollY * 0.5}px)`,
          }}></div>
      </div>

      {/* Navbar */}
      <header className="relative z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 lg:p-6">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="relative">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-sm lg:text-base">
                PN
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Project Navigator
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Student-Faculty Portal
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={scrollToFeatures}
              className="text-slate-300 hover:text-white transition-colors">
              Features
            </button>
            <button
              onClick={() => scrollToSection("process")}
              className="text-slate-300 hover:text-white transition-colors">
              Process
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-slate-300 hover:text-white transition-colors">
              Reviews
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              to={"/login"}
              className="group hidden sm:inline-flex items-center bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 text-sm lg:text-base">
              <LogIn
                size={16}
                className="mr-2 group-hover:rotate-12 transition-transform"
              />
              Access Portal
              <ArrowRight
                size={14}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50">
            <nav className="flex flex-col space-y-4 p-6">
              <button
                onClick={scrollToFeatures}
                className="text-slate-300 hover:text-white transition-colors text-left">
                Features
              </button>
              <button
                onClick={() => scrollToSection("process")}
                className="text-slate-300 hover:text-white transition-colors text-left">
                Process
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-slate-300 hover:text-white transition-colors text-left">
                Reviews
              </button>
              <Link
                to={"/login"}
                className="group inline-flex items-center bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 w-full justify-center">
                <LogIn size={16} className="mr-2" />
                Access Portal
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 lg:pt-20 pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center space-y-6 lg:space-y-8">
            <div className="inline-flex items-center bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-full px-3 lg:px-4 py-2 text-xs lg:text-sm">
              <Sparkles size={14} className="mr-2 text-yellow-400" />
              <span className="text-slate-300">Daily visitors:</span>
              <span className="text-white font-semibold ml-1">
                500+ students & faculty
              </span>
              <div className="ml-3 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight px-4">
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                From Idea to
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Excellence
              </span>
            </h1>

            <p className="text-base lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
              Your one-stop digital platform connecting students and faculty for
              seamless
              <span className="text-purple-400 font-semibold">
                {" "}
                project management
              </span>
              ,
              <span className="text-blue-400 font-semibold">
                {" "}
                real-time updates
              </span>
              , and
              <span className="text-green-400 font-semibold">
                {" "}
                academic excellence
              </span>
              .
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12 px-4">
              <Link
                to={"/login"}
                className="group bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center w-full sm:w-auto justify-center">
                Join Department Portal
                <ChevronRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <button
                onClick={scrollToFeatures}
                className="group border-2 border-slate-600 text-slate-300 px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold hover:border-purple-500 hover:text-white transition-all duration-300 flex items-center w-full sm:w-auto justify-center">
                <Globe
                  size={18}
                  className="mr-2 group-hover:rotate-12 transition-transform"
                />
                Explore Features
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mt-12 lg:mt-16 text-slate-400">
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-white">
                  150+
                </div>
                <div className="text-xs lg:text-sm">Active Projects</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-slate-700"></div>
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-white">
                  95%
                </div>
                <div className="text-xs lg:text-sm">Success Rate</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-slate-700"></div>
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-white">
                  30+
                </div>
                <div className="text-xs lg:text-sm">Faculty Members</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Dashboard Preview */}
        <div className="mt-12 lg:mt-20 max-w-5xl mx-auto px-4 lg:px-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 blur-3xl"></div>
            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl lg:rounded-2xl p-1 lg:p-2 shadow-2xl">
              <div className="bg-slate-900 rounded-lg lg:rounded-xl p-4 lg:p-8 border border-slate-700/30">
                <div className="flex items-center space-x-2 mb-4 lg:mb-6">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-3 lg:h-4 bg-gradient-to-r from-violet-500 to-purple-500 rounded w-32 lg:w-48"></div>
                    <div className="h-3 lg:h-4 bg-slate-700 rounded w-16 lg:w-20"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 lg:gap-4">
                    <div className="h-16 lg:h-24 bg-slate-800 rounded-lg border border-slate-700/50"></div>
                    <div className="h-16 lg:h-24 bg-slate-800 rounded-lg border border-slate-700/50"></div>
                    <div className="h-16 lg:h-24 bg-slate-800 rounded-lg border border-slate-700/50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Everything Your Department
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Needs Daily
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto px-4">
              Streamlined tools for students, faculty, and department
              administration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              icon={<BookOpen size={28} />}
              title="Daily Project Updates"
              desc="Real-time project tracking, progress monitoring, and milestone management for all department projects."
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<Users size={28} />}
              title="Faculty-Student Hub"
              desc="Direct communication channel between faculty and students with appointment scheduling and query resolution."
              gradient="from-green-500 to-emerald-500"
            />
            <FeatureCard
              icon={<Calendar size={28} />}
              title="Department Calendar"
              desc="Unified calendar showing deadlines, meetings, seminars, and important department events."
              gradient="from-purple-500 to-violet-500"
            />
            <FeatureCard
              icon={<Target size={28} />}
              title="Goal Tracking"
              desc="Track individual student progress, department objectives, and academic milestones efficiently."
              gradient="from-pink-500 to-rose-500"
            />
            <FeatureCard
              icon={<TrendingUp size={28} />}
              title="Performance Analytics"
              desc="Comprehensive analytics dashboard showing department performance and student success metrics."
              gradient="from-orange-500 to-red-500"
            />
            <FeatureCard
              icon={<MessageSquare size={28} />}
              title="Quick Communication"
              desc="Instant messaging, announcements, and notification system for urgent department updates."
              gradient="from-yellow-500 to-amber-500"
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section
        id="process"
        className="relative z-10 py-20 lg:py-32 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                How It Works Daily
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto px-4">
              Simple workflow for everyday department operations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <ProcessStep
              number="01"
              icon={<LogIn />}
              title="Daily Check-in"
              desc="Students and faculty log in to access personalized dashboards with today's tasks and updates."
            />
            <ProcessStep
              number="02"
              icon={<ClipboardList />}
              title="Track & Collaborate"
              desc="Monitor project progress, communicate with team members, and submit daily work updates."
            />
            <ProcessStep
              number="03"
              icon={<Award />}
              title="Review & Improve"
              desc="Faculty provides feedback, students receive guidance, and continuous improvement is tracked."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                What Our Department Says
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <TestimonialCard
              quote="This portal has revolutionized how we manage daily department activities. Student engagement has increased significantly."
              author="Dr. Priya Sharma"
              role="Head of Department"
              avatar="P"
              rating={5}
            />
            <TestimonialCard
              quote="I can now easily track all my projects, communicate with faculty, and never miss important deadlines. It's a game-changer!"
              author="Amit Kumar"
              role="Final Year Student"
              avatar="A"
              rating={5}
            />
            <TestimonialCard
              quote="The daily progress tracking helps me provide timely guidance to students. The communication features are excellent."
              author="Prof. Rajesh Patel"
              role="Project Guide"
              avatar="R"
              rating={5}
            />
            <TestimonialCard
              quote="As a student, I love how organized everything is. From assignments to project updates, everything is in one place."
              author="Sneha Reddy"
              role="Third Year Student"
              avatar="S"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 blur-3xl"></div>
            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl lg:rounded-3xl p-8 lg:p-12">
              <h2 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6">
                <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Join Your Department's
                </span>
                <br />
                <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  Digital Transformation
                </span>
              </h2>
              <p className="text-lg lg:text-xl text-slate-300 mb-8 lg:mb-12 max-w-2xl mx-auto">
                Be part of the 500+ daily users who are already experiencing
                streamlined academic management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                  <Sparkles
                    size={18}
                    className="mr-2 group-hover:rotate-12 transition-transform"
                  />
                  Access Portal Now
                </button>
                <button className="group border-2 border-slate-600 text-slate-300 px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold hover:border-purple-500 hover:text-white transition-all duration-300 flex items-center justify-center">
                  <Clock
                    size={18}
                    className="mr-2 group-hover:rotate-12 transition-transform"
                  />
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                  DN
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Department Navigator
                  </h3>
                  <p className="text-sm text-slate-400">
                    Student-Faculty Portal
                  </p>
                </div>
              </div>
              <p className="text-slate-400 text-sm lg:text-base">
                Connecting students and faculty through digital innovation for
                academic excellence.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Access</h4>
              <ul className="space-y-2 text-slate-400 text-sm lg:text-base">
                <li>
                  <button
                    onClick={scrollToFeatures}
                    className="hover:text-white transition-colors">
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("process")}
                    className="hover:text-white transition-colors">
                    How It Works
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Student Portal
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Faculty Portal
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400 text-sm lg:text-base">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Department</h4>
              <ul className="space-y-2 text-slate-400 text-sm lg:text-base">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact HOD
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Faculty List
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Announcements
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Events
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 lg:mt-16 pt-6 lg:pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2025 Department Navigator. Built for academic excellence.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-slate-400 hover:text-white text-sm transition-colors">
                Privacy
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white text-sm transition-colors">
                Terms
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white text-sm transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Enhanced Feature Card Component
function FeatureCard({ icon, title, desc, gradient }) {
  return (
    <div className="group relative">
      <div
        className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"
        style={{
          backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
          "--tw-gradient-from": `rgb(139 92 246)`,
          "--tw-gradient-to": `rgb(168 85 247)`,
        }}></div>
      <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl lg:rounded-2xl p-6 lg:p-8 hover:border-slate-600/50 transition-all duration-300 group-hover:transform group-hover:scale-105 h-full">
        <div
          className={`inline-flex p-3 lg:p-4 rounded-xl bg-gradient-to-r ${gradient} mb-4 lg:mb-6`}>
          {icon}
        </div>
        <h3 className="text-lg lg:text-xl font-bold text-white mb-3 lg:mb-4">
          {title}
        </h3>
        <p className="text-slate-400 leading-relaxed text-sm lg:text-base">
          {desc}
        </p>
      </div>
    </div>
  );
}

// Enhanced Process Step Component
function ProcessStep({ number, icon, title, desc }) {
  return (
    <div className="text-center group">
      <div className="relative mb-6 lg:mb-8">
        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300">
          <span className="text-lg lg:text-2xl font-bold text-white">
            {number}
          </span>
        </div>
        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-slate-800 border-2 border-slate-700 rounded-full flex items-center justify-center mx-auto transform -mt-8 lg:-mt-12 group-hover:border-purple-500 transition-all duration-300">
          {icon}
        </div>
      </div>
      <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-4">
        {title}
      </h3>
      <p className="text-slate-400 leading-relaxed text-sm lg:text-base px-2">
        {desc}
      </p>
    </div>
  );
}

// Enhanced Testimonial Card Component
function TestimonialCard({ quote, author, role, avatar, rating }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl lg:rounded-2xl p-6 lg:p-8 hover:border-slate-600/50 transition-all duration-300 h-full">
      <div className="flex items-center mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={14} className="text-yellow-400 fill-current" />
        ))}
      </div>
      <blockquote className="text-slate-300 text-base lg:text-lg leading-relaxed mb-6">
        "{quote}"
      </blockquote>
      <div className="flex items-center">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3 lg:mr-4 text-sm lg:text-base">
          {avatar}
        </div>
        <div>
          <div className="text-white font-semibold text-sm lg:text-base">
            {author}
          </div>
          <div className="text-slate-400 text-xs lg:text-sm">{role}</div>
        </div>
      </div>
    </div>
  );
}
