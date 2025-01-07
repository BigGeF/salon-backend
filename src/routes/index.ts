
//GreenCafeSalonApp/backend/src/routes/index.ts
import express from 'express';
// import adminRoutes from './adminRoutes';
import clientRoutes from './clientRoutes';
import ownerRoutes from './Owner/ownerRoutes';
import salonRoutes from './salonRoutes';
import appointmentRoutes from './appointmentRoutes';
import serviceRoutes from './serviceRoutes';
import employeeRoutes from './employeeRoutes';
import paymentRoutes from './paymentRoutes';
import notificationRoutes from './notificationRoutes';
import categoryRoutes from './categoryRoutes';
import authRoutes from './Owner/authRoutes';
const router = express.Router();

// router.use('/admin', adminRoutes);
router.use('/clients', clientRoutes);
router.use('/owners', ownerRoutes);
router.use('/salons', salonRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/services', serviceRoutes);
router.use('/employees', employeeRoutes);
router.use('/payments', paymentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/categories', categoryRoutes);
router.use('/auth', authRoutes);

export default router;
