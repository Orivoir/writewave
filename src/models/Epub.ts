import mongoose, { Schema, Document, Types } from 'mongoose';

/**
 * Représente un fichier EPUB stocké sur S3.
 */
export interface IEpub extends Document {
  /** Référence vers l'ebook auquel est lié ce fichier (null si créé par la plateforme) */
  ebook?: Types.ObjectId | null;
  /** Clé unique dans le bucket S3 */
  key: string;
  /** URL publique d'accès au fichier */
  url?: string;
  /** Date de création */
  createdAt: Date;
  /** Date de dernière mise à jour */
  updatedAt: Date;
}

const EpubSchema = new Schema<IEpub>({
  ebook: { type: Schema.Types.ObjectId, ref: 'Ebook', default: null },
  key: { type: String, required: true },
  url: { type: String },
}, { timestamps: true });

const Epub = mongoose.models.Epub || mongoose.model<IEpub>('Epub', EpubSchema);

export default Epub;
