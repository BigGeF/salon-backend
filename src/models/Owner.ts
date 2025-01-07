//backend/src/models/Owner.ts
import mongoose, { Document, Schema } from 'mongoose';

// Define the IOwner interface
export interface IOwner extends Document {
  firebaseUid?: string; // Optional for social login
  firstName: string;
  lastName?: string;
  email: string;
  password?: string; // Optional for password login
  phone?: string;
  countryCode?: string;
  photo?: string; // Photo URL of the owner
  role: 'admin' | 'owner' | 'manager' ;
  defaultSalonId: mongoose.Types.ObjectId;
  createdAt?: Date; // Timestamp of when the document was created
  updatedAt?: Date; // Timestamp of when the document was last updated
}

// Define the Owner schema
const OwnerSchema: Schema = new Schema({
  firebaseUid: { type: String, required: false }, // Firebase UID, optional for social login
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional for password login users
  phone: { type: String, required: false },
  countryCode: { type: String },
  photo: { type: String },
  role: { type: String, required: true, default: 'owner' },
  defaultSalonId: { type: mongoose.Types.ObjectId, ref: 'Salon' }
}, { timestamps: true });

export default mongoose.model<IOwner>('Owner', OwnerSchema);
