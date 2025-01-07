import mongoose, { Document, Schema } from 'mongoose';

// Define the IPayment interface which extends mongoose's Document interface.
// This will be used to type the Payment documents.
export interface IPayment extends Document {
  appointmentId: mongoose.Types.ObjectId; // Reference to the associated appointment
  amount: number; // Amount of the payment
  status: 'pending' | 'completed' | 'failed'; // Status of the payment
  paymentMethod: string; // Method of the payment, e.g., credit card, PayPal, cash
  transactionId: string; // Transaction ID for the payment, if applicable
  paidAt: Date; // Date and time when the payment was made
  createdAt?: Date; // Timestamp for when the document was created
  updatedAt?: Date; // Timestamp for when the document was last updated
}

// Define the Payment schema.
const PaymentSchema: Schema = new Schema({
  appointmentId: { type: mongoose.Types.ObjectId, ref: 'Appointment', required: true }, // Reference to the associated appointment
  amount: { type: Number, required: true }, // Amount of the payment
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }, // Status of the payment
  paymentMethod: { type: String, required: true }, // Method of the payment, e.g., credit card, PayPal, cash
  transactionId: { type: String }, // Transaction ID for the payment, if applicable
  paidAt: { type: Date } // Date and time when the payment was made
}, {
  timestamps: true // Enable automatic creation of `createdAt` and `updatedAt` fields
});

// Create and export the Payment model.
const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;
