// src/services/places/createPlace.ts
import dbConnect from "@/lib/mongoose";
import Ebook from "@/models/Ebook";
import Place from "@/models/Place";
import type { IPlace } from "@/models/Place";

type CreatePlaceData = Omit<
  IPlace,
  "_id" | "createdAt" | "ebook" | "parentPlace"
> & {
  parentPlace?: string; // Si tu veux autoriser un string ici plutôt qu’un ObjectId direct
};

export type CreatePlaceInput = {
  userId: string;
  ebookId: string;
  data: CreatePlaceData;
};


export async function createPlace({ userId, ebookId, data }: CreatePlaceInput) {
  await dbConnect();

  // Vérification de l’auteur de l’ebook
  const ebook = await Ebook.findById(ebookId);
  if (!ebook || ebook.author.toString() !== userId) {
    throw new Error("Forbidden");
  }

  if (!data.name || typeof data.name !== "string") {
    throw new Error("InvalidName");
  }

  const place = new Place({
    ebook: ebookId,
    name: data.name,
    type: data.type,
    description: data.description,
    parentPlace: data.parentPlace,
    climate: data.climate,
    importance: data.importance,
    notes: data.notes,
  });

  await place.save();
  return place;
}
