const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: 'minio-server',
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

const BUCKET_NAME = 'gennovax';

// Khai báo Policy mở Public Read (Chỉ cho phép đọc/tải ảnh, chặn thao tác xóa/sửa)
const publicReadPolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Principal: '*',
      Action: ['s3:GetObject'],
      Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
    },
  ],
};

// Hàm tự động check và set quyền Public khi khởi động Server
async function initMinioBucket() {
  try {
    // Kiểm tra xem bucket đã tồn tại chưa, chưa có thì tạo mới
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME);
      console.log(`✅ Đã tạo bucket mới: ${BUCKET_NAME}`);
    }

    // Set quyền Public Read cho bucket
    await minioClient.setBucketPolicy(
      BUCKET_NAME,
      JSON.stringify(publicReadPolicy)
    );
    console.log(
      `✅ Bucket '${BUCKET_NAME}' đã được mở quyền Public Read thành công!`
    );
  } catch (error) {
    console.error('❌ Lỗi khi setup quyền MinIO Bucket:', error);
  }
}

// Chạy hàm này ngay khi file được import
// initMinioBucket();

module.exports = minioClient;
