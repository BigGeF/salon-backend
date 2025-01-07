// backend/src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase'; // Firebase Admin SDK
import Owner from '../models/Owner'; // MongoDB中的用户模型

// 定义扩展的 Request 接口以包含用户信息
// Define the extended Request interface to include user information
export interface CustomRequest extends Request {
  user?: {
    firebaseUser: admin.auth.DecodedIdToken;
    role?: string; // 数据库中的角色字段
    _id?: string; // MongoDB中的 ID 字段
  };
}

// 中间件函数，验证 Firebase ID 令牌并从数据库检索用户信息
// Middleware function to verify Firebase ID token and fetch user from MongoDB
const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const idToken = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split('Bearer ')[1]
    : null;

  if (!idToken) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    // 验证 Firebase ID 令牌
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    // 使用 Firebase UID 从 MongoDB 获取用户信息
    const owner = await Owner.findOne({ firebaseUid });

    if (!owner) {
      return res.status(404).json({ message: 'User not found in the database.' });
    }
    
    // 将 Firebase 用户信息和数据库中的角色一起添加到 req.user
    req.user = {
      firebaseUser: decodedToken,
      role: owner.role, // 从数据库中获取 role
      _id:owner.id,
    };

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    console.error('ID token verification failed or database query failed:', error);
    res.status(401).json({ message: 'Invalid or expired token or user not found.' });
  }
};

export default authMiddleware;
