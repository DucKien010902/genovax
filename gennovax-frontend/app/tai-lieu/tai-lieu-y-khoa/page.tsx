"use client";
import { useState } from "react";
import Link from "next/link";
import { medicalDocs } from "@/data/medicalDocs"; // Import file data ở trên

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc tài liệu theo tên (Title)
  const filteredDocs = medicalDocs.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Medical Documentation Library
        </h1>

        {/* Ô Tìm kiếm */}
        <input
          type="text"
          placeholder="Tìm kiếm tài liệu..."
          className="w-full p-4 mb-8 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Danh sách bài viết */}
        <div className="space-y-4">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <Link
                key={doc.id}
                href={`/tai-lieu/tai-lieu-y-khoa/${doc.id}`}
                className="block"
              >
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border-l-4 border-blue-500">
                  <h2 className="text-xl font-semibold text-blue-700 mb-2">
                    {doc.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-2">{doc.summary}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-center">No documents found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
