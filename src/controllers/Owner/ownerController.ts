// backend/src/controllers/ownerController.ts
import { Request, Response } from 'express';
import Owner from '../../models/Owner';
import { CustomRequest } from '../../middlewares/authMiddleware';
import path from 'path';
import fs from 'fs';

// 获取业主信息
// Get owner information by ID
//
export const getOwnerById = async (req: CustomRequest, res: Response) => {
  const userRole = req.user?.role?.toLowerCase();
  const firebaseUid = req.user?.firebaseUser?.uid;
  console.log(firebaseUid);
  console.log(req.user?.role?.toLowerCase());
  console.log("--------------------------------");
  if (userRole !== 'owner' && userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin and Owners only. from ownerController' });
  }

  try {
    const ownerId = req.params.id;
    // 如果用户角色是业主，则只能获取自己的信息
    // If the role is owner, they can only access their own info
    if (userRole === 'owner' && ownerId !== firebaseUid) {
      return res.status(403).json({ message: 'Access denied. You can only access your own information.' });
    }

    const owner = await Owner.findOne({ firebaseUid: ownerId });
    if (!owner) return res.status(404).json({ message: 'Owner not found' });
    res.status(200).json(owner);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// 获取所有业主（仅限管理员）
// Get all owners (admin only)
export const getOwners = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  try {
    const owners = await Owner.find();
    res.status(200).json(owners);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// 更新业主信息
// Update owner information
export const updateOwner = async (req: CustomRequest, res: Response) => {
  const ownerData = req.body;
  const ownerId = req.params.id;
  const userRole = req.user?.role;
  const firebaseUid = req.user?.firebaseUser.uid;

  if (userRole !== 'admin' && userRole !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and Owners only.' });
  }

  try {
    // 确保业主只能更新自己的信息
    // Ensure the owner can only update their own info
    if (userRole === 'owner' && ownerId !== firebaseUid) {
      return res.status(403).json({ message: 'Access denied. You can only update your own information.' });
    }

    const owner = await Owner.findOneAndUpdate({ firebaseUid: ownerId }, ownerData, { new: true });
    if (!owner) return res.status(404).json({ message: 'Owner not found' });

    res.status(200).json(owner);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// 删除业主
// Delete owner
export const deleteOwner = async (req: CustomRequest, res: Response) => {
  const userRole = req.user?.role;
  const firebaseUid = req.user?.firebaseUser.uid;
  const ownerId = req.params.id;

  if (userRole !== 'admin' && userRole !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and Owners only.' });
  }

  try {
    // 确保业主只能删除自己的账户
    // Ensure the owner can only delete their own account
    if (userRole === 'owner' && ownerId !== firebaseUid) {
      return res.status(403).json({ message: 'Access denied. You can only delete your own account.' });
    }

    const owner = await Owner.findOneAndDelete({ firebaseUid: ownerId });
    if (!owner) return res.status(404).json({ message: 'Owner not found' });
    res.status(200).json({ message: 'Owner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// 更新业主照片
// Update owner photo
export const updateOwnerPhoto = async (req: CustomRequest, res: Response) => {
  const userRole = req.user?.role;
  const firebaseUid = req.user?.firebaseUser.uid;
  const ownerId = req.params.id;

  try {
    if (userRole !== 'admin' && userRole !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Admins and Owners only.' });
    }

    // 确保业主只能更新自己的照片
    // Ensure the owner can only update their own photo
    if (userRole === 'owner' && ownerId !== firebaseUid) {
      return res.status(403).json({ message: 'Access denied. You can only update your own photo.' });
    }

    const owner = await Owner.findOne({ firebaseUid: ownerId });
    if (!owner) return res.status(404).json({ message: 'Owner not found' });

    // 如果上传了新照片，删除旧照片
    // If a new photo is uploaded, delete the old one
    if (req.file && owner.photo) {
      const oldPhotoPath = path.join(__dirname, '..', '..', owner.photo as string);
      fs.unlink(oldPhotoPath, (err) => {
        if (err) {
          console.error(`Failed to delete old photo: ${err.message}`);
        }
      });
    }

    owner.photo = req.file ? req.file.path : owner.photo; // 如果上传了新照片，更新照片路径
    await owner.save();

    res.status(200).json(owner);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
