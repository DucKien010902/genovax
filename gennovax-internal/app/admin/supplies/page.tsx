"use client";

import React, { useState } from "react";
import { 
  Search, Plus, Filter, AlertTriangle, 
  CheckCircle, FileText, Package, TestTube, 
  MoreVertical, Edit, Trash2
} from "lucide-react";

// 1. Định nghĩa TypeScript Interfaces
type TestCategory = "ALL" | "NIPT" | "ADN" | "HPV" | "CELL";
type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "EXPIRED";

interface InventoryItem {
  id: string;
  name: string;
  sku: string; // Mã vật tư
  category: TestCategory;
  quantity: number;
  unit: string;
  status: StockStatus;
  expirationDate: string;
  lotNumber: string;
}

// 2. Dữ liệu mẫu (Mock Data) sát với thực tế Lab
const mockData: InventoryItem[] = [
  { id: "1", name: "Ống lấy máu Streck Cell-Free DNA BCT", sku: "STK-001", category: "NIPT", quantity: 450, unit: "Ống", status: "IN_STOCK", expirationDate: "2026-12-01", lotNumber: "L2401A" },
  { id: "2", name: "Kit tách chiết DNA tự động (MagMAX)", sku: "KIT-ADN-02", category: "ADN", quantity: 12, unit: "Hộp", status: "LOW_STOCK", expirationDate: "2026-05-15", lotNumber: "M9921B" },
  { id: "3", name: "Chổi lấy mẫu tế bào cổ tử cung", sku: "BRS-HPV-01", category: "HPV", quantity: 1200, unit: "Cái", status: "IN_STOCK", expirationDate: "2027-01-10", lotNumber: "H1109C" },
  { id: "4", name: "Lam kính soi tế bào (Slide Glass)", sku: "SLD-CEL-05", category: "CELL", quantity: 0, unit: "Hộp", status: "OUT_OF_STOCK", expirationDate: "2028-10-20", lotNumber: "C8820D" },
  { id: "5", name: "Hóa chất giải trình tự Illumina NextSeq", sku: "ILL-NIPT-99", category: "NIPT", quantity: 3, unit: "Kit", status: "LOW_STOCK", expirationDate: "2026-04-01", lotNumber: "I0012X" },
];

export default function InventoryManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TestCategory>("ALL");

  // Logic Lọc dữ liệu
  const filteredData = mockData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Helper function render Badge trạng thái
  const renderStatusBadge = (status: StockStatus) => {
    switch (status) {
      case "IN_STOCK":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Sẵn sàng</span>;
      case "LOW_STOCK":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" /> Sắp hết</span>;
      case "OUT_OF_STOCK":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" /> Hết hàng</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Không rõ</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Kho Vật Tư Y Tế</h1>
          <p className="text-sm text-gray-500 mt-1">Hệ thống theo dõi và phân bổ vật tư xét nghiệm Genovax</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm">
          <Plus className="w-5 h-5 mr-2" />
          Nhập vật tư mới
        </button>
      </div>

      {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Tổng số vật tư", value: "1,245", icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
          { title: "Vật tư NIPT & ADN", value: "312", icon: TestTube, color: "text-purple-600", bg: "bg-purple-100" },
          { title: "Sắp hết hàng", value: "14", icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-100" },
          { title: "Cần duyệt xuất kho", value: "5", icon: FileText, color: "text-green-600", bg: "bg-green-100" },
        ].map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters & Search */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên vật tư, mã SKU..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as TestCategory)}
            >
              <option value="ALL">Tất cả danh mục</option>
              <option value="NIPT">Xét nghiệm NIPT</option>
              <option value="ADN">Huyết thống (ADN)</option>
              <option value="HPV">Tầm soát HPV</option>
              <option value="CELL">Tế bào học (CELL)</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã / Tên Vật Tư</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nhóm XN</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tồn Kho</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lot / Hạn Sử Dụng</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Hành động</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      <span className="text-sm text-gray-500">{item.sku}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{item.quantity} {item.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex flex-col">
                    <span className="text-sm text-gray-900">Lot: {item.lotNumber}</span>
                    <span className="text-xs text-gray-500">EXP: {item.expirationDate}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2 text-gray-400">
                      <button className="hover:text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button className="hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      <button className="hover:text-gray-900 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy vật tư nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Static UI for demo) */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 flex justify-between items-center">
          <p className="text-sm text-gray-700">Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredData.length}</span> trong <span className="font-medium">{mockData.length}</span> kết quả</p>
          <div className="flex gap-2">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Trước</button>
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}