// src/components/ChatWidget.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FaPaperPlane,
  FaXmark,
  FaRobot,
  FaRegCircleQuestion,
  FaUser,
} from "react-icons/fa6";

// ... (Giữ nguyên các interface Message, ChatWidgetProps, SESSION_KEY) ...
interface Message {
  id: number;
  fromUser: boolean;
  content: string;
  timestamp: string;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const SESSION_KEY = "chat_ai_messages_v2";

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose }) => {
  // ... (Giữ nguyên state và refs) ...
  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false); // State này giờ sẽ được auto control

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const suggestedQuestions = [
    "Gói xét nghiệm NIPT rẻ nhất bên mình là gói nào và giá bao nhiêu?",
    "Tôi có thể làm NIPT từ tuần thứ mấy của thai kì?",
    "Thời gian trả kết quả NIPT thường là bao lâu?",
    "Gói Geni 23 có phát hiện những gì và giá bao nhiêu?",
    "Xét nghiệm ADN cho thủ tục hành chính giá bao nhiêu?",
    "Cho tôi báo giá NIPT Geni Diamond?",
    "Xét nghiệm ADN mẫu khó có phụ thu không?",
  ];

  // ... (Giữ nguyên askQuestion1 và sendMessage) ...
  // const askQuestion1 = async (question: string) => {
  //   /* Logic API cũ */
  //   try {
  //     const response = await fetch(
  //       "https://uncasketed-karoline-resemblingly.ngrok-free.dev/webhook/ai-train-GPT",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ message: question, sessionId: "111" }),
  //       },
  //     );
  //     const data = await response.json();
  //     return data.output;
  //   } catch (error) {
  //     console.error("Lỗi:", error);
  //     return "Hệ thống đang bảo trì, vui lòng thử lại sau.";
  //   }
  // };

  const askQuestion1 = async (question: string): Promise<string> => {
    try {
      const response = await fetch("https://726e6fc74885.ngrok-free.app/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          question: question,
        }),
      });

      if (!response.ok) {
        throw new Error("Lỗi kết nối server");
      }

      const data = await response.json();

      // Backend trả về: { source: "db" | "ai", answer: "...", score: ... }

      // 🟢 SỬA Ở ĐÂY: Chỉ return đúng string "answer"
      // Nếu data.answer bị null/undefined thì trả về câu mặc định
      return data.answer || "Xin lỗi, tôi không tìm thấy câu trả lời phù hợp.";
    } catch (error) {
      console.error("Lỗi gọi AI:", error);

      // Khi lỗi, trả về string thông báo lỗi luôn
      return "Xin lỗi, hiện tại tôi đang không thể trả lời câu hỏi này.";
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      fromUser: true,
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setNewMsg("");
    setLoading(true);
    setShowSuggestions(false); // Ẩn gợi ý sau khi chọn
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updatedMsgs));

    const reply = await askQuestion1(userMsg.content);

    const aiMsg: Message = {
      id: Date.now() + 1,
      fromUser: false,
      content: reply,
      timestamp: new Date().toISOString(),
    };

    const finalMsgs = [...updatedMsgs, aiMsg];
    setMessages(finalMsgs);
    setLoading(false);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(finalMsgs));
  };

  // ... (Giữ nguyên Effects và Render Helpers) ...
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      const greeting = {
        id: Date.now(),
        fromUser: false,
        content:
          "👋 Xin chào! Tôi là trợ lý AI. Bạn cần hỗ trợ thông tin gì về xét nghiệm hôm nay?",
        timestamp: new Date().toISOString(),
      };
      setMessages([greeting]);
    }
  }, []);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const renderMessageContent = (content: string) => {
    /* Logic render content cũ */
    const IMAGE_LINK =
      "(https://res.cloudinary.com/dh3rdryux/image/upload/v1757389920/z6992270543389_473881ffd3549bf4a273390960f43bbc_k3hhf3.jpg)";
    let displayContent = content;
    let hasImage = false;

    if (content.includes(IMAGE_LINK)) {
      displayContent = content.replace(IMAGE_LINK, "");
      hasImage = true;
    }

    return (
      <div className="flex flex-col">
        {hasImage && (
          <img
            src={IMAGE_LINK.slice(1, -1)}
            alt="AI Suggestion"
            className="rounded-lg mb-2 max-w-full h-auto border border-gray-200"
          />
        )}
        {displayContent.split("\n").map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap">
            {line.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
              part.match(/https?:\/\/[^\s]+/) ? (
                <a
                  key={i}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 underline hover:text-white truncate"
                >
                  {part}
                </a>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </div>
        ))}
      </div>
    );
  };

  // --- MỚI: Xử lý sự kiện Focus/Blur ---
  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Trì hoãn việc ẩn đi 200ms để kịp bắt sự kiện click vào nút gợi ý
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 z-[70] h-full w-full sm:w-[45%] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header - Giữ nguyên */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center backdrop-blur-sm overflow-hidden">
              <img
                src="/images/genbio1-1.png"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">
                Tư vấn trực tiếp từ GennovaX
              </h2>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Sẵn sàng hỗ trợ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <FaXmark className="text-xl" />
          </button>
        </div>

        {/* Message List - Giữ nguyên */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 bg-gray-50 scroll-smooth space-y-4"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.fromUser ? "justify-end" : "justify-start"}`}
            >
              {!msg.fromUser && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 border border-indigo-200">
                  <FaRobot className="text-indigo-600 text-sm" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.fromUser
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                }`}
              >
                {renderMessageContent(msg.content)}
              </div>
              {msg.fromUser && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200">
                  <FaUser className="text-blue-600 text-sm" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <FaRobot className="text-indigo-600 text-sm" />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion & Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          {/* Toggle Button - Giữ lại như một option phụ hoặc để hiển thị trạng thái */}
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-xs font-medium text-blue-600 flex items-center gap-1 hover:underline px-2 py-1 rounded hover:bg-blue-50 transition-colors"
              // Thêm onMouseDown để ngăn việc click nút này làm mất focus input ngay lập tức nếu muốn
            >
              <FaRegCircleQuestion />
              Câu hỏi gợi ý
            </button>
          </div>

          {/* Suggestions Panel */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${showSuggestions ? "max-h-60 mb-3" : "max-h-0"}`}
          >
            <div className="flex flex-wrap gap-2 overflow-y-auto max-h-60 p-1">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-700 px-3 py-2 rounded-lg border border-gray-200 transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Field */}
          <div className="relative flex items-end gap-2 bg-gray-100 p-2 rounded-xl border border-transparent focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <textarea
              ref={inputRef}
              rows={1}
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-sm text-gray-800 placeholder-gray-400 resize-none max-h-24 py-2 pl-2"
              placeholder="Nhập câu hỏi của bạn..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              // --- THÊM SỰ KIỆN TẠI ĐÂY ---
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              // -----------------------------

              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(newMsg);
                }
              }}
            />
            <button
              onClick={() => sendMessage(newMsg)}
              disabled={loading || !newMsg.trim()}
              className={`p-2 rounded-lg mb-0.5 transition-all duration-200 ${
                newMsg.trim()
                  ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-gray-400">
              Develop by GennovaX AI
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
