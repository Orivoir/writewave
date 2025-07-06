import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * Représente une relation entre personnages.
 */
export interface IRelation {
  /** Référence vers le personnage lié */
  character: Types.ObjectId;
  /** Type de relation (ex : parent, sibling, enemy) */
  type: "parent" | "child" | "sibling" | "spouse" | "enemy" | "friend";
}

/**
 * Représente un personnage lié à un ebook.
 */
export interface ICharacter extends Document {
  /** Référence vers l'ebook auquel appartient ce personnage */
  ebook: Types.ObjectId;
  /** Nom du personnage */
  name: string;
  /** Genre du personnage */
  gender?: "male" | "female" | "other" | "animal";
  /** Description textuelle du personnage */
  description?: string;
  /** Liste des relations avec d'autres personnages */
  relations?: IRelation[];
  /** Date de création du personnage */
  createdAt: Date;
}

const RelationSchema = new Schema<IRelation>({
  character: { type: Schema.Types.ObjectId, ref: "Character", required: true },
  type: { 
    type: String, 
    enum: ["parent", "child", "sibling", "spouse", "enemy", "friend"], 
    required: true 
  },
});

const CharacterSchema = new Schema<ICharacter>({
  ebook: { type: Schema.Types.ObjectId, ref: "Ebook", required: true },
  name: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other", "animal"] },
  description: { type: String },
  relations: { type: [RelationSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Character || mongoose.model<ICharacter>("Character", CharacterSchema);
