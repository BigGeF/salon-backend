import mongoose, { Document, Schema } from 'mongoose';

// Define the IService interface which extends mongoose's Document interface.
// This will be used to type the Service documents.
export interface IService extends Document {
  salonId: mongoose.Types.ObjectId; // Reference to the associated salon
  categoryId?: mongoose.Types.ObjectId; // Reference to the associated category
  name: string; // Name of the service
  description: string; // Description of the service
  price: number; // Price of the service
  duration: number; // Duration of the service in minutes
  createdAt?: Date; // Timestamp for when the document was created
  updatedAt?: Date; // Timestamp for when the document was last updated
}

// Define the Service schema.
const ServiceSchema: Schema = new Schema({
  salonId: { type: mongoose.Types.ObjectId, ref: 'Salon', required: true }, // Reference to the associated salon
  categoryId: { type: mongoose.Types.ObjectId, ref: 'Category', required: false }, // Reference to the associated category
  name: { type: String, required: true }, // Name of the service
  description: { type: String, required: true }, // Description of the service
  price: { type: Number, required: true }, // Price of the service
  duration: { type: Number, required: true }, // Duration of the service in minutes
}, {
  timestamps: true // Enable automatic creation of `createdAt` and `updatedAt` fields
});

// Create and export the Service model.
const Service = mongoose.model<IService>('Service', ServiceSchema);
export default Service;
