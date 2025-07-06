import mongoose, { Schema, Document, Types } from "mongoose";

export type NoteType = "idea" | "todo" | "reminder" | "question" | "annotation";

export interface INote extends Document {
  /** Référence vers l'ebook lié (obligatoire) */
  ebook: Types.ObjectId;
  /** Référence optionnelle vers un chapitre spécifique */
  chapter?: Types.ObjectId;
  /** Titre ou sujet de la note */
  title?: string;
  /** Contenu de la note, format texte ou Markdown */
  content: string;
  /** Type d’annotation, pour organiser et filtrer */
  type: NoteType;
  /** Date de création */
  createdAt: Date;
  /** Date de dernière mise à jour */
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    ebook: { type: Schema.Types.ObjectId, ref: "Ebook", required: true },
    chapter: { type: Schema.Types.ObjectId, ref: "Chapter" },
    title: { type: String },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ["idea", "todo", "reminder", "question", "annotation"],
      default: "annotation",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);
