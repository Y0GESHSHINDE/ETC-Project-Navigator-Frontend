import React from "react";
import { X } from "lucide-react";

const ViewGroupsModal = ({ onClose, facultyName, groups }) => (
  <div
    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-6"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 relative overflow-y-auto max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
        aria-label="Close modal"
      >
        <X size={24} />
      </button>
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Assigned Groups - {facultyName}
      </h3>

      {groups.length === 0 ? (
        <p className="text-gray-500 text-center">No groups assigned</p>
      ) : (
        <ul className="space-y-4">
          {groups.map((group) => (
            <li
              key={group._id}
              className="p-4 border rounded-md bg-gray-50 shadow-sm"
            >
              <p className="font-semibold text-gray-800">{group.name}</p>
              <p className="text-sm text-gray-600">{group.description || "No description"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

export default ViewGroupsModal;
