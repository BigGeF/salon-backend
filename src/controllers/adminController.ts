// import { Request, Response } from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import Admin from '../models/Admin';

// // Create a new admin
// export const createAdmin = async (req: Request, res: Response) => {
//   const { firstName, lastName, email, password, phone } = req.body;
//   try {
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) return res.status(400).json({ message: 'Admin already exists.' });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const admin = new Admin({ firstName, lastName, email, password: hashedPassword, phone });
//     await admin.save();

//     const token = jwt.sign({ _id: admin._id, role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '1h' });

//     res.status(201).json({ token, admin });
//   } catch (error) {
//     const err = error as Error;
//     res.status(500).json({ message: err.message });
//   }
// };

// // Admin login
// export const loginAdmin = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   try {
//     const admin = await Admin.findOne({ email });
//     if (!admin) return res.status(400).json({ message: 'Invalid email or password.' });

//     const validPassword = await bcrypt.compare(password, admin.password);
//     if (!validPassword) return res.status(400).json({ message: 'Invalid email or password.' });

//     const token = jwt.sign({ _id: admin._id, role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '1h' });

//     res.status(200).json({ token, admin });
//   } catch (error) {
//     const err = error as Error;
//     res.status(500).json({ message: err.message });
//   }
// };
