import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Note from "@/models/Note";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Ebook from "@/models/Ebook";

export async function PUT(req: NextRequest, { params }: { params: { ebookId: string, id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const ebook = await Ebook.findById(params.ebookId);
  if (!ebook || ebook.author.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const note = await Note.findOne({ _id: params.id, ebook: params.ebookId });
  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  const body = await req.json();
  if (body.title) note.title = body.title;
  if (body.content !== undefined) note.content = body.content;
  if (body.chapterId !== undefined) note.chapter = body.chapterId;
  if (body.type !== undefined) note.type = body.type;

  await note.save();
  return NextResponse.json(note);
}
