// src/models/Ebook.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import Chapter from './Chapter';
import Character from './Character';
import Place from './Place';

export type EbookVisibility = 
  /** Brouillon, non visible par les utilisateurs */
  | 'draft' 
  /** Privé, visible uniquement par l’auteur */
  | 'private' 
  /** Public, visible par tous */
  | 'public' 
  /** Restreint, visible par certains utilisateurs (ex : beta readers) */
  | 'restricted' 
  /** Archivé, retiré de la publication active */
  | 'archived';

export interface IEbook extends Document {
  /** Référence à l’auteur (User) */
  author: Types.ObjectId;

  /** Titre de l’ebook */
  title: string;

  /** Identifiant unique pour l’URL */
  slug: string;

  /** Description courte ou résumé de l’ebook */
  description?: string;

  /** URL de l’image de couverture */
  coverImage?: string;

  /** Clé pour indexer la couverture dans le bucket S3 */
  coverImageKey?: string;

  /** Référence au thème (EbookTheme) appliqué */
  theme: Types.ObjectId;

  /** Liste de tags/catégories associés */
  tags?: string[];

  /**
   * Statut de publication et visibilité.
   * Valeurs possibles :
   * - 'draft' : brouillon, non visible par les utilisateurs
   * - 'private' : privé, visible uniquement par l’auteur
   * - 'public' : public, visible par tous
   * - 'restricted' : restreint, visible par certains utilisateurs
   * - 'archived' : archivé, retiré de la publication active
   */
  visibility: EbookVisibility;

  /** Indique si l’ebook est mis en vente */
  isForSale: boolean;

  /** ID du prix Stripe associé pour la vente */
  stripePriceId?: string;

  /** Date de création */
  createdAt: Date;

  /** Date de dernière mise à jour */
  updatedAt: Date;
}

const EbookSchema: Schema<IEbook> = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    coverImage: { type: String },
    coverImageKey: { type: String },
    theme: { type: Schema.Types.ObjectId, ref: 'EbookTheme' },
    tags: [{ type: String }],
    visibility: {
      type: String,
      enum: ['draft', 'private', 'public', 'restricted', 'archived'],
      default: 'draft',
    },
    isForSale: { type: Boolean, default: false },
    stripePriceId: { type: String },
  },
  { timestamps: true }
);

const Ebook: Model<IEbook> = mongoose.models.Ebook || mongoose.model<IEbook>('Ebook', EbookSchema);

export default Ebook;

// Suppression des documents orphelins liés à l’ebook
EbookSchema.pre('findOneAndDelete', async function (next) {
  const doc: any = await this.model.findOne(this.getFilter());
  if (doc) {
    await Chapter.deleteMany({ ebook: doc._id });
    await Character.deleteMany({ ebook: doc._id });
    await Place.deleteMany({ ebook: doc._id });
  }
  next();
});
