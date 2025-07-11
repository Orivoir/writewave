import Ebook from "@/models/Ebook";
import Character from "@/models/Character";

interface UpdateCharacterInput {
  ebookId: string;
  characterId: string;
  userId: string;
  name?: string;
  gender?: string;
  description?: string;
  relations?: Array<{ characterId: string; type: string }>;
}

export async function updateCharacter({
  ebookId,
  characterId,
  userId,
  name,
  gender,
  description,
  relations,
}: UpdateCharacterInput) {
  const ebook = await Ebook.findById(ebookId);
  if (!ebook) throw new Error("EbookNotFound");

  if (ebook.author.toString() !== userId) throw new Error("Forbidden");

  const character = await Character.findById(characterId);
  if (!character) throw new Error("CharacterNotFound");

  if (name !== undefined) character.name = name;
  if (gender !== undefined) character.gender = gender;
  if (description !== undefined) character.description = description;
  if (Array.isArray(relations)) character.relations = relations;

  await character.save();
  return character;
}
