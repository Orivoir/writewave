import dbConnect from "@/lib/mongoose";
import Place from "@/models/Place";
import Ebook from "@/models/Ebook";
import type { IPlace } from "@/models/Place";

type UpdatePlaceData = Partial<Omit<IPlace, "_id" | "ebook" | "createdAt">>;

export async function updatePlace({
  ebookId,
  placeId,
  userId,
  data,
}: {
  ebookId: string;
  placeId: string;
  userId: string;
  data: UpdatePlaceData;
}) {
  await dbConnect();

  const ebook = await Ebook.findById(ebookId);

  if (!ebook) throw new Error("Ebook not found");

  if (ebook.author.toString() !== userId) throw new Error("Forbidden");

  const place = await Place.findById(placeId);

  if (!place) throw new Error("Place not found");

  if (place.ebook.toString() !== ebookId)
    throw new Error("Place does not belong to ebook");

  // Mise à jour conditionnelle
  Object.assign(place, data);

  await place.save();
  return place;
}
