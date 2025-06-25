import React from "react";
import { Trash2, LoaderCircle, X } from "lucide-react";

const DeleteFacultyModal = ({ onClose, onDelete, facultyName, loading }) => (
  <div
    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-6"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
        aria-label="Close modal"
      >
        <X size={24} />
      </button>

      <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">
        Confirm Deletion
      </h3>

      <div className="bg-red-50 border-l-4 border-red-400 p-4 text-sm text-red-700">
        <div className="flex gap-3 items-start">
          <Trash2 className="mt-1 text-red-400" />
          <p>
            You are about to permanently delete <strong>{facultyName}</strong>.
            This action cannot be undone.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <LoaderCircle className="animate-spin" size={18} />}
          Confirm Delete
        </button>
      </div>
    </div>
  </div>
);

export default DeleteFacultyModal;
