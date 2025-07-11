import dbConnect from "@/lib/mongoose";
import Ebook from "@/models/Ebook";
import Note from "@/models/Note";

type UpdateNoteInput = {
  userId: string;
  ebookId: string;
  noteId: string;
  data: {
    title?: string;
    content?: string;
    chapterId?: string;
    type?: string;
  };
};

export async function updateNote({
  userId,
  ebookId,
  noteId,
  data,
}: UpdateNoteInput) {
  await dbConnect();

  const ebook = await Ebook.findById(ebookId);
  if (!ebook || ebook.author.toString() !== userId) {
    throw new Error("Forbidden");
  }

  const note = await Note.findOne({ _id: noteId, ebook: ebookId });
  if (!note) {
    throw new Error("NotFound");
  }

  if (data.title !== undefined) note.title = data.title;
  if (data.content !== undefined) note.content = data.content;
  if (data.chapterId !== undefined) note.chapter = data.chapterId;
  if (data.type !== undefined) note.type = data.type;

  await note.save();

  return note;
}
