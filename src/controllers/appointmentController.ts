import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import Client from '../models/Client';
import Salon from '../models/Salon';
import { CustomRequest } from '../middlewares/authMiddleware';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Service from '../models/Service';
import Employee from '../models/Employee';
import mongoose from "mongoose";

// Function to generate a random password
const generateRandomPassword = () => {
  return crypto.randomBytes(8).toString('hex'); // Generates a random 16-character hex string
};

// Controller function to create a new appointment
export const createAppointment = async (req: CustomRequest, res: Response) => {
  //const { salonId, employeeId, serviceId, appointmentDate, status, paymentId, tempClient, note } = req.body;
  console.log(req.body);
  try {

    // Ensure service exists
    const { service } = req.body;
    const validService = await Service.findById(service.id);
    if (!validService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const appointment = new Appointment({ ...req.body });

    await appointment.save();

    res.status(201).json(appointment);

  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get all appointments
export const getAppointments = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  try {
    // Fetch all appointments and populate related fields
    const appointments = await Appointment.find().populate('salonId employeeId clientId serviceId paymentId');
    res.status(200).json(appointments);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get an appointment by ID
export const getAppointmentById = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  try {
    // Fetch an appointment by ID and populate related fields
    const appointment = await Appointment.findById(req.params.id).populate('employeeId clientId serviceId paymentId');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Only allow owners to get appointments of their own salons
    if (req.user.role === 'owner') {
      const salon = await Salon.findById(appointment.salonId);
      if (!salon || salon.ownerId.toString() !== req.user._id) {
        return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
      }
    }

    res.status(200).json(appointment);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to update an appointment by AppointmentID
export const updateAppointment = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Only allow owners to update appointments of their own salons
    if (req.user.role === 'owner') {
      const salon = await Salon.findById(appointment.salonId);
      if (!salon || salon.ownerId.toString() !== req.user._id) {
        return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedAppointment);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to delete an appointment by ID
export const deleteAppointment = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Only allow owners to delete appointments of their own salons
    if (req.user.role === 'owner') {
      const salon = await Salon.findById(appointment.salonId);
      if (!salon || salon.ownerId.toString() !== req.user._id) {
        return res.status(403).json({ message: 'Access denied. You do not own this salon. ' });
      }
    }

    await appointment.deleteOne();

    // Remove the appointment from the salon's appointments field
    await Salon.findByIdAndUpdate(appointment.salonId, { $pull: { appointments: appointment._id } });

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get all appointments for a specific salon
export const getAppointmentsBySalonId = async (req: CustomRequest, res: Response) => {
  const { salonId } = req.params;

  try {
    // Check if the user has permission to view this salon's appointments
    if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
    }

    if (req.user.role === 'owner') {
      const salon = await Salon.findById(salonId);
      if (!salon || salon.ownerId.toString() !== req.user._id) {
        return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
      }
    }

    // Extract the startDate and endDate from query parameters
    const { startDate, endDate } = req.query;

    // Convert the query string dates to JavaScript Date objects
    const start = startDate ? new Date(startDate as string) : null;
    const end = endDate ? new Date(endDate as string) : null;

    // Create a filter object to conditionally include the date range filter
    const filter: any = { salonId };

    if (start && end) {
      filter.appointmentDate = { $gte: start, $lte: end }; // Date range filter
    } else if (start) {
      filter.appointmentDate = { $gte: start }; // Filter by startDate only
    } else if (end) {
      filter.appointmentDate = { $lte: end }; // Filter by endDate only
    }

    const appointments = await Appointment.find(filter)
      //.populate('clientId serviceId paymentId') // Only populate other fields
      .lean(); // Convert the result to a plain JavaScript object for easier manipulation

    // // Manually fetch employee names for appointments where employeeId is present
    // for (let appointment of appointments) {
    //   if (appointment.employeeId) {
    //     const employee = await Employee.findById(appointment.employeeId, 'firstName lastName');
    //     if (employee) {
    //       appointment.employeeFullName = `${employee.firstName} ${employee.lastName}`;
    //     }
    //   }
    // }

    res.status(200).json(appointments);
  }
  catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};
