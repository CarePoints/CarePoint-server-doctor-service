import mongoose, { Schema, Document } from 'mongoose';


// Define the User interface (embedded subdocument)
export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber?: string;
  profilePic?: string;
}

// Define the Appointment interface for the doctor
export interface IDoctorAppointment extends Document {
  doctorId: string;  // Reference to the doctor
  user: IUser;       // Full user data
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed';
  appointmentType?: string;
  notes?: string;    // Additional notes for the doctor
  createdAt: Date;
  updatedAt: Date;
}

// Define the Doctor Appointment schema
const DoctorAppointmentSchema: Schema = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    user: {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      email: { type: String, required: true },
      phoneNumber: { type: String },
      profilePic: { type: String },
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'canceled', 'completed'],
      default: 'pending',
    },
    appointmentType: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields
  }
);

// Create the Doctor Appointment model
const DoctorAppointment = mongoose.model<IDoctorAppointment>('DoctorAppointment', DoctorAppointmentSchema);

export default DoctorAppointment;
