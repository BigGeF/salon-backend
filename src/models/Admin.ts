import mongoose, { Document, Schema } from 'mongoose';

// Define the IAdmin interface which extends mongoose's Document interface.
// This will be used to type the Admin documents.
export interface IAdmin extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: string; // Role of the admin, default is 'admin'
  createdAt?: Date; // Timestamp for when the document was created
  updatedAt?: Date; // Timestamp for when the document was last updated
}

// Define the Admin schema.
const AdminSchema: Schema = new Schema({
  firstName: { type: String, required: true }, // First name of the admin
  lastName: { type: String, required: true },  // Last name of the admin
  email: { type: String, required: true, unique: true }, // Email of the admin, must be unique
  password: { type: String, required: true }, // Password of the admin
  phone: { type: String, required: true },    // Phone number of the admin
  role: { type: String, required: true, default: 'admin' } // Role of the admin, default is 'admin'
}, {
  timestamps: true // Enable automatic creation of `createdAt` and `updatedAt` fields
});

// Create and export the Admin model.
const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
export default Admin;
