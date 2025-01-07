import { Response } from 'express';
import Salon from '../models/Salon';
import { CustomRequest } from '../middlewares/authMiddleware';
import Owner from '../models/Owner';

// Create a new salon
export const createSalon = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  try {
    const salon = new Salon({ ownerId: req.user._id, ...req.body });
    await salon.save();
    res.status(201).json(salon);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Get all salons
export const getAllSalons = async (req: CustomRequest, res: Response) => {

  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  try {
    const salons = await Salon.find().populate('employees ownerId');
    res.status(200).json(salons);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Get all salons by owner ID
export const getSalonsByOwnerId = async (req: CustomRequest, res: Response) => {
  
  if (req.user?.role?.toLowerCase() !== 'admin' && req.user?.role?.toLowerCase() !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }
  
  const {ownerId} = req.params;
  
  if (!ownerId) {
    return res.status(405).json({ message: 'Owner ID does not exist.' });
  }

  try {
    const salons = await Salon.find({ ownerId }).populate('employees');
    res.status(200).json(salons);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Get salon by ID
export const getSalonById = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }
  try {
    const salon = await Salon.findById(req.params.id).populate('employees ownerId');
    if (!salon) return res.status(404).json({ message: 'Salon not found' });
    res.status(200).json(salon);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Update salon by ID
export const updateSalon = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ message: 'Salon not found' });

    if (req.user.role === 'owner' && !salon.ownerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied. Owners can only update their own salons.' });
    }

    const updatedSalon = await Salon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedSalon);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Delete salon by ID
export const deleteSalon = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) return res.status(404).json({ message: 'Salon not found' });

    if (req.user.role === 'owner' && !salon.ownerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied. Owners can only delete their own salons.' });
    }

    await Salon.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Salon deleted successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

