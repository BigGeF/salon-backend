import express from 'express';
import { createSalon, getAllSalons, getSalonById, updateSalon, deleteSalon, getSalonsByOwnerId } from '../controllers/salonController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, createSalon);
router.get('/', authMiddleware, getAllSalons);
router.get('/:id', authMiddleware, getSalonById);
router.put('/:id', authMiddleware, updateSalon);
router.delete('/:id', authMiddleware, deleteSalon);
router.get('/owner/:ownerId', authMiddleware, getSalonsByOwnerId); // New route for fetching salons by owner ID

export default router;
