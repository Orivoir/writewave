import mongoose, { Schema, Document, Types } from "mongoose";

export type PlaceType =
  | "building"
  | "village"
  | "castle"
  | "forest"
  | "city"
  | "region"
  | "country"
  | "dungeon"
  | "ship"
  | "room"
  | "landmark"
  | "natural_feature"
  | "other";

export type ClimateType =
  | "temperate"
  | "arid"
  | "tropical"
  | "polar"
  | "continental"
  | "mountain"
  | "marine"
  | "other";

/**
 * Interface représentant un lieu ou environnement dans un ebook.
 */
export interface IPlace extends Document {
  /** Référence vers l'ebook auquel appartient ce lieu */
  ebook: Types.ObjectId;
  /** Nom du lieu (ex : Château de Winterfell) */
  name: string;
  /** Type de lieu (ex : village, château, forêt) */
  type?: PlaceType;
  /** Description publique du lieu, visible par le lecteur */
  description?: string;

  /** Référence à un lieu parent (ex : un village dans une région) */
  parentPlace?: Types.ObjectId;
  /** Type de climat (ex : tempéré, désertique) - utile pour l’ambiance ou filtres thématiques */
  climate?: ClimateType;
  /** Importance relative du lieu (ex : capitale, secondaire) */
  importance?: "primary" | "secondary" | "tertiary";
  /** Notes privées pour l’auteur, idées ou rappels non visibles dans la description publique */
  notes?: string;
  /** Date de création du document */
  createdAt: Date;
}

const PlaceSchema = new Schema<IPlace>({
  ebook: { type: Schema.Types.ObjectId, ref: "Ebook", required: true },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "building",
      "village",
      "castle",
      "forest",
      "city",
      "region",
      "country",
      "dungeon",
      "ship",
      "room",
      "landmark",
      "natural_feature",
      "other",
    ],
    default: "other",
  },
  description: { type: String },
  parentPlace: { type: Schema.Types.ObjectId, ref: "Place" },
  climate: {
    type: String,
    enum: [
      "temperate",
      "arid",
      "tropical",
      "polar",
      "continental",
      "mountain",
      "marine",
      "other",
    ],
  },
  importance: { type: String, enum: ["primary", "secondary", "tertiary"] },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Place || mongoose.model<IPlace>("Place", PlaceSchema);
