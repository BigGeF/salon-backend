import { Request, Response } from 'express';
import Category from '../models/Category';
import Service from '../models/Service';
import Salon from '../models/Salon';
import { CustomRequest } from '../middlewares/authMiddleware';
import category from "../models/Category";

// Default category ID
const DEFAULT_CATEGORY_ID = '64b1a9f0d8f34e3a2bc5d5a1';

// Controller function to create a new category
export const createCategory = async (req: CustomRequest, res: Response) => {
  const { categoryData, salonId } = req.body;
  try {
    if (!req.user) {
      return res.status(403).json({ message: 'Access denied. Authentication required.' });
    }

    // Verify the salon belongs to the owner
    const salon = await Salon.findById(salonId);
    if (!salon || !salon.ownerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
    }

    const category = new Category({ name: categoryData.name, salonId });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get all categories
export const getCategories = async (req: CustomRequest, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get a category by ID
export const getCategoryById = async (req: CustomRequest, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get categories by salon ID
export const getCategoriesBySalonId = async (req: CustomRequest, res: Response) => {
  try {
    console.log("getCategories salonId: ", req.params.id);
    const categories = await Category.find({ salonId: req.params.id });
    res.status(200).json(categories);
  } catch (error) {
    const err = error as Error;
    console.log("getCategories err: ", err);
    res.status(500).json({ message: err.message });
  }
};

// Controller function to update a category by ID
export const updateCategory = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  try {
    if (!req.user) {
      return res.status(403).json({ message: 'Access denied. Authentication required.' });
    }

    const categoryId = req.params.id;
    console.log("CatID: ", categoryId);
    const {categoryData, salonId} = req.body;
    console.log("Body: ", req.body);
    console.log("UpdatedData: ",categoryData);
    console.log("salonId: ",salonId);

    // Verify the category belongs to the salon
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    console.log("Category: ", category);

    const salon = await Salon.findById(salonId);
    if (!salon || !salon.ownerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
    }


    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, categoryData, { new: true });
    if (!updatedCategory) return res.status(404).json({ message: 'Updated category not found' });

    // Update the categoryId of all related services
    //await Service.updateMany({ categoryId, salonId: category.salonId }, { $set: { categoryId: updatedCategory._id } });

    res.status(200).json(updatedCategory);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to delete a category by ID
export const deleteCategory = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  try {
    if (!req.user) {
      return res.status(403).json({ message: 'Access denied. Authentication required.' });
    }

    const categoryId = req.params.id;

    // Verify the category belongs to the salon
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const salon = await Salon.findById(category.salonId);
    if (!salon || !salon.ownerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
    }

    // Ensure all services in this category get deleted
    await Service.deleteMany({ categoryId, salonId: category.salonId } );

    // Delete the category
    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({ message: 'Category and related services deleted' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};
