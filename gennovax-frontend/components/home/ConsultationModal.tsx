"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
// Thêm CheckCircle cho icon thành công
import { PhoneCall, X, Send, Loader2, CheckCircle, User, MapPin, Mail, Phone, HelpCircle } from "lucide-react";
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  // State mới: Kiểm soát việc hiển thị màn hình thành công
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset form khi đóng/mở modal
  useEffect(() => {
    if (isOpen) {
      // Chỉ reset form nếu không phải đang ở trạng thái success
      if (!isSuccess) {
        setFormData((prev) => ({
          ...prev,
          name: "",
          phone: "",
          email: "",
          address: "",
          service: defaultService || "",
          question: "",
        }));
      }
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset trạng thái success khi đóng hẳn modal
      setTimeout(() => setIsSuccess(false), 300);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, defaultService]); // Bỏ isSuccess khỏi dependency để tránh reset sai lúc chuyển view

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    onClose();
    // Đợi animation đóng modal xong mới reset về form nhập liệu
    setTimeout(() => {
        setIsSuccess(false);
    }, 300);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbz1umIAe2lrBqBsSGrq40mtIDz_o5gvYKjy7PpVvIUc-ixwZhxDssAxzoS4b_1i7HyH/exec";

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // THAY ĐỔI: Không dùng toast nữa, chuyển sang màn hình Success
      setIsSuccess(true);
      
    } catch (error) {
      console.error("Lỗi gửi form:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={isSubmitting ? undefined : handleClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeInUp flex flex-col max-h-[90vh]">
        
        {/* === TRƯỜNG HỢP 1: HIỂN THỊ FORM ĐĂNG KÝ === */}
        {!isSuccess && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center text-white shrink-0">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <PhoneCall className="w-6 h-6" /> Đăng ký tư vấn
              </h3>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition disabled:opacity-50"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body Form */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      disabled={isSubmitting}
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
                    Câu hỏi cho người tư vấn
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
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg text-white font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-2
                      ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 transform active:scale-[0.98]"
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
          </>
        )}

        {/* === TRƯỜNG HỢP 2: HIỂN THỊ MÀN HÌNH THÀNH CÔNG === */}
        {isSuccess && (
          <div className="p-8 flex flex-col items-center justify-center text-center animate-fadeIn">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Đăng ký thành công!</h3>
            <p className="text-gray-500 mb-6">
              Cảm ơn bạn đã để lại thông tin. Chuyên viên của chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
            </p>

            {/* Box hiển thị thông tin tóm tắt */}
            <div className="w-full bg-gray-50 rounded-xl border border-gray-200 p-4 mb-6 text-left space-y-3">
               <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 border-b pb-2">Thông tin đã gửi</h4>
               
               <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-xs text-gray-400">Họ và tên</span>
                    <span className="font-medium text-gray-800">{formData.name}</span>
                  </div>
               </div>

               <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-xs text-gray-400">Số điện thoại</span>
                    <span className="font-medium text-gray-800">{formData.phone}</span>
                  </div>
               </div>

               <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-xs text-gray-400">Dịch vụ quan tâm</span>
                    <span className="font-medium text-gray-800">
                      {formData.service === 'NIPT' && 'Xét nghiệm NIPT'}
                      {formData.service === 'ADN' && 'Xét nghiệm ADN Huyết thống'}
                      {formData.service === 'GEN' && 'Xét nghiệm HPV'}
                      {formData.service === 'OTHER' && 'Xét nghiệm khác'}
                      {formData.service === '' && 'Chưa chọn'}
                    </span>
                  </div>
               </div>

               {formData.address && (
                 <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="block text-xs text-gray-400">Địa chỉ</span>
                      <span className="font-medium text-gray-800 text-sm">{formData.address}</span>
                    </div>
                 </div>
               )}
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 px-6 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-md transition-all transform active:scale-[0.98]"
            >
              Hoàn tất
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ConsultationModal;