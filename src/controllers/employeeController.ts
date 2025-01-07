import { Request, Response } from 'express';
import Employee from '../models/Employee';
import Salon from '../models/Salon';
import { CustomRequest } from '../middlewares/authMiddleware';

// Controller function to create a new employee
export const createEmployee = async (req: CustomRequest, res: Response) => {
  const { salonId, firstName, lastName, role } = req.body;
  try {
    // Check if the user is authorized (admin or owner of the salon)
    if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
    }

    // Check if the salon belongs to the owner (if the user is an owner)
    if (req.user.role === 'owner') {
      const salon = await Salon.findById(salonId);
      if (!salon || salon.ownerId.toString() !== req.user._id) {
        return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
      }
    }

    // Create a new employee instance
    const employee = new Employee({ salonId, firstName, lastName, role });
    await employee.save();

    // Add the employee to the salon's employees field
    await Salon.findByIdAndUpdate(salonId, { $push: { employees: employee._id } });

    // Return the newly created employee
    res.status(201).json(employee);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get all employees
export const getEmployees = async (req: CustomRequest, res: Response) => {
  try {
    // Fetch all employees and populate the salonId field
    const employees = await Employee.find().populate('salonId');
    res.status(200).json(employees);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get an employee by ID
export const getEmployeeById = async (req: CustomRequest, res: Response) => {
  try {
    // Fetch an employee by ID and populate the salonId field
    const employee = await Employee.findById(req.params.id).populate('salonId');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Check if the user is authorized (admin or owner of the salon)
    if (req.user?.role === 'owner') {
      const salon = await Salon.findById(employee.salonId);
      if (!salon || salon.ownerId.toString() !== req.user._id) {
        return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
      }
    }

    res.status(200).json(employee);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to update an employee by ID
export const updateEmployee = async (req: CustomRequest, res: Response) => {
  try {
    // Fetch the employee by ID
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Check if the user is authorized (admin or owner of the salon)
    if (req.user?.role === 'owner') {
      const salon = await Salon.findById(employee.salonId);
      if (!salon || salon.ownerId.toString() !== req.user._id) {
        return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
      }
    }

    // Update the employee
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedEmployee);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to delete an employee by ID
export const deleteEmployee = async (req: CustomRequest, res: Response) => {
  try {
    // Fetch the employee by ID
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Check if the user is authorized (admin or owner of the salon)
    if (req.user?.role === 'owner') {
      const salon = await Salon.findById(employee.salonId);
      if (!salon || salon.ownerId.toString() !== req.user._id) {
        return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
      }
    }

    // Delete the employee
    await employee.deleteOne();

    // Remove the employee from the salon's employees field
    await Salon.findByIdAndUpdate(employee.salonId, { $pull: { employees: employee._id } });

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};
export const getEmployeesBySalonId = async (req: CustomRequest, res: Response) => {
  try {
    const { salonId } = req.params;

    // Check if the salon exists
    const salon = await Salon.findById(salonId);
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    // Check if the user is authorized (admin or owner of the salon)
    if (req.user?.role === 'owner' && salon.ownerId.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
    }

    // Fetch all employees for the specified salon ID
    const employees = await Employee.find({ salonId }).populate('salonId');
    res.status(200).json(employees);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};