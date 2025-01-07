import { Request, Response } from 'express';
import Service from '../models/Service';
import { CustomRequest } from '../middlewares/authMiddleware';
import Salon from '../models/Salon';
import Category from '../models/Category';
//             const formattedAppointmentDate = `${newAppointment.date.toISOString().split('T')[0]}T${newAppointment.time.toTimeString().split(' ')[0]}`;

// Controller function to create a new service
export const createService = async (req: CustomRequest, res: Response) => {
  const { salonId, categoryId, name, description, price, duration ,softDelete} = req.body;
  try {
    if (!req.user) {
      return res.status(403).json({ message: 'Access denied. Authentication required.' });
    }

    // Verify the salon belongs to the owner
    const salon = await Salon.findById(salonId);
    if (!salon || !salon.ownerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
    }

    // Verify the category belongs to the salon
    const category = await Category.findById(categoryId);
    if (!category || category.salonId.toString() !== salonId) {
      return res.status(404).json({ message: 'Category not found in this salon.' });
    }

    const service = new Service({ salonId, categoryId, name, description, price, duration,softDelete});
    await service.save();

    res.status(201).json(service);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get all services (admin only)
export const getServices = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  try {
    const services = await Service.find().populate('salonId categoryId');
    res.status(200).json(services);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get a service by ID
export const getServiceById = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  try {
    const service = await Service.findById(req.params.id).populate('salonId categoryId');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(service);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get a service by ID
export const getServicesBySalonId = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  try {
    const services = await Service.find({ salonId: req.params.id }).populate('categoryId');
    res.status(200).json(services);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};


// Controller function to update a service by ID
export const updateService = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  try {
    if (!req.user) {
      return res.status(403).json({ message: 'Access denied. Authentication required.' });
    }

    const { salonId } = req.body;

    // Verify the service belongs to the salon
    const service = await Service.findById(req.params.id);
    if (!service || service.salonId.toString() !== salonId) {
      return res.status(404).json({ message: 'UpdateService: Service not found in this salon.' });
    }

    // Verify the category belongs to the salon
    // const category = await Category.findById(serviceData.categoryId);
    // if (!category || category.salonId.toString() !== salonId) {
    //   return res.status(404).json({ message: 'Category not found in this salon.' });
    // }

    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedService) return res.status(404).json({ message: 'Service not found' });

    res.status(200).json(updatedService);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to delete a service by ID
export const deleteService = async (req: CustomRequest, res: Response) => {
  //console.log("Delete service. data: ", req.body);
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  try {
    if (!req.user) {
      return res.status(403).json({ message: 'Access denied. Authentication required.' });
    }

    const { salonId } = req.body;
    const serviceId = req.params.id;

    // Verify the service belongs to the salon
    const service = await Service.findById(serviceId);
    if (!service || service.salonId.toString() !== salonId) {
      return res.status(404).json({ message: `DeleteService: Service not found in this salon.` });
    }

    await Service.findByIdAndDelete(serviceId);

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};