import { Request, Response } from 'express';
import Payment from '../models/Payment';
import { CustomRequest } from '../middlewares/authMiddleware';
import Appointment from '../models/Appointment';
import Salon from '../models/Salon';

// Controller function to create a new payment
export const createPayment = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  const { appointmentId, amount, status, paymentMethod, transactionId, paidAt } = req.body;
  try {
    const payment = new Payment({ appointmentId, amount, status, paymentMethod, transactionId, paidAt });
    await payment.save();

    // Update the appointment's payment field
    await Appointment.findByIdAndUpdate(appointmentId, { paymentId: payment._id });

    res.status(201).json(payment);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get all payments
export const getPayments = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  try {
    const payments = await Payment.find().populate('appointmentId');
    res.status(200).json(payments);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get a payment by ID
export const getPaymentById = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  try {
    const payment = await Payment.findById(req.params.id).populate('appointmentId');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.status(200).json(payment);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to update a payment by ID
export const updatePayment = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  try {
    const payment = await Payment.findById(req.params.id).populate('appointmentId');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    const appointment = await Appointment.findById(payment.appointmentId).populate('salonId');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (req.user.role === 'owner') {
      const salon = await Salon.findById(appointment.salonId);
      if (!salon || salon.ownerId.toString() !== req.user._id) {
        return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
      }
    }

    const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedPayment);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to delete a payment by ID
export const deletePayment = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Remove the payment reference from the appointment
    await Appointment.findByIdAndUpdate(payment.appointmentId, { $unset: { paymentId: "" } });

    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};
