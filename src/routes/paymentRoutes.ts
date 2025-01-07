import express from 'express';
import { createPayment, getPayments, getPaymentById, updatePayment, deletePayment } from '../controllers/paymentController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, createPayment);
router.get('/', authMiddleware, getPayments);
router.get('/:id', authMiddleware, getPaymentById);
router.put('/:id', authMiddleware, updatePayment);
router.delete('/:id', authMiddleware, deletePayment);

export default router;
