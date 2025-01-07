import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Client from '../models/Client';
import Salon from '../models/Salon';
import { CustomRequest } from '../middlewares/authMiddleware';

// Controller function to create a new client
export const createClient = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  const { firstName, lastName, email, phone, salonId } = req.body;
  try {
    const salon = await Salon.findById(salonId);
    if (!salon) return res.status(404).json({ message: 'Salon not found' });

    if (req.user.role === 'owner' && salon.ownerId.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
    }

    // Create a new client instance with the hashed password and role
    const client = new Client({ firstName, lastName, email, phone, salonId, role: 'client' });
    await client.save();

    // Return the newly created client
    res.status(201).json(client);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get all clients
export const getClients = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  try {
    // Fetch all clients from the database
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get a client by ID
export const getClientById = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  try {
    // Fetch a client by ID
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    if (req.user.role === 'owner') {
      const salon = await Salon.findById(client.salonId);
      if (!salon || salon.ownerId.toString() !== req.user._id) {
        return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
      }
    }

    res.status(200).json(client);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get a client by ID
export const getClientsBySalonId = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  try {
    console.log("Get Clients by Salon Id - SalonId: ", req.params.id);
    // Fetch a client by ID
    const clients = await Client.find({ salonId: req.params.id })
    //console.log("Client: ", clients);
    if (!clients) return res.status(405).json({ message: 'Clients not found' });

    res.status(200).json(clients);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to update a client by ID
export const updateClient = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  try {
    // Find the client by ID and update it
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    if (req.user.role === 'owner') {
      const salon = await Salon.findById(client.salonId);
      if (!salon || salon.ownerId.toString() !== req.user._id) {
        return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
      }
    }

    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedClient);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Controller function to delete a client by ID
export const deleteClient = async (req: CustomRequest, res: Response) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Admins and owners only.' });
  }

  try {
    // Find the client by ID
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    if (req.user.role === 'owner') {
      const salon = await Salon.findById(client.salonId);
      if (!salon || salon.ownerId.toString() !== req.user._id) {
        return res.status(403).json({ message: 'Access denied. You do not own this salon.' });
      }
    }

    await Client.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};
