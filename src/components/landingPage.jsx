import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4">
      <h1 className="text-gray-800 text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-8 text-center max-w-3xl">
        Welcome to E&TC Project Navigator
      </h1>

      <Link
        to="/login"
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg sm:text-xl md:text-2xl font-semibold rounded-3xl px-8 sm:px-10 py-3 sm:py-4 shadow-lg transition duration-300 flex items-center justify-center mb-6"
      >
        Login
      </Link>

      <p className="text-gray-700 text-base sm:text-lg max-w-md text-center">
        Please login to continue
      </p>
    </div>
  );
}
