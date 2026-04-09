const express = require('express');
const multer = require('multer');
const fs = require('fs');
const minioClient = require('../minio.js');

const router = express.Router();
const upload = multer({ dest: 'temp/' });
const BUCKET_NAME = 'gennovax';
const DOMAIN = process.env.URL_MINIO || 'https://file.gennovax.vn';

// 1. LẤY DANH SÁCH FILE & THƯ MỤC
router.get('/list', async (req, res) => {
  try {
    const prefix = req.query.path || ''; // rỗng = thư mục gốc, "MACA01/" = trong thư mục MACA01
    const search = req.query.search?.toLowerCase() || '';

    const objects = [];
    // recursive = false để chỉ lấy ở cấp hiện tại, không moi sâu vào các thư mục con
    const stream = minioClient.listObjectsV2(BUCKET_NAME, prefix, false);

    stream.on('data', function (obj) {
      // Nếu là thư mục (có prefix)
      if (obj.prefix) {
        const folderName = obj.prefix.replace(prefix, '').replace('/', '');
        if (folderName && folderName.toLowerCase().includes(search)) {
          objects.push({ type: 'folder', name: folderName, path: obj.prefix });
        }
      }
      // Nếu là File
      else if (obj.name !== prefix) {
        // Bỏ qua file rỗng 0 byte dùng để tạo thư mục
        const fileName = obj.name.replace(prefix, '');
        if (fileName && fileName.toLowerCase().includes(search)) {
          objects.push({
            type: 'file',
            name: fileName,
            path: obj.name,
            size: obj.size,
            lastModified: obj.lastModified,
            url: `${DOMAIN}/${BUCKET_NAME}/${obj.name}`,
          });
        }
      }
    });

    stream.on('end', function () {
      res.json({ success: true, data: objects });
    });

    stream.on('error', function (err) {
      res.status(500).json({ success: false, message: err.message });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. TẠO THƯ MỤC MỚI (Bằng cách tạo 1 file rỗng có đuôi "/")
router.post('/create-folder', async (req, res) => {
  try {
    const { currentPath, folderName } = req.body;
    if (!folderName) throw new Error('Tên thư mục không được để trống');

    // Ví dụ: currentPath="" -> objectName="MACA01/"
    const objectName = `${currentPath}${folderName}/`;

    // Put file rỗng (Buffer rỗng) lên MinIO
    await minioClient.putObject(BUCKET_NAME, objectName, Buffer.from(''));
    res.json({ success: true, message: 'Tạo thư mục thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. UPLOAD FILE VÀO THƯ MỤC (CurrentPath)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { path: tempPath, originalname, mimetype } = req.file;
    const currentPath = req.body.currentPath || '';

    // Xóa dấu cách, ký tự lạ ở tên file cho an toàn
    const safeFileName =
      Date.now() + '_' + originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const objectName = `${currentPath}${safeFileName}`;

    await minioClient.fPutObject(BUCKET_NAME, objectName, tempPath, {
      'Content-Type': mimetype,
    });
    fs.unlinkSync(tempPath);

    res.json({ success: true, url: `${DOMAIN}/${BUCKET_NAME}/${objectName}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. XÓA FILE HOẶC THƯ MỤC
router.post('/delete', async (req, res) => {
  try {
    const { path, type } = req.body; // path ví dụ: "MACA01/anh.jpg" hoặc "MACA01/"

    if (type === 'file') {
      // Xóa 1 file
      await minioClient.removeObject(BUCKET_NAME, path);
    } else if (type === 'folder') {
      // Xóa thư mục -> Phải xóa TẤT CẢ object có chứa prefix là path đó
      const objectsList = [];
      const stream = minioClient.listObjectsV2(BUCKET_NAME, path, true); // recursive = true

      for await (const obj of stream) {
        objectsList.push(obj.name);
      }
      if (objectsList.length > 0) {
        await minioClient.removeObjects(BUCKET_NAME, objectsList);
      }
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
