// src/components/LoadingOverlay.tsx
"use client";

import React from "react";

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
}

export default function LoadingOverlay({ isLoading, text = "Đang xử lý..." }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center  transition-all duration-300">
      <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
        {/* Vòng quay (Spinner) */}
        <div className="w-12 h-12 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin"></div>
        
        {/* Chữ hiển thị */}
        <p className="text-gray-700 font-medium animate-pulse">{text}</p>
      </div>
    </div>
  );
}