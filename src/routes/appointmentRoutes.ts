import express from 'express';
import { createAppointment, getAppointments, getAppointmentById, updateAppointment, deleteAppointment, getAppointmentsBySalonId } from '../controllers/appointmentController';
import authMiddleware from '../middlewares/authMiddleware';
import bodyParser from 'body-parser';

const router = express.Router();
router.use(bodyParser.json());

router.post('/', authMiddleware, createAppointment); 
router.get('/', authMiddleware, getAppointments);
router.get('/:id', authMiddleware, getAppointmentById);
router.put('/:id', authMiddleware, updateAppointment);
router.delete('/:id', authMiddleware, deleteAppointment);
router.get('/salon/:salonId', authMiddleware, getAppointmentsBySalonId);

export default router;
