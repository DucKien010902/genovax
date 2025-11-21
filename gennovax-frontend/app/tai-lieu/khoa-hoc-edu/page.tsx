"use client";
import React, { useState, useEffect } from "react";
import {
  Play,
  FileText,
  CheckCircle,
  Lock,
  ChevronRight,
  Search,
  Bell,
  User,
  Download,
  Clock,
  Star,
  Layout,
  BookOpen,
  Trophy,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

// --- Types & Interfaces ---
interface Lesson {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  videoId: string; // Youtube Video ID
  pdfUrl: string;
  description: string;
  isLocked: boolean;
  isCompleted: boolean;
}

interface Phase {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  lessons: Lesson[];
}

// --- Mock Data (Dữ liệu giả lập cho 4 giai đoạn) ---
const MOCK_DATA: Phase[] = [
  {
    id: 1,
    title: "Giai Đoạn 1",
    subtitle: "Nhập Môn & Văn Hóa",
    description:
      "Làm quen với môi trường, văn hóa doanh nghiệp và tư duy bán hàng cơ bản.",
    lessons: [
      {
        id: "p1-l1",
        title: "Văn hóa doanh nghiệp & Tầm nhìn",
        duration: "15:30",
        thumbnail:
          "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
        videoId: "ScMzIvxBSi4", // Dummy Youtube ID (React intro generally safe/educational)
        pdfUrl: "#",
        description:
          "Bài học đầu tiên giới thiệu về lịch sử hình thành, sứ mệnh và giá trị cốt lõi của công ty.",
        isLocked: false,
        isCompleted: true,
      },
      {
        id: "p1-l2",
        title: "Tư duy Sales 4.0",
        duration: "22:15",
        thumbnail:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        videoId: "W6NZfCO5SIk",
        pdfUrl: "#",
        description:
          "Thay đổi tư duy từ 'bán hàng' sang 'giúp đỡ khách hàng'. Các mô hình tư duy hiện đại.",
        isLocked: false,
        isCompleted: false,
      },
      {
        id: "p1-l3",
        title: "Quy trình làm việc nội bộ",
        duration: "18:00",
        thumbnail:
          "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80",
        videoId: "dQw4w9WgXcQ", // Easter egg :)
        pdfUrl: "#",
        description:
          "Hướng dẫn sử dụng CRM, quy định chấm công và báo cáo doanh số hàng ngày.",
        isLocked: false,
        isCompleted: false,
      },
    ],
  },
  {
    id: 2,
    title: "Giai Đoạn 2",
    subtitle: "Kỹ Năng Bán Hàng Thực Chiến",
    description:
      "Trang bị các kỹ năng tìm kiếm, tiếp cận và chốt đơn hàng chuyên nghiệp.",
    lessons: [
      {
        id: "p2-l1",
        title: "Kỹ năng Prospecting (Tìm khách)",
        duration: "25:00",
        thumbnail:
          "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
        videoId: "ScMzIvxBSi4",
        pdfUrl: "#",
        description:
          "Các phương pháp tìm kiếm khách hàng tiềm năng trên mạng xã hội và networking.",
        isLocked: true,
        isCompleted: false,
      },
      {
        id: "p2-l2",
        title: "Nghệ thuật xử lý từ chối",
        duration: "30:45",
        thumbnail:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
        videoId: "W6NZfCO5SIk",
        pdfUrl: "#",
        description:
          "Biến lời từ chối thành cơ hội. Các kịch bản xử lý từ chối phổ biến nhất.",
        isLocked: true,
        isCompleted: false,
      },
      {
        id: "p2-l3",
        title: "Kỹ năng Chốt sale (Closing)",
        duration: "28:10",
        thumbnail:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
        videoId: "ScMzIvxBSi4",
        pdfUrl: "#",
        description:
          "Các đòn tâm lý trong chốt sale. Nhận biết tín hiệu mua hàng từ khách.",
        isLocked: true,
        isCompleted: false,
      },
    ],
  },
  {
    id: 3,
    title: "Giai Đoạn 3",
    subtitle: "Chuyên Sâu Sản Phẩm",
    description:
      "Hiểu rõ từng chi tiết kỹ thuật và USP (Unique Selling Point) của sản phẩm.",
    lessons: [
      {
        id: "p3-l1",
        title: "Phân tích đối thủ cạnh tranh",
        duration: "40:00",
        thumbnail:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        videoId: "ScMzIvxBSi4",
        pdfUrl: "#",
        description:
          "So sánh chi tiết tính năng và giá bán với top 3 đối thủ trên thị trường.",
        isLocked: true,
        isCompleted: false,
      },
      {
        id: "p3-l2",
        title: "Demo sản phẩm đỉnh cao",
        duration: "35:20",
        thumbnail:
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
        videoId: "ScMzIvxBSi4",
        pdfUrl: "#",
        description:
          "Quy trình demo sản phẩm khiến khách hàng phải thốt lên 'Wow'.",
        isLocked: true,
        isCompleted: false,
      },
    ],
  },
  {
    id: 4,
    title: "Giai Đoạn 4",
    subtitle: "Lãnh Đạo & Chiến Lược",
    description: "Dành cho các bạn muốn thăng tiến lên vị trí Leader/Manager.",
    lessons: [
      {
        id: "p4-l1",
        title: "Quản lý đội nhóm hiệu suất cao",
        duration: "45:00",
        thumbnail:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
        videoId: "ScMzIvxBSi4",
        pdfUrl: "#",
        description:
          "Cách đặt KPI, motivate nhân viên và giải quyết xung đột nội bộ.",
        isLocked: true,
        isCompleted: false,
      },
      {
        id: "p4-l2",
        title: "Xây dựng chiến lược kinh doanh",
        duration: "50:00",
        thumbnail:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        videoId: "ScMzIvxBSi4",
        pdfUrl: "#",
        description:
          "Tư duy chiến lược dài hạn, phân tích SWOT và lập kế hoạch quý/năm.",
        isLocked: true,
        isCompleted: false,
      },
    ],
  },
];

// --- Components ---

const VideoModal = ({
  lesson,
  onClose,
}: {
  lesson: Lesson;
  onClose: () => void;
}) => {
  if (!lesson) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lesson.title}
            </h3>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <Clock className="w-3 h-3" /> {lesson.duration}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="relative w-full aspect-video bg-black group">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${lesson.videoId}?rel=0&modestbranding=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        {/* Lesson Content & Actions */}
        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h4 className="text-md font-semibold text-indigo-600 mb-2">
                Nội dung bài học
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                {lesson.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 min-w-[250px]">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                <h5 className="text-sm font-semibold mb-3 text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" /> Tài liệu học
                  tập
                </h5>
                <button
                  onClick={() => alert("Đang tải xuống tài liệu PDF...")}
                  className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-indigo-500 hover:text-indigo-600 text-slate-600 dark:text-slate-200 px-4 py-2.5 rounded-lg transition-all text-sm font-medium shadow-sm hover:shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Tải PDF bài giảng
                </button>
              </div>

              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Hoàn thành bài học
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseCard = ({
  lesson,
  onClick,
}: {
  lesson: Lesson;
  onClick: () => void;
}) => {
  return (
    <div
      className={`group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full ${lesson.isLocked ? "opacity-75 grayscale-[0.5]" : "cursor-pointer hover:-translate-y-1"}`}
      onClick={!lesson.isLocked ? onClick : undefined}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={lesson.thumbnail}
          alt={lesson.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {!lesson.isLocked && (
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
              <Play className="w-5 h-5 text-white ml-1" />
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-2 right-2">
          {lesson.isLocked ? (
            <span className="bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <Lock className="w-3 h-3" /> Locked
            </span>
          ) : lesson.isCompleted ? (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg">
              <CheckCircle className="w-3 h-3" /> Đã học
            </span>
          ) : (
            <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
              Mới
            </span>
          )}
        </div>

        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
          <Clock className="w-3 h-3" /> {lesson.duration}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {lesson.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
          {lesson.description}
        </p>

        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium uppercase tracking-wider">
            <FileText className="w-3 h-3" /> PDF Available
          </div>
          {!lesson.isLocked && (
            <span className="text-indigo-600 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Học ngay <ChevronRight className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>

      {/* Progress Line (Visual only for active) */}
      {!lesson.isLocked && !lesson.isCompleted && (
        <div className="h-1 w-full bg-slate-100">
          <div className="h-full bg-indigo-500 w-1/3"></div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [activePhaseId, setActivePhaseId] = useState<number>(1);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [auth, setAuth] = useState<boolean | null>(null);

  const router = useRouter();

  // Chỉ truy cập sessionStorage ở client
  useEffect(() => {
    setAuth(sessionStorage.getItem("auth") === "true");
  }, []);

  if (auth === null) {
    // Chờ lấy auth từ sessionStorage
    return null; // hoặc loader
  }

  if (!auth) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
          <h2 className="text-xl font-bold mb-4">Bạn cần đăng nhập</h2>
          <p className="mb-6">
            Vui lòng đăng nhập để tiếp tục truy cập trang này.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mr-5"
          >
            Quay lại
          </button>
          <button
            onClick={() => router.push("/dang-nhap")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  const activePhase =
    MOCK_DATA.find((p) => p.id === activePhaseId) || MOCK_DATA[0];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (

    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-white selection:bg-indigo-500 selection:text-white pb-20">
      {/* --- Navbar --- */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 px-8 transition-all duration-300 ${isScrolled ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"}`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-bold text-xl">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h1
                className={`font-bold text-xl leading-none ${isScrolled ? "text-slate-900 dark:text-white" : "text-slate-900 dark:text-white"}`}
              >
                Sales<span className="text-indigo-600">Mastery</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-wider">
                ACADEMY
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <nav className="flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
              <a href="/" className="hover:text-indigo-600 transition-colors">
                Trang chủ
              </a>
              <a href="#" className="text-indigo-600">
                Khóa học
              </a>
              <a href="#" className="hover:text-indigo-600 transition-colors">
                Thư viện
              </a>
              <a href="#" className="hover:text-indigo-600 transition-colors">
                Cộng đồng
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Nguyễn Văn A</p>
                <p className="text-xs text-slate-500">Senior Sale</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <section className="pt-32 pb-10 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>

        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                <Star className="w-3 h-3 fill-current" /> Lộ trình 2024
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Xin chào,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                  Nhà vô địch
                </span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Chào mừng bạn đến với hệ thống đào tạo nội bộ. Hoàn thành 4 giai
                đoạn để trở thành một chuyên gia bán hàng thực thụ và nhận chứng
                chỉ.
              </p>
            </div>

            {/* Progress Card */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 w-full md:w-80">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Tiến độ tổng thể
                </span>
                <span className="text-2xl font-bold text-indigo-600">25%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 mb-3">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full w-1/4 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full shadow"></div>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Bạn đã hoàn thành 1/10 bài học của lộ trình.
              </p>
            </div>
          </div>

          {/* --- Phase Tabs Navigation --- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {MOCK_DATA.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setActivePhaseId(phase.id)}
                className={`relative flex flex-col items-start p-4 rounded-xl border transition-all duration-300 text-left group
                  ${
                    activePhaseId === phase.id
                      ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-500/30"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800"
                  }
                `}
              >
                <span
                  className={`text-xs font-bold uppercase tracking-wider mb-1 ${activePhaseId === phase.id ? "text-indigo-200" : "text-slate-500"}`}
                >
                  Giai đoạn 0{phase.id}
                </span>
                <h3
                  className={`font-bold text-sm md:text-base leading-tight ${activePhaseId === phase.id ? "text-white" : "text-slate-900 dark:text-white"}`}
                >
                  {phase.title}
                </h3>

                {/* Active Indicator */}
                {activePhaseId === phase.id && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-600 rotate-45 hidden md:block"></div>
                )}
              </button>
            ))}
          </div>

          {/* --- Active Content Area --- */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-indigo-500" />
                  {activePhase.subtitle}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  {activePhase.description}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 flex">
                  <button className="p-2 rounded bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm">
                    <Layout className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activePhase.lessons.map((lesson) => (
                <CourseCard
                  key={lesson.id}
                  lesson={lesson}
                  onClick={() => setSelectedLesson(lesson)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-70">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              SM
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">
              SalesMastery Academy
            </span>
          </div>
          <p className="text-slate-500 text-sm mb-8">
            Nền tảng đào tạo nội bộ dành riêng cho đội ngũ kinh doanh xuất sắc.
            <br />© 2024 Company Name. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-indigo-500">
              Điều khoản sử dụng
            </a>
            <a href="#" className="hover:text-indigo-500">
              Chính sách bảo mật
            </a>
            <a href="#" className="hover:text-indigo-500">
              Hỗ trợ kỹ thuật
            </a>
          </div>
        </div>
      </footer>

      {/* --- Modals --- */}
      {selectedLesson && (
        <VideoModal
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
        />
      )}
    </div>
  );
}
