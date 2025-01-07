// backend/src/routes/authRoutes.ts
import express from 'express';
import {
  socialLogin,
  checkEmailExists,
} from '../../controllers/Owner/ownerCreateAndLoginController';

const router = express.Router();
router.post('/social-login', socialLogin);
router.post('/email', checkEmailExists);

export default router;
