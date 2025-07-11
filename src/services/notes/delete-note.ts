import dbConnect from "@/lib/mongoose";
import Ebook from "@/models/Ebook";
import Note from "@/models/Note";

export async function deleteNote({
  userId,
  ebookId,
  noteId,
}: {
  userId: string;
  ebookId: string;
  noteId: string;
}) {
  await dbConnect();

  const ebook = await Ebook.findById(ebookId);
  if (!ebook || ebook.author.toString() !== userId) {
    throw new Error("Forbidden");
  }

  const note = await Note.findById(noteId);
  if (!note || note.ebook.toString() !== ebookId) {
    throw new Error("NotFound");
  }

  await note.deleteOne();

  return {
    success: true,
    deletedNote: {
      id: note._id,
      title: note.title,
      chapter: note.chapter,
      type: note.type,
    },
  };
}
