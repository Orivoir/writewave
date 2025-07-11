// src/services/notes/createNote.ts
import dbConnect from "@/lib/mongoose";
import Ebook from "@/models/Ebook";
import Note from "@/models/Note";

type CreateNoteInput = {
  ebookId: string;
  userId: string;
  title: string;
  content?: string;
  chapterId?: string;
  type?: "annotation" | string;
};

export async function createNote({
  ebookId,
  userId,
  title,
  content = "",
  chapterId,
  type = "annotation",
}: CreateNoteInput) {
  await dbConnect();

  const ebook = await Ebook.findById(ebookId);
  if (!ebook) throw new Error("Ebook not found");

  if (ebook.author.toString() !== userId) {
    const err = new Error("Forbidden");
    // @ts-ignore
    err.status = 403;
    throw err;
  }

  const note = new Note({
    ebook: ebookId,
    chapter: chapterId || undefined,
    title,
    content,
    type,
  });

  await note.save()

  return note;
}
