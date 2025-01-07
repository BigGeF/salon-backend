//GreenCafeSalonApp/backend/src/routes/Owner/ownerRoutes.ts
import express from 'express';
import {
    getOwners,
    getOwnerById,
    updateOwner,
    deleteOwner,
    updateOwnerPhoto,
    
} from '../../controllers/Owner/ownerController';
import authMiddleware from '../../middlewares/authMiddleware';
import upload from '../../middlewares/upload';
const router = express.Router();

router.get('/getAllOwners', authMiddleware, getOwners);
router.get('/:id', authMiddleware, getOwnerById);
router.put('/:id', authMiddleware, updateOwner);
router.delete('/:id', authMiddleware, deleteOwner);

// New route for uploading photos
router.put('/photo/:id', authMiddleware, upload.single('photo'), updateOwnerPhoto); 

export default router;