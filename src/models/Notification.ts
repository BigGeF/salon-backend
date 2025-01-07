import mongoose, { Document, Schema } from 'mongoose';

// Define the INotification interface which extends mongoose's Document interface.
// This will be used to type the Notification documents.
export interface INotification extends Document {
  appointmentId: mongoose.Types.ObjectId; // Reference to the associated appointment
  salonId: mongoose.Types.ObjectId; // Reference to the associated salon
  type: 'email' | 'sms'; // Type of the notification
  status: 'sent' | 'failed'; // Status of the notification
  message: string; // Message content of the notification
  sentAt: Date; // Date and time when the notification was sent
  sender: { // Sender details
    name: string; // Name of the sender
    contact: { // Contact details of the sender
      phone: string; // Phone number of the sender
      email: string; // Email of the sender
    };
  };
  appointmentDetails: { // Details of the appointment
    clientFirstName: string; // First name of the client
    clientLastName: string; // Last name of the client
    serviceName: string; // Name of the service
    appointmentDate: Date; // Date and time of the appointment
    serviceDescription: string; // Description of the service
    servicePrice: number; // Price of the service
  };
  createdAt?: Date; // Timestamp for when the document was created
  updatedAt?: Date; // Timestamp for when the document was last updated
}

// Define the Notification schema.
const NotificationSchema: Schema = new Schema({
  appointmentId: { type: mongoose.Types.ObjectId, ref: 'Appointment', required: true }, // Reference to the associated appointment
  salonId: { type: mongoose.Types.ObjectId, ref: 'Salon', required: true }, // Reference to the associated salon
  type: { type: String, enum: ['email', 'sms'], required: true }, // Type of the notification
  status: { type: String, enum: ['sent', 'failed'], default: 'sent' }, // Status of the notification
  message: { type: String, required: true }, // Message content of the notification
  sentAt: { type: Date, default: Date.now }, // Date and time when the notification was sent
  sender: { // Sender details
    name: { type: String, required: true }, // Name of the sender
    contact: { // Contact details of the sender
      phone: { type: String, required: true }, // Phone number of the sender
      email: { type: String, required: true } // Email of the sender
    }
  },
  appointmentDetails: { // Details of the appointment
    clientFirstName: { type: String, required: true }, // First name of the client
    clientLastName: { type: String, required: true }, // Last name of the client
    serviceName: { type: String, required: true }, // Name of the service
    appointmentDate: { type: Date, required: true }, // Date and time of the appointment
    serviceDescription: { type: String, required: true }, // Description of the service
    servicePrice: { type: Number, required: true } // Price of the service
  }
}, {
  timestamps: true // Enable automatic creation of `createdAt` and `updatedAt` fields
});

// Create and export the Notification model.
const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
export default Notification;
