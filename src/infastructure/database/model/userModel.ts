import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  phonenumber?: string;
  isBlocked: boolean;
  isVerified: boolean;
  roles: string;
  otp?: number;
  createdAt?: Date;
  profilePic?: string | null;
  specialization: string;
  licenseNumber: string;
  certificationDetails: string;
  yearsOfExperience?: number;
  residentialAddress: string;
  practiceAddress?: string;
  workingHours: string;
  consultationTypes: string[];
  alternativePhoneNumber: string;
  alternateEmail: string;
  bio: string;
  onCallAvailability: string;
}

const UserSchema = new Schema<UserDocument>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phonenumber: { type: String },
  isBlocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  roles: { type: String, default: "doctor" },
  otp: { type: Number },
  createdAt: { type: Date, default: Date.now },
  profilePic: { type: String, default: null },
  specialization: { type: String },
  licenseNumber: { type: String},
  certificationDetails: { type: String },
  yearsOfExperience: { type: Number },
  residentialAddress: { type: String },
  practiceAddress: { type: String},
  workingHours: { type: String },
  consultationTypes: [{ type: String }],
  alternativePhoneNumber: { type: String },
  alternateEmail: { type: String },
  bio: { type: String },
  onCallAvailability: { type: String }

});


export const User = mongoose.model<UserDocument>("doctor", UserSchema);
