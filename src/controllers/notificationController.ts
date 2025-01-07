import { Request, Response } from 'express';
import Notification from '../models/Notification';
import Appointment from '../models/Appointment';
import Client from '../models/Client';
import Salon from '../models/Salon';
import { CustomRequest } from '../middlewares/authMiddleware';

// Create a new notification
export const createNotification = async (req: CustomRequest, res: Response) => {
  const { appointmentId, salonId, type, status, message, sender, appointmentDetails } = req.body;
  try {
    // Find the appointment associated with the notification
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Check if the user is authorized (admin or owner of the salon)
    if (req.user?.role === 'owner') {
      const salon = await Salon.findById(salonId);
      if (!salon || salon.ownerId.toString() !== req.user._id) {
        return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
      }
    }

    // Create a new notification instance
    const notification = new Notification({
      appointmentId,
      salonId,
      type,
      status,
      message,
      sender,
      appointmentDetails
    });

    // Save the notification to the database
    await notification.save();

    // Determine the contact information for the client associated with the appointment
    const clientContact = appointment.client.id ? await Client.findById(appointment.client.id) : appointment.client;

    if (!clientContact) return res.status(404).json({ message: 'Client not found' });

    // Sending logic here...
    // For example, sending SMS or email using clientContact.phone or clientContact.email

    // Return the created notification as a response
    res.status(201).json(notification);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get all notifications
export const getNotifications = async (req: CustomRequest, res: Response) => {
  try {
    // Fetch all notifications and populate the appointmentId and salonId fields
    const notifications = await Notification.find().populate('appointmentId salonId');
    // Return the fetched notifications as a response
    res.status(200).json(notifications);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get a notification by ID
export const getNotificationById = async (req: CustomRequest, res: Response) => {
  try {
    // Fetch a notification by ID and populate the appointmentId and salonId fields
    const notification = await Notification.findById(req.params.id).populate('appointmentId salonId');
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    // Return the fetched notification as a response
    res.status(200).json(notification);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to update a notification by ID
export const updateNotification = async (req: CustomRequest, res: Response) => {
  try {
    // Fetch the notification by ID
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    // Check if the user is authorized (admin or owner of the salon)
    if (req.user?.role === 'owner') {
      const salon = await Salon.findById(notification.salonId);
      if (!salon || salon.ownerId.toString() !== req.user._id) {
        return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
      }
    }

    // Update the notification
    const updatedNotification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedNotification);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to delete a notification by ID
export const deleteNotification = async (req: CustomRequest, res: Response) => {
  try {
    // Fetch the notification by ID
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    // Check if the user is authorized (admin or owner of the salon)
    if (req.user?.role === 'owner') {
      const salon = await Salon.findById(notification.salonId);
      if (!salon || salon.ownerId.toString() !== req.user._id) {
        return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
      }
    }

    // Delete the notification
    await notification.deleteOne();
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};
