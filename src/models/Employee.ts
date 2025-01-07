import mongoose, { Document, Schema } from 'mongoose';

// Define the IEmployee interface which extends mongoose's Document interface.
// This will be used to type the Employee documents.
export interface IEmployee extends Document {
  salonId: mongoose.Types.ObjectId; // Reference to the associated salon
  firstName: string; // First name of the employee
  lastName: string; // Last name of the employee
  role: string; // Role of the employee, e.g., stylist, receptionist
  createdAt?: Date; // Timestamp for when the document was created
  updatedAt?: Date; // Timestamp for when the document was last updated
  availableAt?: boolean; 
}

// Define the Employee schema.
const EmployeeSchema: Schema = new Schema({
  salonId: { type: mongoose.Types.ObjectId, ref: 'Salon', required: true }, // Reference to the associated salon
  firstName: { type: String, required: true }, // First name of the employee
  lastName: { type: String, required: false },  // Last name of the employee
  role: { type: String, required: true, default: 'employee' }, // Role of the employee, default is 'employee'
}, {
  timestamps: true // Enable automatic creation of `createdAt` and `updatedAt` fields
});

// Create and export the Employee model.
const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);
export default Employee;
