"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
// Thêm Loader2 cho icon quay
import { PhoneCall, X, Send, Loader2 } from "lucide-react";
// Import thư viện thông báo
import toast, { Toaster } from "react-hot-toast";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  service: string;
  question: string;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  defaultService = "",
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    service: "",
    question: "",
  });

  // State quản lý trạng thái đang gửi (Loading)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form khi đóng/mở modal
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        name: "",
        phone: "",
        email: "",
        address: "",
        service: defaultService || "",
        question: "",
      }));
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, defaultService]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 1. Bắt đầu Loading
    setIsSubmitting(true);

    // URL Google Apps Script của bạn
    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbz1umIAe2lrBqBsSGrq40mtIDz_o5gvYKjy7PpVvIUc-ixwZhxDssAxzoS4b_1i7HyH/exec";

    try {
      // Giả lập độ trễ 1 chút để người dùng kịp nhìn thấy hiệu ứng loading (trông chuyên nghiệp hơn)
      // Bạn có thể bỏ dòng này nếu muốn nhanh nhất có thể
      await new Promise((resolve) => setTimeout(resolve, 800));

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // 2. Thông báo thành công (Đẹp hơn alert)
      toast.success("Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm.");

      // Đóng modal sau 1 khoảng ngắn để người dùng đọc thông báo
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Lỗi gửi form:", error);
      // Thông báo lỗi
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
    } finally {
      // 3. Tắt Loading dù thành công hay thất bại
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Component hiển thị thông báo (Đặt ở đây để nó hiện lên trên Modal) */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={isSubmitting ? undefined : onClose} // Không cho đóng khi đang gửi
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeInUp">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <PhoneCall className="w-6 h-6" /> Đăng ký tư vấn
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting} // Khóa nút đóng khi đang gửi
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Các input giữ nguyên logic cũ ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  disabled={isSubmitting} // Khóa input khi đang gửi
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-100"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  disabled={isSubmitting}
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-100"
                  placeholder="09xx xxx xxx"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                disabled={isSubmitting}
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-100"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                disabled={isSubmitting}
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-100"
                placeholder="Quận/Huyện, Tỉnh/Thành phố"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dịch vụ quan tâm <span className="text-red-500">*</span>
              </label>
              <select
                name="service"
                required
                disabled={isSubmitting}
                value={formData.service}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white disabled:bg-gray-100"
              >
                <option value="">-- Chọn dịch vụ --</option>
                <option value="NIPT">Xét nghiệm NIPT</option>
                <option value="ADN">Xét nghiệm ADN Huyết thống</option>
                <option value="GEN">Xét nghiệm HPV</option>
                <option value="OTHER">Xét nghiệm khác</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Câu hỏi cho bác sĩ
              </label>
              <textarea
                name="question"
                rows={3}
                disabled={isSubmitting}
                value={formData.question}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none disabled:bg-gray-100"
                placeholder="Mô tả sơ qua về nhu cầu của bạn..."
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting} // Disable nút khi đang loading
                className={`w-full py-3 px-4 rounded-lg text-white font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-2
                  ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed" // Style khi đang loading
                      : "bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 transform active:scale-[0.98]" // Style bình thường
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Đang gửi...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Gửi yêu cầu tư vấn
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;
