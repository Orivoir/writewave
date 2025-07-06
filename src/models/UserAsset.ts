import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUserAsset extends Document {
  user: Types.ObjectId;
  filename: string;
  key: string; // clé S3 pour manipulation
  url: string;
  size: number;
  mimeType: string;
  createdAt: Date;
}

const UserAssetSchema = new Schema<IUserAsset>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String, required: true },
  key: { type: String, required: true }, // clé S3
  url: { type: String, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.UserAsset || mongoose.model<IUserAsset>("UserAsset", UserAssetSchema);
