import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import Case from '../models/Case.model.js';

const router = Router();

// Khởi tạo Gemini AI (Nên để API_KEY trong file .env để bảo mật hơn)
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY?.trim() ||
    'AIzaSyA4o8znX3UD3PpcSWVV1FNBH4mmqk03E6w'
);

// ==========================================
// 1. MODEL CHO CHỨC NĂNG PHÂN TÍCH SỐ LIỆU DB
// ==========================================
const analyticsModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash', // Dùng 1.5-flash chuẩn nhất hiện nay
  systemInstruction: `
    Bạn là trợ lý dữ liệu của phòng xét nghiệm y khoa.
    Tính cách: Chuyên nghiệp, ngắn gọn, đi thẳng vào số liệu.
    Người bạn đang nói chuyện cùng là Quản lý. Hãy gọi họ là "Quản lý" hoặc "Bạn", tuyệt đối không gọi là "Giám đốc".
    QUY TẮC ĐỊNH DẠNG:
    - Trả lời bằng văn bản thuần túy (plain text).
    - TUYỆT ĐỐI KHÔNG SỬ DỤNG Markdown (không dùng dấu sao *, không dùng dấu thăng #, không gạch đầu dòng bằng ký tự đặc biệt).
    - Dùng dấu gạch ngang (-) hoặc số thứ tự (1, 2) nếu cần liệt kê.
    - Không viết những câu mào đầu hoặc kết luận sáo rỗng. Chỉ trả lời thẳng vào số liệu.
  `,
});

// ==========================================
// 2. MODEL CHO CHỨC NĂNG ĐỌC FILE TĨNH (RAG SIÊU NHẸ)
// ==========================================
const docReaderModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash', // Model siêu nhẹ, phản hồi cực nhanh, tốn ít Token
  systemInstruction: `
    Bạn là nhân viên tư vấn khách hàng của Gennovax. 
    Nhiệm vụ: Chỉ trả lời câu hỏi dựa trên TÀI LIỆU được cung cấp.
    Quy tắc:
    - Nếu câu trả lời có trong tài liệu, hãy trả lời ngắn gọn, lịch sự, dễ hiểu.
    - Nếu câu hỏi nằm ngoài tài liệu hoặc không liên quan, tuyệt đối không tự bịa thông tin. Hãy đáp: "Xin lỗi, tôi chưa có thông tin về vấn đề này."
    - Trả lời bằng văn bản thuần túy, TUYỆT ĐỐI KHÔNG dùng định dạng Markdown (*, #).
  `,
});

// Tải file dữ liệu tĩnh vào RAM 1 lần khi khởi động Server để tối ưu tốc độ cho VPS
const knowledgePath = path.join(process.cwd(), 'thong_tin_gennovax.txt');
let knowledgeBase = '';
try {
  if (fs.existsSync(knowledgePath)) {
    knowledgeBase = fs.readFileSync(knowledgePath, 'utf8');
    console.log('✅ Đã nạp thành công dữ liệu từ thong_tin_gennovax.txt');
  } else {
    console.warn(
      `⚠️ Cảnh báo: Không tìm thấy file kiến thức tại ${knowledgePath}`
    );
  }
} catch (err) {
  console.error('❌ Lỗi đọc file kiến thức:', err);
}

// ==========================================
// ROUTE 1: HỎI ĐÁP PHÂN TÍCH DB (Dành cho Quản lý)
// Tương ứng với frontend gọi: fetch(".../ask")
// ==========================================
router.post('/ask', async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question)
      return res.status(400).json({ message: 'Vui lòng đặt câu hỏi' });

    const cases = await Case.find({})
      .select(
        'caseCode serviceType receivedAt collectedAmount costPrice paid -_id'
      )
      .lean();

    let summary = {
      tong_so_ca: cases.length,
      tong_doanh_thu: 0,
      tong_loi_nhuan: 0,
      theo_thang: {},
      theo_dich_vu: {},
    };

    cases.forEach((c) => {
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

      const service = c.serviceType || 'Khác';
      if (!summary.theo_dich_vu[service]) {
        summary.theo_dich_vu[service] = { so_ca: 0, doanh_thu: 0 };
      }
      summary.theo_dich_vu[service].so_ca += 1;
      summary.theo_dich_vu[service].doanh_thu += doanhThu;
    });

    const prompt = `
      DỮ LIỆU ĐÃ TÍNH TOÁN:
      ${JSON.stringify(summary, null, 2)}
      
      Yêu cầu:
      1. Đơn vị tiền tệ là VNĐ, có dấu phẩy ngăn cách (VD: 25,000,000 VNĐ).
      2. Nếu tính % chênh lệch, công thức: ((Sau - Trước) / Trước) * 100.
      
      CÂU HỎI CỦA QUẢN LÝ:
      "${question}"
    `;

    const result = await analyticsModel.generateContent(prompt);

    // Dọn sạch markdown
    let analysis = result.response.text().replace(/[*#_]/g, '');

    // Trả về format khớp với Frontend bạn đang dùng
    res.json({
      source: 'db', // Báo cho frontend biết đây là data từ DB
      answer: analysis,
    });
  } catch (error) {
    console.error('Lỗi AI Analytics:', error);
    res
      .status(500)
      .json({
        source: 'error',
        answer: 'Xin lỗi, hiện tại tôi đang không thể xử lý dữ liệu từ DB.',
      });
  }
});

// ==========================================
// ROUTE 2: HỎI ĐÁP TỪ FILE TĨNH (Dành cho web Gennovax)
// Frontend cần đổi URL thành: fetch(".../ask-info")
// ==========================================
router.post('/ask-info', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question)
      return res.status(400).json({ message: 'Vui lòng đặt câu hỏi' });

    // Tùy chọn: Mở comment dòng dưới nếu bạn muốn mỗi lần hỏi nó tự đọc lại file mới nhất
    // (nhưng sẽ tốn I/O ổ cứng hơn một chút xíu)
    // knowledgeBase = fs.readFileSync(knowledgePath, 'utf8');

    const prompt = `
      TÀI LIỆU THAM KHẢO VỀ DỊCH VỤ:
      ---
      ${knowledgeBase}
      ---
      
      CÂU HỎI CỦA KHÁCH HÀNG:
      "${question}"
    `;

    const result = await docReaderModel.generateContent(prompt);

    // Dọn dẹp markdown rác nếu AI lỡ tay
    let answerText = result.response.text().replace(/[*#_]/g, '');

    // Trả về format khớp với Frontend bạn đang dùng
    res.json({
      source: 'ai', // Báo cho frontend biết đây là kết quả RAG từ file
      answer: answerText,
    });
  } catch (error) {
    console.error('Lỗi AI đọc file tĩnh:', error);
    res
      .status(500)
      .json({
        source: 'error',
        answer: 'Hệ thống tư vấn đang bận, vui lòng thử lại sau',
      });
  }
});

export default router;
