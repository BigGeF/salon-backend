import express from 'express';
import { createNotification, getNotifications, getNotificationById, updateNotification, deleteNotification } from '../controllers/notificationController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, createNotification);
router.get('/', authMiddleware, getNotifications);
router.get('/:id', authMiddleware, getNotificationById);
router.put('/:id', authMiddleware, updateNotification);
router.delete('/:id', authMiddleware, deleteNotification);

export default router;
