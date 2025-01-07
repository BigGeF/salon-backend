import express from 'express';
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesBySalonId
  //updateServiceCategory,
} from '../controllers/serviceController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, createService);
router.get('/', authMiddleware, getServices);
router.get('/:id', authMiddleware, getServiceById);
router.get('/salon/:id', authMiddleware, getServicesBySalonId);
router.put('/:id', authMiddleware, updateService);
router.delete('/:id', authMiddleware, deleteService);
//router.put('/update-category', authMiddleware, updateServiceCategory);

export default router;
