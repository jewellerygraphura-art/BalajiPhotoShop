// src/components/admin/Toast.jsx
import React, { useEffect } from "react";

const Toast = ({ show, message, type, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div className={`fixed top-4 right-4 px-4 py-2 rounded text-white ${bgColor} shadow-lg`}>
      {message}
    </div>
  );
};

export default Toast;
