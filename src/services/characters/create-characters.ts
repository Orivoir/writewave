import Character from "@/models/Character";
import Ebook from "@/models/Ebook";

interface CreateCharacterInput {
  ebookId: string;
  userId: string;
  name: string;
  gender: string;
  description?: string;
  relations?: Array<{ characterId: string; type: string }>;
}

export async function createCharacter({
  ebookId,
  userId,
  name,
  gender,
  description = "",
  relations = [],
}: CreateCharacterInput) {
  const ebook = await Ebook.findById(ebookId);
  if (!ebook) throw new Error("EbookNotFound");

  if (ebook.author.toString() !== userId) throw new Error("Forbidden");

  const character = new Character({
    ebook: ebookId,
    name,
    gender,
    description,
    relations,
  });

  await character.save();
  return character;
}
