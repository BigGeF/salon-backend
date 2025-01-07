import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  salonId: mongoose.Types.ObjectId;
  appointmentDate: 'walk-in' | 'return-client' | 'new-client';
  type: Date;
  employee?: {
    id?: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
  };
  service: {
    id?: mongoose.Types.ObjectId;
    name: string;
    price: number;
    duration: number;
  };
  client: {
    id?: mongoose.Types.ObjectId;
    firstName: string;
    lastName?: string;
    phone: string;
  }
  note?: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  paymentId?: mongoose.Types.ObjectId;
  createdAt?: Date; // Timestamp for when the document was created
  updatedAt?: Date; // Timestamp for when the document was last updated
}

const AppointmentSchema: Schema = new Schema({
  salonId: { type: mongoose.Types.ObjectId, ref: 'Salon', required: true },
  appointmentDate: { type: Date, required: true },
  type: { type: String, enum: ['walk-in', 'return-client', 'new-client'], default: 'walk-in' },
  employee: {
    id: { type: mongoose.Types.ObjectId, ref: 'Employee', required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
  },
  service: {
    id: { type: mongoose.Types.ObjectId, ref: 'Service' },
    name: { type: String, required: false },
    price: { type: Number, required: false },
    duration: { type: Number, required: false },
  },
  client: {
    id: { type: mongoose.Types.ObjectId, ref: 'Client', required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    phone: { type: String, required: false },
  },
  note: { type: String, required: false },
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  paymentId: { type: mongoose.Types.ObjectId, ref: 'Payment', required: false },
}, {
  timestamps: true // Enable automatic creation of `createdAt` and `updatedAt` fields
});

// export interface IAppointment extends Document {
//   salonId: mongoose.Types.ObjectId;
//   employeeId?: mongoose.Types.ObjectId;
//   employeeFullName?:string,
//   serviceId: mongoose.Types.ObjectId;
//   serviceName: string;
//   serviceDescription: string;
//   servicePrice: number;
//   serviceDuration: number;
//   appointmentDate: Date;
//   status: 'confirmed' | 'cancelled' | 'completed';
//   paymentId?: mongoose.Types.ObjectId;
//   clientId?: mongoose.Types.ObjectId; // Optional, in case there is a registered client
//   tempClient?: {
//     firstName: string;
//     lastName?: string;
//     phone: string;
//     email?: string;
//   }; // Temporary client information
//   note?: string; // Optional, additional note for the appointment (optional)
//   createdAt?: Date; // Timestamp for when the document was created
//   updatedAt?: Date; // Timestamp for when the document was last updated
// }
//
// const AppointmentSchema: Schema = new Schema({
//   salonId: { type: mongoose.Types.ObjectId, ref: 'Salon' },
//   employeeId: { type: mongoose.Types.ObjectId, ref: 'Employee', required: false },
//   employeeFullName: { type: String, required: false },  // Full name of the employee (optional)
//   serviceId: { type: mongoose.Types.ObjectId, ref: 'Service' },
//   serviceName: { type: String, required: true },
//   serviceDescription: { type: String, required: true },
//   servicePrice: { type: Number, required: true },
//   serviceDuration: { type: Number, required: true},
//   appointmentDate: { type: Date, required: true },
//   status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
//   paymentId: { type: mongoose.Types.ObjectId, ref: 'Payment', required: false },
//   clientId: { type: mongoose.Types.ObjectId, ref: 'Client', required: false },
//   tempClient: {
//     firstName: { type: String, required: false },
//     lastName: { type: String, required: false },
//     phone: { type: String, required: false },
//     email: { type: String, required: false }
//   },
//   note: { type: String, required: false }
// }, {
//   timestamps: true // Enable automatic creation of `createdAt` and `updatedAt` fields
// });

const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
export default Appointment;
