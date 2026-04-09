"use client";

import React, { useState, useEffect } from "react";
import { driveApi } from "@/lib/api";
// Đã bỏ UploadCloud và FolderPlus
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Download,
  ChevronRight,
  X,
} from "lucide-react";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function GennovaxDrivePage() {
  const [currentPath, setCurrentPath] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Lưu trữ toàn bộ object item thay vì chỉ URL để lấy được tên file khi tải từ Modal
  const [previewItem, setPreviewItem] = useState<any | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await driveApi.list(currentPath, search);
      if (res.success) setItems(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath, search]);

  const navigateTo = (newPath: string) => {
    setCurrentPath(newPath);
    setSearch("");
  };

  // ✅ HÀM MỚI: ÉP tải tệp đơn lẻ (Không mở tab mới)
  const handleDownloadFile = async (file: any) => {
    try {
      setLoading(true);
      // Fetch data trực tiếp từ URL
      const response = await fetch(file.url);
      const blob = await response.blob();

      // Tạo URL ảo dạng blob và ép trình duyệt tải xuống
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.name; // Ép tên file khi tải về
      document.body.appendChild(link);
      link.click();

      // Dọn dẹp
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error(`Lỗi khi tải file ${file.name}:`, error);
      alert("Có lỗi xảy ra khi tải tệp này.");
    } finally {
      setLoading(false);
    }
  };

  // Tải toàn bộ thư mục về máy (Tạo thư mục thật + lưu file)
  const handleDownloadFolder = async (folderItem: any) => {
    if (!("showDirectoryPicker" in window)) {
      alert(
        "Trình duyệt của bạn không hỗ trợ tải nguyên thư mục. Vui lòng sử dụng Chrome, Edge, hoặc Cốc Cốc.",
      );
      return;
    }

    try {
      const localDirHandle = await (window as any).showDirectoryPicker({
        mode: "readwrite",
      });
      const newFolderHandle = await localDirHandle.getDirectoryHandle(
        folderItem.name,
        { create: true },
      );

      setLoading(true);
      const res = await driveApi.list(folderItem.path, "");
      if (!res.success) throw new Error("Không thể lấy danh sách file");

      const filesToDownload = res.data.filter(
        (item: any) => item.type === "file",
      );

      if (filesToDownload.length === 0) {
        alert("Thư mục này trống, không có tệp nào để tải.");
        setLoading(false);
        return;
      }

      for (const file of filesToDownload) {
        try {
          const fileResponse = await fetch(file.url);
          const blob = await fileResponse.blob();
          const fileHandle = await newFolderHandle.getFileHandle(file.name, {
            create: true,
          });
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
        } catch (err) {
          console.error(`Lỗi khi tải file ${file.name}:`, err);
        }
      }

      alert(`Đã tải thành công thư mục: ${folderItem.name}`);
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Lỗi khi tải thư mục:", error);
        alert("Có lỗi xảy ra trong quá trình tải thư mục.");
      }
    } finally {
      setLoading(false);
    }
  };

  const pathParts = currentPath.split("/").filter(Boolean);

  return (
    <div className="min-h-screen bg-white p-6 relative">
      {loading && <LoadingOverlay isLoading={true} />}

      {/* --- BREADCRUMB & TOOLBAR --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center text-lg font-semibold text-neutral-700 flex-wrap">
          <button
            onClick={() => navigateTo("")}
            className="hover:bg-neutral-100 text-xl p-2 rounded-xl text-blue-600 transition-colors"
          >
            Toàn bộ Thư mục và File
          </button>
          {pathParts.map((part, idx) => {
            const pathToHere = pathParts.slice(0, idx + 1).join("/") + "/";
            return (
              <React.Fragment key={pathToHere}>
                <ChevronRight className="w-5 h-5 text-neutral-400 mx-1" />
                <button
                  onClick={() => navigateTo(pathToHere)}
                  className="hover:bg-neutral-100 p-2 rounded-xl text-neutral-700 transition-colors"
                >
                  {part}
                </button>
              </React.Fragment>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Tìm trong thư mục hiện tại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-full bg-neutral-100 px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200 w-96"
          />
          {/* ĐÃ XÓA NÚT "MỚI" VÀ "TẢI LÊN" Ở ĐÂY */}
        </div>
      </div>

      {/* --- KHU VỰC HIỂN THỊ (GRID VIEW) --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {items.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center text-neutral-400 font-medium">
            Thư mục này trống
          </div>
        )}

        {items.map((item, idx) => (
          <div
            key={idx}
            className="group relative flex flex-col items-center justify-center p-4 rounded-2xl border border-transparent hover:border-black/10 hover:bg-neutral-50 transition-all cursor-pointer select-none"
          >
            <div
              className="flex flex-col items-center w-full"
              onDoubleClick={() => {
                if (item.type === "folder") navigateTo(item.path);
                else setPreviewItem(item); // Lưu cả object item thay vì url
              }}
            >
              {item.type === "folder" ? (
                <Folder
                  className="w-16 h-16 text-amber-400 fill-amber-400/20 mb-2"
                  strokeWidth={1.5}
                />
              ) : item.name.match(/\.(jpg|jpeg|png)$/i) ? (
                <ImageIcon
                  className="w-16 h-16 text-blue-500 fill-blue-500/10 mb-2"
                  strokeWidth={1.5}
                />
              ) : (
                <FileText
                  className="w-16 h-16 text-rose-500 fill-rose-500/10 mb-2"
                  strokeWidth={1.5}
                />
              )}

              <span
                className="text-sm font-semibold text-neutral-700 text-center truncate w-full px-2"
                title={item.name}
              >
                {item.name}
              </span>
            </div>

            {/* Nút Tải xuống: Dùng API tải ngầm thay vì href */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.type === "file" ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadFile(item); // Ép tải file đơn
                  }}
                  className="p-1.5 bg-white shadow-sm ring-1 ring-black/5 rounded-lg text-blue-600 hover:bg-blue-50 block"
                  title="Tải tệp xuống"
                >
                  <Download className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadFolder(item); // Tải thư mục
                  }}
                  className="p-1.5 bg-white shadow-sm ring-1 ring-black/5 rounded-lg text-blue-600 hover:bg-blue-50 block"
                  title="Tải thư mục xuống"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>

            <span className="text-[10px] text-neutral-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Nháy đúp để mở
            </span>
          </div>
        ))}
      </div>

      {/* --- PREVIEW MODAL (Dành cho ảnh và PDF) --- */}
      {previewItem && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <button
            onClick={() => setPreviewItem(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="w-full max-w-5xl h-[85vh] bg-neutral-900 rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl relative ring-1 ring-white/20">
            {previewItem.url.toLowerCase().includes(".pdf") ? (
              <iframe
                src={previewItem.url}
                className="w-full h-full border-none"
                title="PDF Preview"
              />
            ) : (
              <img
                src={previewItem.url}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            )}

            {/* Nút tải xuống dùng chung hàm ép tải */}
            <button
              onClick={() => handleDownloadFile(previewItem)}
              className="absolute bottom-6 right-6 flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-full font-bold shadow-lg hover:bg-blue-500 transition-transform hover:scale-105"
            >
              <Download className="w-5 h-5" /> Tải xuống
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
