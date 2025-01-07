import mongoose, { Document, Schema } from 'mongoose';

// Define the IClient interface which extends mongoose's Document interface.
// This will be used to type the Client documents.
export interface IClient extends Document {
  firstName: string; // First name of the client
  lastName?: string; // Last name of the client (optional)
  email?: string; // Email of the client (optional)
  phone: string; // Phone number of the client
  salonId: mongoose.Types.ObjectId; // Reference to the associated salon
  role: string; // Role of the client, default is 'client'
  createdAt?: Date; // Timestamp for when the document was created
  updatedAt?: Date; // Timestamp for when the document was last updated
}

// Define the Client schema.
const ClientSchema: Schema = new Schema({
  firstName: { type: String, required: true }, // First name of the client
  lastName: { type: String, required: false }, // Last name of the client (optional)
  email: { type: String, required: false }, // Email of the client (optional)
  phone: { type: String, required: true }, // Phone number of the client
  salonId: { type: mongoose.Types.ObjectId, ref: 'Salon', required: true }, // Reference to the associated salon
  role: { type: String, required: true, default: 'client' } // Role of the client, default is 'client'
}, {
  timestamps: true // Enable automatic creation of `createdAt` and `updatedAt` fields
});

// Create and export the Client model.
const Client = mongoose.model<IClient>('Client', ClientSchema);
export default Client;
