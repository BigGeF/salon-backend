//backend/src/models/SocialAccount.ts
import mongoose, { Document, Schema } from 'mongoose';

// Define the ISocialAccount interface
export interface ISocialAccount extends Document {
  ownerId: mongoose.Types.ObjectId; // Reference to the Owner
  provider: string; // Google, Facebook, Apple, etc.
  providerId: string; // Unique ID from the provider (e.g., Google ID)
  accessToken?: string; // OAuth Access Token, if necessary
  refreshToken?: string; // OAuth Refresh Token, if necessary
  expiresIn?: number; // Token expiration time
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the SocialAccount schema
const SocialAccountSchema: Schema = new Schema({
  ownerId: { type: mongoose.Types.ObjectId, ref: 'Owner', required: true },
  provider: { type: String, required: true },
  providerId: { type: String, required: true },
  accessToken: { type: String, required: false },
  refreshToken: { type: String, required: false },
  expiresIn: { type: Number, required: false },
}, { timestamps: true });

// Create and export the SocialAccount model
const SocialAccount = mongoose.model<ISocialAccount>('SocialAccount', SocialAccountSchema);
export default SocialAccount;
