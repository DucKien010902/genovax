"use client";

import React, { useState, useEffect } from "react";
import { driveApi } from "@/lib/api";
import { Folder, FileText, Image as ImageIcon, Trash2, Download, UploadCloud, FolderPlus, ChevronRight, X } from "lucide-react";
import LoadingOverlay from "@/components/LoadingOverlay"; // Component của bạn

export default function GennovaxDrivePage() {
  const [currentPath, setCurrentPath] = useState(""); // "" = thư mục gốc
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Trạng thái cho Preview Modal
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Load data
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

  // ✅ HÀM CHUYỂN THƯ MỤC: Vừa chuyển path, vừa tự động xóa thanh search
  const navigateTo = (newPath: string) => {
    setCurrentPath(newPath);
    setSearch(""); 
  };

  // Hành động
  const handleCreateFolder = async () => {
    const name = prompt("Nhập tên thư mục (Ví dụ: MACA123):");
    if (!name) return;
    setLoading(true);
    await driveApi.createFolder(currentPath, name);
    loadData();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    await driveApi.upload(file, currentPath);
    loadData();
  };

  const handleDelete = async (path: string, type: "file" | "folder") => {
    if (!confirm(`Bạn có chắc chắn muốn xóa ${type === "folder" ? "thư mục này và toàn bộ nội dung bên trong" : "tệp này"}?`)) return;
    setLoading(true);
    await driveApi.delete(path, type);
    loadData();
  };

  // Tính toán Breadcrumb (Đường dẫn)
  const pathParts = currentPath.split("/").filter(Boolean);

  return (
    <div className="min-h-screen bg-white p-6 relative">
      {loading && <LoadingOverlay isLoading={true} />}

      {/* --- BREADCRUMB & TOOLBAR --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Breadcrumb Navigation */}
        

        {/* Thanh công cụ */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Tìm trong thư mục hiện tại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-full bg-neutral-100 px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200 w-64"
          />
          <button onClick={handleCreateFolder} className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2.5 rounded-full text-sm font-bold transition-all">
            <FolderPlus className="w-4 h-4" /> Mới
          </button>
          <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-full text-sm font-bold cursor-pointer transition-all shadow-md shadow-blue-500/20">
            <UploadCloud className="w-4 h-4" /> Tải tệp lên
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
        </div>
        <div className="flex items-center text-lg font-semibold text-neutral-700 flex-wrap">
          <button 
            onClick={() => navigateTo("")} 
            className="hover:bg-neutral-100 text-xl p-2 rounded-xl text-blue-600 transition-colors"
          >
            Toàn bộ Thư mục và File
          </button>
          {pathParts.map((part, idx) => {
            // Tính lại đường dẫn khi click vào part ở giữa
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
      </div>

      {/* --- KHU VỰC HIỂN THỊ (GRID VIEW) --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {items.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center text-neutral-400 font-medium">
            Thư mục này trống
          </div>
        )}

        {items.map((item, idx) => (
          <div key={idx} className="group relative flex flex-col items-center justify-center p-4 rounded-2xl border border-transparent hover:border-black/10 hover:bg-neutral-50 transition-all cursor-pointer select-none">
            
            {/* Click Icon/Tên để mở Folder hoặc Xem File */}
            <div 
              className="flex flex-col items-center w-full"
              onDoubleClick={() => {
                // ✅ Gọi navigateTo thay vì setCurrentPath
                if (item.type === "folder") navigateTo(item.path);
                else setPreviewUrl(item.url);
              }}
            >
              {item.type === "folder" ? (
                <Folder className="w-16 h-16 text-amber-400 fill-amber-400/20 mb-2" strokeWidth={1.5} />
              ) : item.name.match(/\.(jpg|jpeg|png)$/i) ? (
                <ImageIcon className="w-16 h-16 text-blue-500 fill-blue-500/10 mb-2" strokeWidth={1.5} />
              ) : (
                <FileText className="w-16 h-16 text-rose-500 fill-rose-500/10 mb-2" strokeWidth={1.5} />
              )}
              
              <span className="text-sm font-semibold text-neutral-700 text-center truncate w-full px-2" title={item.name}>
                {item.name}
              </span>
            </div>

            {/* Menu 3 chấm (Dropdown giả lập nhanh) */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.path, item.type);
                }} 
                className="p-1.5 bg-white shadow-sm ring-1 ring-black/5 rounded-lg text-rose-600 hover:bg-rose-50"
                title="Xóa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            {/* Text nhỏ ở dưới báo nháy đúp */}
            <span className="text-[10px] text-neutral-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Nháy đúp để mở
            </span>
          </div>
        ))}
      </div>

      {/* --- PREVIEW MODAL (Dành cho ảnh và PDF) --- */}
      {previewUrl && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <button 
            onClick={() => setPreviewUrl(null)} 
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="w-full max-w-5xl h-[85vh] bg-neutral-900 rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl relative ring-1 ring-white/20">
            {/* Nếu là PDF */}
            {previewUrl.toLowerCase().includes('.pdf') ? (
              <iframe src={previewUrl} className="w-full h-full border-none" title="PDF Preview" />
            ) : (
              // Nếu là Ảnh
              <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
            )}
            
            {/* Nút tải xuống dưới góc */}
            <a 
              href={previewUrl} 
              download 
              target="_blank" 
              rel="noreferrer"
              className="absolute bottom-6 right-6 flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-full font-bold shadow-lg hover:bg-blue-500 transition-transform hover:scale-105"
            >
              <Download className="w-5 h-5" /> Tải xuống
            </a>
          </div>
        </div>
      )}
    </div>
  );
}