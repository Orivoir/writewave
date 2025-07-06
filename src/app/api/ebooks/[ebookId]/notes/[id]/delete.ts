import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Note from "@/models/Note";
import Ebook from "@/models/Ebook";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
  _: NextRequest,
  { params }: { params: { ebookId: string; id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  // Vérifier que l'ebook appartient bien à l'user connecté
  const ebook = await Ebook.findById(params.ebookId);
  
  if (!ebook || ebook.author.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Chercher la note à supprimer
  const note = await Note.findById(params.id);
  
  if (!note || note.ebook.toString() !== params.ebookId) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  await note.deleteOne();

  return NextResponse.json({ message: "Note deleted" });
}
