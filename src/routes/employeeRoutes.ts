import express from 'express';
import { createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee, getEmployeesBySalonId } from '../controllers/employeeController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, createEmployee);
router.get('/', authMiddleware, getEmployees);
router.get('/:id', authMiddleware, getEmployeeById);
router.put('/:id', authMiddleware, updateEmployee);
router.delete('/:id', authMiddleware, deleteEmployee);
router.get('/salons/:salonId', getEmployeesBySalonId);

export default router;
