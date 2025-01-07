// routes/categoryRoutes.ts
import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoriesBySalonId
} from '../controllers/categoryController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Category routes
router.post('/', authMiddleware, createCategory);
router.get('/', authMiddleware, getCategories);//not sure if  this is useful
router.get('/:id', authMiddleware, getCategoryById);//categoryId
router.get('/salon/:id', authMiddleware, getCategoriesBySalonId);//salonId
router.put('/:id', authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

export default router;
