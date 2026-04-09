const express = require('express');
const multer = require('multer');
const fs = require('fs');
const minioClient = require('../minio.js'); // Đường dẫn tới file cấu hình MinIO

const router = express.Router();
const upload = multer({ dest: 'temp/' }); // Lưu tạm trước khi đẩy lên MinIO

const BUCKET_NAME = 'gennovax';
const DOMAIN = process.env.URL_MINIO || 'https://file.gennovax.vn';

// API Upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { path, originalname, mimetype } = req.file;

    // Yêu cầu Frontend phải gửi kèm caseCode (Mã ca). Nếu chưa có thì vào thư mục 'drafts'
    const caseCode = req.body.caseCode || 'drafts';

    // Encode tên file để tránh lỗi tiếng Việt có dấu
    const safeFileName =
      Date.now() + '_' + originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');

    // Gắn caseCode làm thư mục: "CA001/167888_anh.jpg"
    const objectName = `${caseCode}/${safeFileName}`;

    // Upload lên MinIO
    await minioClient.fPutObject(BUCKET_NAME, objectName, path, {
      'Content-Type': mimetype,
    });

    // Xóa file tạm ở local server
    fs.unlinkSync(path);

    // Trả về URL chuẩn của Nginx
    const fileUrl = `${DOMAIN}/${BUCKET_NAME}/${objectName}`;
    res.json({ success: true, url: fileUrl, objectName });
  } catch (err) {
    console.error('MinIO Upload Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// API Xóa File (Khi user bấm Xóa trên giao diện)
router.post('/delete', async (req, res) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) return res.json({ success: true });

    // Cắt lấy objectName từ URL. Ví dụ: https://image.nsland.com.vn/gennovax/CA001/anh.jpg -> CA001/anh.jpg
    const prefixToRemove = `${DOMAIN}/${BUCKET_NAME}/`;
    if (fileUrl.startsWith(prefixToRemove)) {
      const objectName = fileUrl.replace(prefixToRemove, '');
      await minioClient.removeObject(BUCKET_NAME, objectName);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('MinIO Delete Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
