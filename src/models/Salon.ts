import mongoose, { Document, Schema } from 'mongoose';

// Define the ISalon interface which extends mongoose's Document interface.
// This will be used to type the Salon documents.
export interface ISalon extends Document {
  ownerId: mongoose.Types.ObjectId; // Reference to the owner of the salon
  name: string; // Name of the salon
  address: { // Address of the salon
    street: string; // Street address
    city: string; // City
    state: string; // State
    zip: string; // ZIP code
  };
  contact: { // Contact information of the salon
    phone: string; // Phone number
    email: string; // Email address
  };
  employees: mongoose.Types.ObjectId[]; // List of employee IDs working in the salon
  createdAt?: Date; // Timestamp for when the document was created
  updatedAt?: Date; // Timestamp for when the document was last updated
}

// Define the Salon schema.
const SalonSchema: Schema = new Schema({
  ownerId: { type: mongoose.Types.ObjectId, ref: 'Owner', required: true }, // Reference to the owner of the salon
  name: { type: String, required: true }, // Name of the salon
  address: { // Address of the salon
    street: { type: String, required: true }, // Street address
    city: { type: String, required: true }, // City
    state: { type: String, required: true }, // State
    zip: { type: String, required: true } // ZIP code
  },
  contact: { // Contact information of the salon
    phone: { type: String, required: true }, // Phone number
    email: { type: String, required: true } // Email address
  },
  employees: [{ type: mongoose.Types.ObjectId, ref: 'Employee' }] // List of employee IDs working in the salon
}, {
  timestamps: true // Enable automatic creation of `createdAt` and `updatedAt` fields
});

// Create and export the Salon model.
const Salon = mongoose.model<ISalon>('Salon', SalonSchema);
export default Salon;
