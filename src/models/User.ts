import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'admin' | 'free' | 'premium';

export type SubscriptionStatus = 
  | 'active'               // Abonnement actif, paiements à jour
  | 'canceled'             // Abonnement annulé (arrêté, plus renouvelé)
  | 'past_due'             // Paiement en retard, abonnement suspendu en attente de régularisation
  | 'trialing'             // Période d’essai en cours, accès temporaire
  | 'unpaid'               // Paiement impayé, abonnement en échec de paiement prolongé
  | 'incomplete'           // Abonnement créé mais paiement non confirmé (ex : échec de la première tentative)
  | 'incomplete_expired'   // Période de paiement incomplète expirée sans succès, abonnement annulé
  | 'paused';              // Abonnement temporairement suspendu (en pause)

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
  subscriptionStatus?: SubscriptionStatus;
  subscriptionCurrentPeriodEnd?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ['admin', 'free', 'premium'],
      default: 'free',
    },
    image: { type: String, required: false },
    stripeCustomerId: { type: String },
    stripeSellerAccountId: { type: String },
    subscriptionStatus: {
      type: String,
      enum: [
        'active',
        'canceled',
        'past_due',
        'trialing',
        'unpaid',
        'incomplete',
        'incomplete_expired',
        'paused',
      ],
    },
    subscriptionCurrentPeriodEnd: { type: Date },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
