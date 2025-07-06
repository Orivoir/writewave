import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Note from "@/models/Note";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Ebook from "@/models/Ebook";

export async function POST(req: NextRequest, { params }: { params: { ebookId: string } }) {
  
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const ebook = await Ebook.findById(params.ebookId);

  if (!ebook || ebook.author.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  if (!body.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const note = await Note.create({
    ebook: params.ebookId,
    chapter: body.chapterId || undefined,
    title: body.title,
    content: body.content || "",
    type: body.type || "annotation",
  });

  return NextResponse.json(note);
}
