// src/services/characters/deleteCharacter.ts
import dbConnect from "@/lib/mongoose";
import Character from "@/models/Character";
import Ebook from "@/models/Ebook";

export async function deleteCharacter({ ebookId, characterId, userId }: {
  ebookId: string;
  characterId: string;
  userId: string;
}) {
  await dbConnect();

  const ebook = await Ebook.findById(ebookId);
  if (!ebook) throw new Error("Ebook not found");

  if (ebook.author.toString() !== userId) {
    const err = new Error("Forbidden");
    // @ts-ignore
    err.status = 403;
    throw err;
  }

  const character = await Character.findOne({ _id: characterId, ebook: ebookId });
  if (!character) throw new Error("Character not found");

  await character.deleteOne();

  return character;
}
