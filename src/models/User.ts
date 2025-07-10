import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'admin' | 'customer';

export type UserPreferredLocale = "fr" | "en"

/**
 * Représente un utilisateur de l'application.
 */
export interface IUser extends Document {
  name: string;
  email: string;
  role: UserRole;
  image: string;
  stripeCustomerId?: string;
  stripeSellerAccountId?: string;
  hasUsedTrial: boolean;
  preferredLocale: UserPreferredLocale
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer',
    },
    image: { type: String, required: false },
    stripeCustomerId: { type: String },
    stripeSellerAccountId: { type: String },
    hasUsedTrial: { type: Boolean, required: true, default: false },
    preferredLocale: {
      type: String,
      enum: ["fr", "en"],
      default: "fr"
    }
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
