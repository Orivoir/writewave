// src/models/Theme.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IEbookTheme extends Document {
  /** Référence à l’auteur (User) ou null si le thème est créé par la plateform (default theme) */
  author?: Types.ObjectId;

  /** Nom affiché du thème, ex: "Retro Typewriter" */
  name: string;

  /** Identifiant unique, ex: "retro-typewriter" */
  identifier: string;

  /** Description optionnelle */
  description?: string;

  /** Police principale, ex: "Georgia, serif" */
  fontFamily: string;

  /** Taille de police, ex: "16px" */
  fontSize: string;

  /** Hauteur de ligne, ex: "1.6" */
  lineHeight: string;

  /** Couleur du texte général, ex: "#111111" */
  textColor: string;

  /** Couleur des titres (h1, h2, etc.), ex: "#222222" */
  titleColor?: string;

  /** Couleur des sous-titres, ex: "#444444" */
  subtitleColor?: string;

  /** Couleur des liens, ex: "#0070f3" */
  linkColor?: string;

  /** Couleur des liens au survol, ex: "#0051a3" */
  linkHoverColor?: string;

  /** Couleur de fond, ex: "#ffffff" */
  backgroundColor: string;

  /** Couleur des bordures, ex: "#cccccc" */
  borderColor?: string;

  /** Couleur pour surlignage ou citations, ex: "#fffa65" */
  highlightColor?: string;

  /** Rayon des bordures, ex: "6px" */
  borderRadius?: string;

  /** Ombre portée, ex: "0 2px 4px rgba(0,0,0,0.1)" */
  boxShadow?: string;

  /** Indique si le thème est accessible publiquement */
  isPublic: boolean;

  /** Date de création */
  createdAt: Date;

  /** Date de dernière modification */
  updatedAt: Date;
}


export type EbookUpdate = Pick<IEbookTheme,
  "description" |
  "fontFamily" |
  "fontSize" |
  "lineHeight" |
  "textColor" |
  "titleColor" |
  "subtitleColor" |
  "linkColor" |
  "linkHoverColor" |
  "backgroundColor" |
  "borderColor" |
  "highlightColor" |
  "borderRadius" |
  "boxShadow" |
  "isPublic"
>;
 

const EbookThemeSchema: Schema<IEbookTheme> = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, default: null },
    name: { type: String, required: true },
    identifier: { type: String, required: true, unique: true },
    description: { type: String },
    fontFamily: { type: String, required: true },
    fontSize: { type: String, default: '16px' },
    lineHeight: { type: String, default: '1.6' },
    textColor: { type: String, default: '#111111' },
    titleColor: { type: String, default: '#222222' },
    subtitleColor: { type: String, default: '#444444' },
    linkColor: { type: String, default: '#0070f3' },
    linkHoverColor: { type: String, default: '#0051a3' },
    backgroundColor: { type: String, default: '#ffffff' },
    borderColor: { type: String, default: '#cccccc' },
    highlightColor: { type: String, default: '#fffa65' },
    borderRadius: { type: String, default: '6px' },
    boxShadow: { type: String, default: '0 2px 4px rgba(0,0,0,0.1)' },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Theme: Model<IEbookTheme> = mongoose.models.EbookTheme || mongoose.model<IEbookTheme>('EbookTheme', EbookThemeSchema);

export default Theme;
