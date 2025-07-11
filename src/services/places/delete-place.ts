import dbConnect from "@/lib/mongoose";
import Place from "@/models/Place";
import Ebook from "@/models/Ebook";

export async function deletePlace({ ebookId, placeId, userId }: { ebookId: string; placeId: string; userId: string }) {
  await dbConnect();

  // Vérifier que l'ebook appartient bien à l'user
  const ebook = await Ebook.findById(ebookId);
  if (!ebook) throw new Error("Ebook not found");
  if (ebook.author.toString() !== userId) throw new Error("Forbidden");

  // Chercher la place
  const place = await Place.findById(placeId);
  if (!place) throw new Error("Place not found");

  if (place.ebook.toString() !== ebookId) throw new Error("Place does not belong to ebook");

  await place.deleteOne();

  return place
}
