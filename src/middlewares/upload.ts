// src/middlewares/upload.ts
import multer from 'multer';
import path from 'path';

// 配置 Multer 存储
const storage = multer.diskStorage({
  // 指定上传文件的存储目录
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  // 定义上传文件的文件名格式
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// 创建 Multer 实例并配置存储选项
const upload = multer({ storage: storage });

// 导出 Multer 上传实例以在路由中使用
export default upload;
