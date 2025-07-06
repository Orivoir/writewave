// src/models/Chapter.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * Représente un chapitre d'un ebook.
 */
export interface IChapter extends Document {
  /** Référence vers l'ebook auquel ce chapitre appartient */
  ebook: Types.ObjectId;
  /** Titre du chapitre */
  title: string;
  /** Slug utilisé dans l'URL pour identifier ce chapitre */
  slug: string;
  /** Ordre de ce chapitre dans la table des matières */
  order: number;
  /** Contenu du chapitre au format Markdown */
  content: string;
  /** Résumé ou extrait court du chapitre */
  summary?: string;
  /** Indique si ce chapitre est un brouillon (non publié) */
  draft: boolean;
  /** Clé S3 pour image associée au chapitre (couverture, illustration) */
  featuredImageKey?: string;
  /** URL publique vers l'image associée */
  featuredImageUrl?: string;
  /** Estimation du temps de lecture en minutes */
  readingTime?: number;
  /** Date de création du chapitre */
  createdAt: Date;
  /** Date de dernière mise à jour */
  updatedAt: Date;
}

const ChapterSchema: Schema<IChapter> = new Schema(
  {
    ebook: { type: Schema.Types.ObjectId, ref: 'Ebook', required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    order: { type: Number, required: true },
    content: { type: String, default: '' },
    summary: { type: String },
    draft: { type: Boolean, default: true },
    featuredImageKey: { type: String },
    featuredImageUrl: { type: String },
    readingTime: { type: Number },
  },
  { timestamps: true }
);

const Chapter: Model<IChapter> = mongoose.models.Chapter || mongoose.model<IChapter>('Chapter', ChapterSchema);

export default Chapter;
