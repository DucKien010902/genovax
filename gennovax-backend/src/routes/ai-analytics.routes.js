import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Case from "../models/Case.model.js";

const router = Router();

// Khởi tạo Gemini AI và cài đặt System Instruction
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY?.trim() || "AIzaSyA4o8znX3UD3PpcSWVV1FNBH4mmqk03E6w");
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  systemInstruction: `
    Bạn là trợ lý dữ liệu của phòng xét nghiệm y khoa.
    Tính cách: Chuyên nghiệp, ngắn gọn, đi thẳng vào số liệu.
    Người bạn đang nói chuyện cùng là Quản lý. Hãy gọi họ là "Quản lý" hoặc "Bạn", tuyệt đối không gọi là "Giám đốc".
    QUY TẮC ĐỊNH DẠNG:
    - Trả lời bằng văn bản thuần túy (plain text).
    - TUYỆT ĐỐI KHÔNG SỬ DỤNG Markdown (không dùng dấu sao *, không dùng dấu thăng #, không gạch đầu dòng bằng ký tự đặc biệt).
    - Dùng dấu gạch ngang (-) hoặc số thứ tự (1, 2) nếu cần liệt kê.
    - Không viết những câu mào đầu hoặc kết luận sáo rỗng (như "Dưới đây là báo cáo...", "Hy vọng thông tin này hữu ích..."). Chỉ trả lời thẳng vào số liệu.
  `
});

router.post("/ask", async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: "Vui lòng đặt câu hỏi" });

    const cases = await Case.find({}).select("caseCode serviceType receivedAt collectedAmount costPrice paid -_id").lean();

    let summary = {
      tong_so_ca: cases.length,
      tong_doanh_thu: 0,
      tong_loi_nhuan: 0,
      theo_thang: {},
      theo_dich_vu: {}
    };

    cases.forEach(c => {
      const doanhThu = c.collectedAmount || 0;
      const chiPhi = c.costPrice || 0;
      const loiNhuan = doanhThu - chiPhi;

      summary.tong_doanh_thu += doanhThu;
      summary.tong_loi_nhuan += loiNhuan;

      if (c.receivedAt) {
        const date = new Date(c.receivedAt);
        const monthYear = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`; 
        
        if (!summary.theo_thang[monthYear]) {
          summary.theo_thang[monthYear] = { so_ca: 0, doanh_thu: 0 };
        }
        summary.theo_thang[monthYear].so_ca += 1;
        summary.theo_thang[monthYear].doanh_thu += doanhThu;
      }

      const service = c.serviceType || "Khác";
      if (!summary.theo_dich_vu[service]) {
        summary.theo_dich_vu[service] = { so_ca: 0, doanh_thu: 0 };
      }
      summary.theo_dich_vu[service].so_ca += 1;
      summary.theo_dich_vu[service].doanh_thu += doanhThu;
    });

    // Prompt siêu ngắn gọn vì quy tắc đã nạp vào System Instruction
    const prompt = `
      DỮ LIỆU ĐÃ TÍNH TOÁN:
      ${JSON.stringify(summary, null, 2)}
      
      Yêu cầu:
      1. Đơn vị tiền tệ là VNĐ, có dấu phẩy ngăn cách (VD: 25,000,000 VNĐ).
      2. Nếu tính % chênh lệch, công thức: ((Sau - Trước) / Trước) * 100.
      
      CÂU HỎI CỦA QUẢN LÝ:
      "${question}"
    `;

    const result = await model.generateContent(prompt);
    
    // Đề phòng AI lỡ tay thêm sao, ta dùng regex dọn sạch các dấu *, # đi trước khi trả về
    let analysis = result.response.text();
    analysis = analysis.replace(/[*#_]/g, ""); 

    res.json({
      success: true,
      question: question,
      answer: analysis
    });

  } catch (error) {
    console.error("Lỗi AI Analytics:", error);
    res.status(500).json({ success: false, error: "AI đang quá tải hoặc lỗi cấu hình" });
  }
});

export default router;