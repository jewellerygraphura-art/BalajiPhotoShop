import React from "react";
import { Edit3, Trash2 } from "lucide-react";

const WebCard = ({ banner, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3">
      <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
        {banner.image ? (
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <h2 className="text-lg font-bold">{banner.title}</h2>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onEdit(banner)}
          className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          <Edit3 size={16} /> Edit
        </button>
        <button
          onClick={() => onDelete(banner)}
          className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
};

export default WebCard;
